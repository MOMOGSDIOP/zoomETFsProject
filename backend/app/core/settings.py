from pydantic_settings import BaseSettings  

class Settings(BaseSettings):
    # Base de données
    database_url: str

    @property
    def database_url_async(self) -> str:
        return self.database_url.replace("postgresql://", "postgresql+asyncpg://")

    # Authentification & Email
    SECRET_KEY: str
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str
    SMTP_PASSWORD: str
    EMAIL_FROM: str
    SMTP_USE_TLS: bool = True  # Important pour starttls

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        
settings = Settings()
