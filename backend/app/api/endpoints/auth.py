from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
import random

from app.schemas.auth import (
    EmailRequest,
    VerifyCodeRequest,
    TokenResponse,
    VerifyCodeResponse,
    SetPasswordRequest,
    LoginRequest
)
from app.utils.cache import cache
from app.services.email_sender import send_email_with_code
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

router = APIRouter(tags=["auth"])

def generate_code(length: int = 6) -> str:
    return ''.join(str(random.randint(0, 9)) for _ in range(length))


@router.post("/request-code", status_code=status.HTTP_202_ACCEPTED)
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


@router.post("/verify-code", response_model=VerifyCodeResponse)
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


@router.post("/set-password", status_code=status.HTTP_200_OK)
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


@router.post("/login", response_model=TokenResponse)
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
