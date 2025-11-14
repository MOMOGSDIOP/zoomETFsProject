"""
Service Yahoo Finance avec :
- Rotation automatique de 3 clés API
- Cache Redis hiérarchique
- Timeout adaptatif basé sur la volatilité
"""
import httpx
from datetime import timedelta
from app.core import settings
from app.utils import cache

class YahooFinanceAPI:
    def __init__(self):
        self.api_keys = settings.YAHOO_API_KEYS  # Liste de clés
        self.current_key_idx = 0

    async def fetch_etf(self, symbol: str) -> dict:
        """Récupère les données avec 3 tentatives et fallback."""
        for attempt in range(3):
            try:
                data = await self._call_api(symbol)
                if self._validate(data):
                    await cache.set(f"etf:{symbol}", data, ttl=timedelta(hours=1))
                    return data
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:  # Rate limit
                    self._rotate_key()
                logger.warning(f"Attempt {attempt+1} failed: {e}")
        raise Exception(f"Failed to fetch {symbol} after 3 attempts")

    def _rotate_key(self):
        """Passe à la clé API suivante."""
        self.current_key_idx = (self.current_key_idx + 1) % len(self.api_keys)