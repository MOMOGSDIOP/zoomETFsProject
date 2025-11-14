# backend/app/services/user_service.py
from sqlalchemy.orm import Session
from app.models.User import User
from app.db.database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, hashed_password: str) -> User:
    db_user = User(email=email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_password(db: Session, email: str, new_password: str) -> User:
    user = get_user_by_email(db, email)
    if not user:
        raise ValueError("User not found")
    user.hashed_password = new_password
    db.commit()
    db.refresh(user)
    return user