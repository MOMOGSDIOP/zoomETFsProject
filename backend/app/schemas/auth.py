from pydantic import BaseModel, EmailStr, field_validator

class EmailRequest(BaseModel):
    email: EmailStr

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

class TokenResponse(BaseModel):
    token: str

class VerifyCodeResponse(TokenResponse):
    newUser: bool

class SetPasswordRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Le mot de passe doit contenir au moins 8 caractères')
        if not any(c.isupper() for c in v):
            raise ValueError('Le mot de passe doit contenir au moins une majuscule')
        if not any(c.isdigit() for c in v):
            raise ValueError('Le mot de passe doit contenir au moins un chiffre')
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str