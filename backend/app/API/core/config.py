from pydantic import BaseSettings
import os
from pathlib import Path

class Settings(BaseSettings):
    fmp_key: str
    alpha_vantage_key: str
    redis_host: str
    redis_port: int

    class Config:
        env_file = Path(__file__).resolve().parent.parent.parent / ".env"

settings = Settings()