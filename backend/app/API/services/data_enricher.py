# services/data_enricher.py

import asyncio
from datetime import datetime
import httpx
import os
from bs4 import BeautifulSoup


class ETFEnricher:
    def __init__(self):
        self.cache = {}

    async def enrich_from_vintage(self, ticker: str):
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": ticker,
            "apikey": os.getenv("ALPHA_VANTAGE_KEY"),
            "outputsize": "full"
        }
        async with httpx.AsyncClient() as client:
            response = await client.get("https://www.alphavantage.co/query", params=params)
            return response.json().get("Time Series (Daily)", {})

    async def enrich_from_justetf(self, isin: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://www.justetf.com/en/etf-profile.html?isin={isin}")
            soup = BeautifulSoup(response.text, 'html.parser')
            return {
                "ter": float(soup.find("span", {"class": "ter"}).text.strip('%')),
                "distribution": soup.find("div", {"class": "distribution"}).text.strip()
            }

    async def get_full_etf_data(self, ticker: str):
        if ticker in self.cache:
            return self.cache[ticker]

        data = {
            "metadata": {
                "ticker": ticker,
                "last_updated": datetime.now().isoformat(),
                "sources": ["alpha_vantage"]
            }
        }

        # Appel Alpha Vantage uniquement
        try:
            vintage_data = await self.enrich_from_vintage(ticker)
            data["price_data"] = self._transform_vintage_data(vintage_data)
        except Exception as e:
            data["price_data"] = {}
            print(f"[ERROR] enrich_from_vintage failed: {e}")

        self.cache[ticker] = data
        return data

    def _transform_vintage_data(self, raw_data):
        return {
            date: {
                "open": float(values["1. open"]),
                "close": float(values["4. close"])
            } for date, values in raw_data.items()
        }
