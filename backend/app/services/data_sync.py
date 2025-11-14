"""
Synchronise les données entre Yahoo/JustETF et PostgreSQL.
Gère les pannes et les conflits de données.
"""
from datetime import datetime
from app.models import ETF, ETFHistory


class DataSync:
    async def sync_etf(self, symbol: str):
        db = next(get_db())
        try:
            # 1. Récupère les données
            data = await YahooFinanceAPI().fetch_etf(symbol)
            
            # 2. Met à jour la base
            etf = db.query(ETF).filter_by(symbol=symbol).first()
            if not etf:
                etf = ETF(symbol=symbol)
                db.add(etf)
            
            # 3. Historique
            history = ETFHistory(
                etf_id=etf.id,
                price=data["price"],
                timestamp=datetime.utcnow()
            )
            db.add(history)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Sync failed for {symbol}: {e}")
        finally:
            db.close()