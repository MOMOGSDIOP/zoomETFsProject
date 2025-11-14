# app/core/init_db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.settings import settings
from app.db.base_class import Base  # ⚠️ utiliser base_class, pas database
from app.models.User import User

def init():
    print("📦 Création des tables via SQLAlchemy...")

    # ✅ Engine synchrone pour init
    engine = create_engine(settings.database_url, echo=True)  # echo=True pour debug

    # ✅ Création des tables
    Base.metadata.create_all(bind=engine)
    print("✅ Tables créées.")

    # ✅ Session pour interaction DB
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    # ✅ Création admin si inexistant
    try:
        if not session.query(User).filter_by(email="admin@example.com").first():
            admin = User(email="admin@example.com", hashed_password="fakehash", is_verified=True)
            session.add(admin)
            session.commit()
            print("✅ Admin créé.")
        else:
            print("ℹ️ Admin déjà présent.")
    except Exception as e:
        print(f"❌ Erreur lors de la création de l'admin: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    init()
