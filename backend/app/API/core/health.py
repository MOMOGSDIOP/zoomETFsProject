from fastapi import APIRouter
from prometheus_client import generate_latest
from fastapi.responses import Response
import redis
import os

router = APIRouter()

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "zoom-etf-backend"}

@router.get("/metrics")
async def metrics():
    data = generate_latest()
    return Response(content=data, media_type="text/plain")