# backend/app/tests/db/test_models.py

from sqlalchemy import inspect
from app.core.database import engine  # ton moteur SQLAlchemy
from app.models import user  # pour enregistrer les modèles
from app.db.base_class import Base


def test_users_table_exists():
    # Crée toutes les tables dans une base temporaire
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    tables = inspector.get_table_names()
    assert "users" in tables, "❌ La table 'users' n'existe pas dans la base."
