"""
Endpoints FastAPI pour les ETFs
"""

from fastapi import APIRouter, HTTPException
from app.services import yahoo
router = APIRouter(prefix="/etfs", tags=["ETFs"])

@router.get("/{symbol}")
async def get_etf(symbol: str):
    """
    Récupère les données d'un ETF par son symbole
    Example:
    - GET /etfs/VOO → Données du S&P 500 ETF
    """
    try:
        return await YahooFinanceService.get_etf_data(symbol.upper())
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(500, detail=str(e))



@router.get("/")
async def compare_etfs(symbols: str):
    """
    Compare plusieurs ETFs (séparés par des virgules)
    Example:
    - GET /etfs/?symbols=VOO,IEUR → Compare 2 ETFs
    """
    try:
        symbol_list = [s.strip().upper() for s in symbols.split(",")]
        return await YahooFinanceService.get_multiple_etfs(symbol_list)
    except Exception as e:
        raise HTTPException(400, detail=f"Format invalide: {str(e)}")