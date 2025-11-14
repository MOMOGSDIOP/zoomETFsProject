from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.settings import settings

DATABASE_URL = settings.database_url

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# Importer tous les modèles ici pour qu'ils soient enregistrés dans Base.metadata
from app.models.User import User
# from app.models.ETF import ETF
# from app.models.ETFHistory import ETFHistory
# etc.
