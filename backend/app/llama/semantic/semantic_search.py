from fastapi import APIRouter, HTTPException
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
    

    
