from typing import List, Dict
from elasticsearch import Elasticsearch  
from redis import Redis  
import json
import os
import logging

from app.llama.semantic.llm_preprocessor import InvestmentCriteria

logger = logging.getLogger(__name__)

# Configuration des clients
redis_client = Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

es_client = Elasticsearch(os.getenv("ELASTICSEARCH_URL", "http://elasticsearch:9200"))

def build_es_query(criteria: InvestmentCriteria) -> Dict:  
    """Génère une requête Elasticsearch depuis les critères."""  
    must_clauses = []  

    if criteria.sectors:  
        must_clauses.append({"terms": {"sector.keyword": criteria.sectors}})  
    if criteria.fees_max is not None:  
        must_clauses.append({"range": {"fees": {"lte": criteria.fees_max}}})  
    if criteria.min_performance is not None:  
        must_clauses.append({"range": {"performance_1y": {"gte": criteria.min_performance}}})  

    return {  
        "query": {"bool": {"must": must_clauses}},  
        "sort": [{"performance_1y": {"order": "desc"}}]  
    }  

def search_etfs(criteria: InvestmentCriteria) -> List[Dict]:  
    """Recherche les ETFs dans Elasticsearch"""
    try:
        query = build_es_query(criteria)  
        result = es_client.search(index="etfs", body=query)
        return result["hits"]["hits"]
    except Exception as e:
        logger.error(f"Erreur recherche Elasticsearch: {e}")
        return []

def get_cache_key(criteria: InvestmentCriteria) -> str:  
    return f"etf_search:{criteria.json()}"

def cached_search(criteria: InvestmentCriteria, ttl: int = 3600) -> List[Dict]:  
    """Recherche avec cache Redis"""
    try:
        key = get_cache_key(criteria)  
        if cached := redis_client.get(key):  
            logger.info("✅ Résultats trouvés dans le cache")
            return json.loads(cached)  
        
        results = search_etfs(criteria)  
        redis_client.setex(key, ttl, json.dumps(results))  
        logger.info(f"✅ {len(results)} résultats stockés en cache")
        return results
    except Exception as e:
        logger.error(f"Erreur cache Redis: {e}")
        return search_etfs(criteria)