
from typing import List,Dict
from elasticsearch import Elasticsearch  
from backend.app.llama.semantic.llm_preprocessor import  InvestmentCriteria
from redis import Redis  
import json

redis = Redis(host="redis", port=6379, decode_responses=True)  

es = Elasticsearch("http://elasticsearch:9200")  

def build_es_query(criteria: InvestmentCriteria) -> Dict:  
    """  
    Génère une requête Elasticsearch depuis les critères.  
    """  
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
    query = build_es_query(criteria)  
    return es.search(index="etfs", body=query)["hits"]["hits"]  


def get_cache_key(criteria: InvestmentCriteria) -> str:  
    return f"etf_search:{criteria.json()}"  

def cached_search(criteria: InvestmentCriteria, ttl=3600):  
    key = get_cache_key(criteria)  
    if cached := redis.get(key):  
        return json.loads(cached)  
    results = search_etfs(criteria)  
    redis.setex(key, ttl, json.dumps(results))  
    return results  
