from fastapi import APIRouter, HTTPException,  Depends
from sqlmodel import Session

from backend.app.services.user_service import get_db
import backend.app.API.services.etf_data_function as etf_data_function
from backend.app.schemas.auth import (
    EmailRequest,
    VerifyCodeRequest,
    TokenResponse,
    VerifyCodeResponse,
    SetPasswordRequest,
    LoginRequest
)

# backend/app/API/main.py
import os
import csv
import json
import redis
from fastapi import APIRouter, HTTPException, Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from backend.app.API.utils.alpha_vintage import fetch_enriched_etf_data
from backend.app.llama.semantic.semantic_search import router as semantic_search 
from dotenv import load_dotenv
load_dotenv()
router = APIRouter()

redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

@router.get("/metrics")
async def metrics():
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)



# Routes ETF
@router.get("/etf/{ticker}/full")
async def get_etf_full(ticker: str):
    result = await etf_data_function.get_etf_full(ticker)
    return result

@router.get("/etfs/full")
async def get_all_etfs():
    etfs = await etf_data_function.get_all_etfs()
    return etfs

# Routes d'authentification
@router.post("/auth/request-code")
async def request_code(payload: EmailRequest, db: Session = Depends(get_db)):
    result = await etf_data_function.request_code(payload, db)
    return result

@router.post("/auth/verify-code", response_model=VerifyCodeResponse)
async def verify_code(payload: VerifyCodeRequest, db: Session = Depends(get_db)):
    result = await etf_data_function.verify_code(payload, db)
    return result

@router.post("/auth/set-password")
async def set_password(payload: SetPasswordRequest, db: Session = Depends(get_db)):
    password = await etf_data_function.set_password(payload, db)
    return password

@router.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token = await etf_data_function.login(payload, db)
    return token



from typing import List, Dict
from pydantic import BaseModel
import logging

from backend.app.llama.semantic.llm_preprocessor import extract_investment_criteria , InvestmentCriteria
from backend.app.llama.semantic.elasticsearch_manager import cached_search

logger = logging.getLogger(__name__)
router = APIRouter(tags=["semantic-search"])

class QueryRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    criteria: InvestmentCriteria
    results: List[Dict]
    search_time: float

@router.post("/semantic/search", response_model=SearchResponse)
async def semantic_search(request: QueryRequest):
    try:
        logger.info(f"🔍 Recherche sémantique: {request.query}")
        
        # 1. Extraction des critères avec Llama3
        criteria = extract_investment_criteria(request.query)
        logger.info(f"✅ Critères extraits: {criteria.dict()}")
        
        # 2. Recherche dans Elasticsearch
        results = cached_search(criteria)
        logger.info(f"📊 {len(results)} résultats trouvés")
        
        return SearchResponse(
            criteria=criteria,
            results=results,
            search_time=0.0
        )
        
    except Exception as e:
        logger.error(f"❌ Erreur recherche sémantique: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")
    

    
