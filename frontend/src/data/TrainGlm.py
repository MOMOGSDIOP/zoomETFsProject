
import pandas as pd
from sklearn.linear_model import LinearRegression

# Chargement du dataset
df = pd.read_csv('etfs.csv')

# Si age n'existe pas, calculer depuis la date d'inception
if 'age' not in df.columns and 'inceptionDate' in df.columns:
    df['age'] = pd.to_datetime('today').year - pd.to_datetime(df['inceptionDate']).dt.year

# Normalisations réalistes (bornes données)
def normalize(val, min_val, max_val):
    return max(0, min(1, (val - min_val) / (max_val - min_val)))

def inverse_normalize(val, min_val, max_val):
    return 1 - normalize(val, min_val, max_val)

df['performance_n'] = df['performance'].apply(lambda x: normalize(x, 0, 20))
df['volatility_n'] = df['volatility'].apply(lambda x: inverse_normalize(x, 5, 30))
df['ter_n'] = df['TER'].apply(lambda x: inverse_normalize(x, 0, 1))
df['dividend_n'] = df['dividendYield'].apply(lambda x: normalize(x, 0, 5))
df['age_n'] = df['age'].apply(lambda x: min(x, 30) / 30)
df['volume_n'] = df['volume'].apply(lambda x: min(x, 5_000_000) / 5_000_000)

# Variables explicatives
X = df[['performance_n', 'volatility_n', 'ter_n', 'dividend_n', 'age_n', 'volume_n']]

# Variable cible (ex : score historique ou note cible)
y = df['score']

# Entraînement du modèle
model = LinearRegression()
model.fit(X, y)

# Récupérer les coefficients
beta = {
    'intercept': model.intercept_,
    'performance': model.coef_[0],
    'volatility': model.coef_[1],
    'ter': model.coef_[2],
    'dividend': model.coef_[3],
    'age': model.coef_[4],
    'volume': model.coef_[5],
}

print("Coefficients beta appris :")
for k, v in beta.items():
    print(f"{k}: {v:.4f}")
