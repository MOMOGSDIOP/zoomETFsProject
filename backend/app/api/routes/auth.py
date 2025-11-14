from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime, timedelta
from random import randint

from app.models.user_auth import EmailVerification
from app.services.email_sender import send_verification_code
from app.db.session import get_session
from app.schemas.auth import EmailRequest, VerifyCodeRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/request-code")
def request_code(payload: EmailRequest, session: Session = Depends(get_session)):
    email = payload.email
    code = f"{randint(100000, 999999)}"
    expiration = datetime.utcnow() + timedelta(minutes=10)

    verification = EmailVerification(
        email=email,
        code=code,
        expires_at=expiration,
        verified=False,
    )
    session.add(verification)
    session.commit()

    send_verification_code(email, code)
    return {"message": "Code envoyé à votre adresse email."}


@router.post("/verify-code", response_model=TokenResponse)
def verify_code(payload: VerifyCodeRequest, session: Session = Depends(get_session)):
    email = payload.email
    code = payload.code

    statement = (
        select(EmailVerification)
        .where(EmailVerification.email == email)
        .order_by(EmailVerification.expires_at.desc())
    )
    result = session.exec(statement).first()

    if not result:
        raise HTTPException(status_code=404, detail="Aucun code trouvé")

    if result.verified:
        raise HTTPException(status_code=400, detail="Code déjà utilisé")

    if result.code != code:
        raise HTTPException(status_code=400, detail="Code invalide")

    if result.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Code expiré")

    result.verified = True
    session.add(result)
    session.commit()

    # 🔐 Simule la génération de token ici
    token = f"fake-jwt-token-for-{email}"

    return TokenResponse(token=token)
