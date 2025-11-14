import ollama
import os
import logging

logger = logging.getLogger(__name__)

def get_ollama_client():
    """Retourne un client Ollama configuré pour Docker"""
    ollama_host = os.getenv('OLLAMA_HOST', 'http://ollama:11435')
    logger.info(f"Configuration Ollama: {ollama_host}")
    return ollama.Client(host=ollama_host)

def ensure_llama_model():
    """Vérifie que le modèle Llama3 est disponible"""
    client = get_ollama_client()
    
    try:
        models = client.list()
        model_names = [model['name'] for model in models['models']]
        
        if 'llama3:8b' in model_names:
            logger.info("✅ Modèle llama3:8b disponible")
            return True
        else:
            logger.warning("❌ Modèle llama3:8b non trouvé. Modèles disponibles: %s", model_names)
            return False
            
    except Exception as e:
        logger.error(f"❌ Erreur vérification modèle Ollama: {e}")
        return False