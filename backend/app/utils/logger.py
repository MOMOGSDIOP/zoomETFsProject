import logging
from elasticsearch import Elasticsearch
from app.core import settings

class ETFLogger:
    def __init__(self):
        self.es = Elasticsearch(settings.ELASTICSEARCH_URL)
        self.logger = logging.getLogger("zoometf")
        self._setup_handlers()

    def _setup_handlers(self):
        """Configure les sorties logs (ES + fichier)"""
        formatter = logging.Formatter('%(asctime)s | %(levelname)s | %(message)s')
        
        # Fichier
        file_handler = logging.FileHandler('logs/zoometf.log')
        file_handler.setFormatter(formatter)
        
        # ElasticSearch
        es_handler = self._get_es_handler()
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(es_handler)

    def _get_es_handler(self):
        """Crée un handler ElasticSearch"""
        from elasticsearch_logger import ElasticsearchHandler
        return ElasticsearchHandler(
            hosts=[settings.ELASTICSEARCH_URL],
            index="zoometf-logs"
        )