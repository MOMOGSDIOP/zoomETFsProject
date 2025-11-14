"""
Surveillance du système et journalisation des performances
"""

import time
from datetime import datetime, timedelta
from typing import Dict
import  numpy as np 
import psutil
class ETFSystemMonitor:
    def __init__(self):
        self.operations_log = []
        self.performance_metrics = {
            'data_validation': [],
            'model_inference': [],
            'training': [],
            'training_epochs': []  
            }

    
    def log_operation_start(self, operation_name: str):
        """Enregistre le début d'une opération"""
        entry = {
            'timestamp': datetime.now(),
            'operation': operation_name,
            'status': 'started',
            'details': None
        }
        self.operations_log.append(entry)
        return entry
    
    def log_operation_success(self, operation_name: str):
        """Enregistre la réussite d'une opération"""
        entry = {
            'timestamp': datetime.now(),
            'operation': operation_name,
            'status': 'completed',
            'details': {'success': True}
        }
        self.operations_log.append(entry)
        return entry
    
    def log_operation_failure(self, operation_name: str, error_msg: str):
        """Enregistre l'échec d'une opération"""
        entry = {
            'timestamp': datetime.now(),
            'operation': operation_name,
            'status': 'failed',
            'details': {
                'success': False,
                'error': error_msg
            }
        }
        self.operations_log.append(entry)
        return entry
    
    def track_performance(self, metric_name: str, value: float):
        """Enregistre une métrique de performance"""
        if metric_name not in self.performance_metrics:
            self.performance_metrics[metric_name] = []
            self.performance_metrics[metric_name].append({
                'timestamp': datetime.now(),
                'value': value})

    
    def get_recent_metrics(self, hours: int = 24) -> Dict:
        """Récupère les métriques récentes"""
        cutoff = datetime.now() - timedelta(hours=hours)
        return {
            metric: [
                m for m in records 
                if m['timestamp'] >= cutoff
            ]
            for metric, records in self.performance_metrics.items()
        }
    
    
    def health_check(self) -> Dict:
        """Vérifie l'état de santé du système"""
        recent_metrics = self.get_recent_metrics()
        return {
            'status': 'operational',
            'last_operations': self.operations_log[-5:],
            'performance': {
                metric: np.mean([m['value'] for m in records])
                for metric, records in recent_metrics.items()
                if records
            }
        }
    

    def get_memory_usage(self) -> str:
        """Retourne l'utilisation de la mémoire du processus principal"""
        process = psutil.Process()
        mem_bytes = process.memory_info().rss
        mem_mb = mem_bytes / 1024 / 1024  # Convertir en Mo
        return f"{mem_mb:.2f} MB"
    

    def get_operation_duration(self, operation_name: str) -> float:
        """Calcule la durée d'une opération en secondes"""
        operation_entries = [op for op in self.operations_log 
                           if op['operation'] == operation_name]
        
        if len(operation_entries) < 2:
            return 0.0
            
        start_time = None
        end_time = None
        
        # Trouver le premier 'started' et le dernier 'completed'/'failed'
        for entry in operation_entries:
            if entry['status'] == 'started':
                start_time = entry['timestamp']
            elif entry['status'] in ['completed', 'failed']:
                end_time = entry['timestamp']
        
        if start_time and end_time:
            return (end_time - start_time).total_seconds()
        return 0.0