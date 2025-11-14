import ollama
import os
import logging

logger = logging.getLogger(__name__)

# Configuration du client Ollama pour Docker
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11435')

def get_ollama_client():
    """Retourne un client Ollama configuré"""
    return ollama.Client(host=OLLAMA_HOST)

def test_ollama_connection():
    """Test la connexion à Ollama"""
    try:
        client = get_ollama_client()
        models = client.list()
        logger.info(f"✅ Ollama connecté. Modèles disponibles: {[m['name'] for m in models['models']]}")
        return True
    except Exception as e:
        logger.error(f"❌ Erreur connexion Ollama: {e}")
        return False