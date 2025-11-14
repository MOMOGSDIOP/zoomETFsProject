from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class EmailVerification(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(index=True, nullable=False)
    code: str = Field(nullable=False)
    expires_at: datetime
    verified: bool = Field(default=False)
