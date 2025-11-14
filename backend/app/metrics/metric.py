import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# --- Simulation des données historiques ---
np.random.seed(42)
jours = 252  # 1 an de bourse
rendement_index_journalier = np.random.normal(0.0005, 0.01, jours)  # ~12.5% annuel
rendement_etf_journalier = rendement_index_journalier - 0.0002 + np.random.normal(0, 0.0005, jours)  # léger écart

prix_index = 4000 * np.cumprod(1 + rendement_index_journalier)
prix_etf = 400 * np.cumprod(1 + rendement_etf_journalier)

df = pd.DataFrame({
    "Index": prix_index,
    "ETF": prix_etf
})

# --- Mise en base 100 ---
base_index = df["Index"] / df["Index"].iloc[0] * 100
base_etf = df["ETF"] / df["ETF"].iloc[0] * 100


# --- Fonctions ---
def tracking_error(rendements_fonds, rendements_index):
    diff = rendements_fonds - rendements_index
    return np.std(diff) * np.sqrt(252) * 100  # annualisé en %

def tracking_difference_annuelle(rendements_fonds, rendements_index):
    return (np.prod(1 + rendements_fonds) / np.prod(1 + rendements_index) - 1) * 100

def calcul_alpha_beta(rendements_fonds, rendements_index, taux_sans_risque=0.02):
    rf_daily = taux_sans_risque / 252
    X = rendements_index - rf_daily
    Y = rendements_fonds - rf_daily
    beta = np.cov(Y, X)[0, 1] / np.var(X)
    alpha = (np.mean(Y) - beta * np.mean(X)) * 252  # annualisé
    return alpha * 100, beta

def max_drawdown(serie_prix):
    roll_max = np.maximum.accumulate(serie_prix)
    drawdown = (serie_prix - roll_max) / roll_max
    return drawdown.min() * 100

def information_ratio(rendements_fonds, rendements_index):
    active_return = np.mean(rendements_fonds - rendements_index) * 252
    te = tracking_error(rendements_fonds, rendements_index) / 100
    return active_return / te


def calculer_metriques(df):
    """
    Calcule les métriques de performance d'un ETF par rapport à un indice.
    """
    rend_fonds = df["ETF"].pct_change().dropna()
    rend_index = df["Index"].pct_change().dropna()

    te = tracking_error(rend_fonds, rend_index)
    td = tracking_difference_annuelle(rend_fonds, rend_index)
    alpha, beta = calcul_alpha_beta(rend_fonds, rend_index)
    mdd = max_drawdown(df["ETF"])
    ir = information_ratio(rend_fonds, rend_index)

    return {
        "Tracking Error (%)": round(te, 3),
        "Tracking Difference (%)": round(td, 3),
        "Alpha (%)": round(alpha, 3),
        "Beta": round(beta, 3),
        "Max Drawdown (%)": round(mdd, 3),
        "Information Ratio": round(ir, 3)
    }


def plot_performance(base_index, base_etf):
    """
    Affiche un graphique comparant l'indice et l'ETF en base 100 et la différence cumulée en %.
    """
    fig, ax1 = plt.subplots(figsize=(10, 5))

    # Performances relatives (axe gauche)
    ax1.plot(base_index, label="Indice (base 100)", color="blue", linewidth=2)
    ax1.plot(base_etf, label="ETF (base 100)", color="orange", linewidth=2)
    ax1.set_xlabel("Jours boursiers")
    ax1.set_ylabel("Performance relative (base 100)", color="blue")
    ax1.tick_params(axis="y", labelcolor="blue")


    # Légende combinée
    lines = ax1.get_lines() 
    labels = [line.get_label() for line in lines]
    ax1.legend(lines, labels, loc="upper left")

    plt.title("Indice vs ETF : comparaison en base 100 et différence cumulée (%)")
    plt.grid(True)
    plt.show()


if __name__ == "__main__":
    resultats = calculer_metriques(df)
    for k, v in resultats.items():
        print(f"{k}: {v}")
    plot_performance(base_index, base_etf)
