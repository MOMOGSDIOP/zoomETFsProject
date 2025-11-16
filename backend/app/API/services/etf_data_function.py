
from datetime import datetime, timedelta
from random import randint
import random
import os 
import json 
import redis
import csv
from fastapi import APIRouter, HTTPException, status, Depends
from backend.app.API.utils.alpha_vintage import fetch_enriched_etf_data
from backend.app.utils.cache import cache
from sqlmodel import Session, select
from backend.app.services.email_sender import send_email_with_code
from pydantic import BaseModel

from app.core.security import (
    create_access_token,
    verify_password,
    get_password_hash
)
from app.services.user_service import (
    get_user_by_email,
    create_user,
    update_user_password,
    get_db
)
from app.schemas.auth import (
    EmailRequest,
    VerifyCodeRequest,
    TokenResponse,
    VerifyCodeResponse,
    SetPasswordRequest,
    LoginRequest
)


redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)


class QueryRequest(BaseModel):
    query: str


async def get_etf_full(ticker: str):
    try:
        cache_key = f"etf:{ticker.lower()}"
        if cached := redis_client.get(cache_key):
            return json.loads(cached)

        api_key = os.getenv("ALPHA_VANTAGE_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Clé API manquante")

        data = await fetch_enriched_etf_data(api_key, ticker)
        redis_client.setex(cache_key, 900, json.dumps(data))
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")




async def get_all_etfs():
    try:
        api_key = os.getenv("ALPHA_VANTAGE_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Clé API manquante")

        # Chemin absolu pour le fichier CSV
        filepath = os.path.join(os.path.dirname(__file__), "..","data", "etf_list.csv")
        filepath = os.path.abspath(filepath)
        
        print(f"Trying to open CSV at: {filepath}")  # Debug
        
        if not os.path.exists(filepath):
            raise HTTPException(
                status_code=404,
                detail=f"Fichier etf_list.csv manquant à l'emplacement: {filepath}"
            )

        results = []
        with open(filepath, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            if "symbol" not in reader.fieldnames:
                raise HTTPException(
                    status_code=500,
                    detail="Colonne 'symbol' manquante dans le CSV"
                )
                
            for row in reader:
                symbol = row["symbol"].strip()
                if not symbol:
                    continue
                    
                cache_key = f"etf:{symbol.lower()}"
                
                # Debug
                print(f"Processing ETF: {symbol}")

                if cached := redis_client.get(cache_key):
                    results.append(json.loads(cached))
                    continue

                try:
                    data = await fetch_enriched_etf_data(api_key, symbol)
                    redis_client.setex(cache_key, 900, json.dumps(data))
                    results.append(data)
                except Exception as e:
                    print(f"Error processing {symbol}: {str(e)}")
                    continue

        return results

    except Exception as e:
        print(f"Global error: {str(e)}")  # Debug
        raise HTTPException(
            status_code=500,
            detail=f"Erreur serveur: {str(e)}"
        )
    

async def request_code(payload: EmailRequest, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, payload.email)
    if existing_user and existing_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un compte existe déjà avec cet email."
        )
    
    code = generate_code()
    cache.set(f"auth_code:{payload.email}", code, expire=300)  # expire après 5 min
    await send_email_with_code(payload.email, code)
    
    return {"message": "Code envoyé à votre adresse email."}


def generate_code(length: int = 6) -> str:
    return ''.join(str(random.randint(0, 9)) for _ in range(length))




async def verify_code(payload: VerifyCodeRequest, db: Session = Depends(get_db)):
    cached_code = cache.get(f"auth_code:{payload.email}")
    if cached_code != payload.code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Code invalide ou expiré."
        )

    user = get_user_by_email(db, payload.email)
    new_user = user is None

    
    cache.delete(f"auth_code:{payload.email}")

    token = create_access_token({"sub": payload.email})

    return {
        "token": token,
        "newUser": new_user
    }



async def set_password(payload: SetPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)

    if user and user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mot de passe déjà défini pour cet utilisateur."
        )
    
    hashed_password = get_password_hash(payload.password)

    if user:
        update_user_password(db, payload.email, hashed_password)
    else:
        create_user(db, email=payload.email, hashed_password=hashed_password)

    return {"message": "Mot de passe défini avec succès."}


async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = payload.email
    password = payload.password

    print(f"🛂 Tentative de connexion pour : {email}")
    print(f"🔐 Mot de passe fourni : {password}")

    user = get_user_by_email(db, email)

    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Identifiants incorrects."
    )

    if not user or not user.hashed_password:
        print("🚫 Utilisateur introuvable ou mot de passe non défini.")
        raise auth_error

    print(f"✅ Mot de passe hashé dans la base : {user.hashed_password}")

    is_valid = verify_password(password, user.hashed_password)
    print(f"🔍 Vérification du mot de passe : {is_valid}")

    if not is_valid:
        key = f"login_attempts:{email}"
        failed_attempts = cache.get(key) or 0
        failed_attempts += 1
        cache.set(key, failed_attempts, expire=900)  # expire 15 min

        print(f"❌ Tentatives échouées : {failed_attempts}")

        if failed_attempts >= 3:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Trop de tentatives échouées. Réessayez dans 15 minutes."
            )

        raise auth_error

    cache.delete(f"login_attempts:{email}")
    token = create_access_token({"sub": email})

    print(f"✅ Connexion réussie. Token généré : {token[:10]}...")

    return {"token": token}

