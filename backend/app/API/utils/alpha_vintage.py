import httpx
from datetime import datetime, timedelta

async def fetch_enriched_etf_data(api_key: str, ticker: str):
    async with httpx.AsyncClient() as client:
        # Time Series Data (fonctionne bien)
        ts_params = {
            "function": "TIME_SERIES_DAILY_ADJUSTED",  # version ajustée
            "symbol": ticker,
            "apikey": api_key,
            "outputsize": "full"  # permet de récupérer l’historique complet
        }
        ts_response = await client.get("https://www.alphavantage.co/query", params=ts_params)
        ts_data = ts_response.json()

        if "Error Message" in ts_data or "Note" in ts_data:
            raise Exception(f"Alpha Vantage API error: {ts_data.get('Error Message', ts_data.get('Note'))}")

        # ETF Specific Data
        etf_params = {
            "function": "OVERVIEW",
            "symbol": ticker,
            "apikey": api_key
        }
        etf_response = await client.get("https://www.alphavantage.co/query", params=etf_params)
        etf_data = etf_response.json()

        time_series = ts_data.get("Time Series (Daily)", {})
        if not time_series:
            raise Exception("No time series data available")

        # Trier et filtrer sur 1 an
        sorted_dates = sorted(time_series.keys())
        one_year_ago = (datetime.now() - timedelta(days=365)).strftime("%Y-%m-%d")
        filtered_series = {
            date: vals for date, vals in time_series.items() if date >= one_year_ago
        }

        # Dernière valeur
        latest_date = sorted_dates[-1]
        latest = time_series[latest_date]

        # Données de base pour tous les ETFs
        base_data = {
            "symbol": ticker,
            "last_updated": datetime.now().isoformat(),
            "price_data": {
                "date": latest_date,
                "open": float(latest["1. open"]),
                "high": float(latest["2. high"]),
                "low": float(latest["3. low"]),
                "close": float(latest["4. close"]),
                "volume": int(latest["6. volume"]) if "6. volume" in latest else int(latest["5. volume"]),
                "change": (float(latest["4. close"]) - float(latest["1. open"])) / float(latest["1. open"]) * 100
            },
            "time_series": filtered_series  # ⬅️ Ajout de toute la série sur 1 an
        }

        # --- Calculs supplémentaires (à partir de la série filtrée) ---
        closes = [float(v["4. close"]) for v in filtered_series.values()]
        if len(closes) > 2:
            perf_1y = (closes[-1] / closes[0] - 1) * 100
            returns = [(closes[i] / closes[i-1] - 1) for i in range(1, len(closes))]
            vol_1y = (pd.Series(returns).std() * (252 ** 0.5)) * 100 if returns else None

            base_data["price_data"].update({
                "performance_1y_pct": round(perf_1y, 2),
                "volatility_1y_pct": round(vol_1y, 2) if vol_1y else None
            })

        # Données supplémentaires si disponibles
        if "Name" in etf_data:
            additional_data = {
                "name": etf_data.get("Name"),
                "description": etf_data.get("Description"),
                "sector": etf_data.get("Sector"),
                "asset_type": etf_data.get("AssetType"),
                "isin": etf_data.get("ISIN"),
                "market_cap": etf_data.get("MarketCapitalization"),
                "dividend_yield": etf_data.get("DividendYield"),
                "pe_ratio": etf_data.get("PERatio"),
                "beta": etf_data.get("Beta")
            }
            return {**base_data, **additional_data}
        
        # Fallback pour les ETFs sans données supplémentaires
        return {
            **base_data,
            "name": f"ETF {ticker}",
            "asset_type": "ETF",
            "sector": "Diversifié"
        }


import matplotlib.pyplot as plt
import pandas as pd

def plot_etf_time_series(etf_data):
    """
    Affiche l'évolution du cours de clôture d'un ETF sur 1 an.
    etf_data : dict retourné par fetch_enriched_etf_data
    """
    if "time_series" not in etf_data:
        raise ValueError("Pas de time_series dans les données ETF")

    # Transformer la série en DataFrame
    df = pd.DataFrame.from_dict(etf_data["time_series"], orient="index")
    df.index = pd.to_datetime(df.index)
    df = df.sort_index()

    # S'assurer que la colonne '4. close' existe
    if "4. close" not in df.columns:
        raise ValueError("Les données ne contiennent pas '4. close'")

    df["4. close"] = df["4. close"].astype(float)

    # Tracer le graphique
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df["4. close"], label=etf_data.get("name", etf_data["symbol"]), linewidth=2)
    plt.title(f"Évolution sur 1 an : {etf_data.get('name', etf_data['symbol'])}")
    plt.xlabel("Date")
    plt.ylabel("Cours de clôture (USD)")
    plt.legend()
    plt.grid(True)
    plt.show()
