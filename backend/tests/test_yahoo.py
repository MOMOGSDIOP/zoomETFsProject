import pytest
from unittest.mock import AsyncMock, patch
from app.services import yahoo

@pytest.mark.asyncio
async def test_fetch_etf_success():
    """Teste une récupération réussie."""
    with patch('httpx.AsyncClient.get', new_callable=AsyncMock) as mock_get:
        mock_get.return_value.json.return_value = {
            "symbol": "VOO",
            "price": 350.0,
            "currency": "USD"
        }
        data = await YahooFinanceAPI().fetch_etf("VOO")
        assert data["price"] == 350.0

@pytest.mark.asyncio
async def test_fetch_etf_retry():
    """Teste la logique de retry après échec."""
    with patch('httpx.AsyncClient.get', side_effect=Exception("API down")):
        with pytest.raises(Exception, match="Failed after 3 attempts"):
            await YahooFinanceAPI().fetch_etf("VOO")