import logging
from elasticsearch import Elasticsearch
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_elasticsearch():
    """Initialise les index Elasticsearch avec des données de test"""
    
    es_url = os.getenv("ELASTICSEARCH_URL", "http://elasticsearch:9200")
    es = Elasticsearch(es_url)
    
    try:
        # Vérifier la connexion
        if not es.ping():
            raise Exception("Impossible de se connecter à Elasticsearch")
        
        logger.info("✅ Connecté à Elasticsearch")
        
        # Créer l'index ETFs s'il n'existe pas
        if not es.indices.exists(index="etfs"):
            mapping = {
                "mappings": {
                    "properties": {
                        "name": {"type": "text"},
                        "isin": {"type": "keyword"},
                        "sector": {"type": "keyword"},
                        "fees": {"type": "float"},
                        "performance": {"type": "float"},
                        "region": {"type": "keyword"},
                        "strategy": {"type": "text"},
                        "esg_score": {"type": "integer"},
                        "replication": {"type": "keyword"},
                        "emetteur": {"type": "keyword"}
                    }
                }
            }
            es.indices.create(index="etfs", body=mapping)
            logger.info("✅ Index 'etfs' créé")
        
        # Données ETF de test
        etf_samples = [
            {
                "name": "Amundi ETF MSCI World UCITS ETF",
                "isin": "FR0010315770",
                "sector": "monde",
                "fees": 0.38,
                "performance": 8.5,
                "region": ["monde"],
                "strategy": "replication physique",
                "esg_score": 85,
                "replication": "physique",
                "emetteur": ["amundi"]
            },
            {
                "name": "Lyxor Nasdaq-100 UCITS ETF",
                "isin": "FR0007063177",
                "sector": "technologie",
                "fees": 0.35,
                "performance": 15.2,
                "region": ["usa"],
                "strategy": "replication synthétique",
                "esg_score": 70,
                "replication": "synthetique",
                "emetteur": ["lyxor"]
            },
            {
                "name": "BNP Paribas Easy ESG",
                "isin": "LU1792117779",
                "sector": "esg",
                "fees": 0.25,
                "performance": 6.8,
                "region": ["europe"],
                "strategy": "esg",
                "esg_score": 95,
                "replication": "physique",
                "emetteur": ["bnp"]
            }
        ]
        
        # Indexer les données
        for i, etf in enumerate(etf_samples):
            es.index(index="etfs", id=i+1, body=etf)
        
        logger.info(f"✅ {len(etf_samples)} ETFs de test indexés")
        
        # Rafraîchir l'index
        es.indices.refresh(index="etfs")
        logger.info("✅ Initialisation Elasticsearch terminée")
        
    except Exception as e:
        logger.error(f"❌ Erreur initialisation Elasticsearch: {e}")
        raise

if __name__ == "__main__":
    init_elasticsearch()