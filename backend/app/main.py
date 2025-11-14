# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.API.main import router as etf_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)
app.include_router(etf_router)