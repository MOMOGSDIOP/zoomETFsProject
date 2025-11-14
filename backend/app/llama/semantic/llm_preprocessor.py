from typing import Optional, List
from pydantic import BaseModel
import ollama
import json
import logging
import os

logger = logging.getLogger(__name__)

class InvestmentCriteria(BaseModel):
    sectors: List[str] = []
    fees_max: Optional[float] = None
    min_performance: Optional[float] = None
    region: List[str] = []
    type: List[str] = []
    replication: Optional[str] = None
    availability: List[str] = []
    risk: Optional[float] = None
    strategy: Optional[str] = None
    esg: Optional[int] = None
    emetteur: List[str] = []

def get_ollama_client():
    """Retourne un client Ollama configuré"""
    ollama_host = os.getenv('OLLAMA_HOST', 'http://ollama:11435')
    return ollama.Client(host=ollama_host)

def extract_investment_criteria(user_query: str) -> InvestmentCriteria:
    """Appelle Llama3 pour transformer la requête utilisateur en critères."""
    
    prompt = f"""
    Tu es un assistant spécialisé dans l'analyse de requêtes d'investissement ETF.
    Analyse cette requête : "{user_query}"
    
    Retourne UNIQUEMENT un JSON valide avec cette structure exacte :
    {{
        "sectors": [],
        "fees_max": null,
        "min_performance": null,
        "region": [],
        "type": [],
        "replication": null,
        "availability": [],
        "risk": null,
        "strategy": null,
        "esg": null,
        "emetteur": []
    }}
    
    Règles d'extraction :
    - Secteurs : "technologie" → ["technologie"], "ESG" → ["esg"]
    - Frais : "frais <0.5%" → "fees_max": 0.5
    - Performance : "rendement >3%" → "min_performance": 3.0
    - Région : "ETF Europe" → ["europe"]
    - Si aucun critère clair, laisse les valeurs par défaut
    - Ne retourne QUE le JSON, sans commentaires
    """

    try:
        logger.info(f"Envoi requête à Ollama: {user_query}")
        
        client = get_ollama_client()
        response = client.chat(
            model='llama3:8b',
            messages=[{'role': 'user', 'content': prompt}],
            options={'temperature': 0.1}
        )
        
        content = response['message']['content'].strip()
        logger.info(f"Réponse Ollama brute: {content}")
        
        # Nettoyage de la réponse
        if '```json' in content:
            content = content.split('```json')[1].split('```')[0].strip()
        elif '```' in content:
            content = content.split('```')[1].strip()
        
        # Parsing du JSON
        criteria_data = json.loads(content)
        criteria = InvestmentCriteria(**criteria_data)
        
        logger.info(f"Critères extraits: {criteria.dict()}")
        return criteria
        
    except json.JSONDecodeError as e:
        logger.error(f"Erreur parsing JSON: {e}")
        logger.error(f"Contenu reçu: {content}")
        return InvestmentCriteria()
    except Exception as e:
        logger.error(f"Erreur LLM: {e}")
        return InvestmentCriteria()