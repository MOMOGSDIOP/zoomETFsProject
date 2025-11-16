from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.settings import settings  # pour récupérer settings.database_url
from typing import AsyncGenerator
DATABASE_URL = settings.database_url_async  # Ex: "postgresql+asyncpg://user:password@localhost/dbname"

engine = create_async_engine(DATABASE_URL, echo=True)

async_session = sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession,
)



async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session

Base = declarative_base()
