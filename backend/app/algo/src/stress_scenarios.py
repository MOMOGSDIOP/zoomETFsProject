"""
Scénarios de stress test pour les ETFs
"""

from typing import List, Dict
import numpy as np 
import pandas as pd 
import logging    
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

from etf_feature_builder import ETFFeatureBuilder

logger = logging.getLogger(__name__)

class ETFStressTester:
    def __init__(self, scenarios: List[Dict]):
        self.scenarios = self._load_scenarios(scenarios)
    
    def _load_scenarios(self, scenario_defs):
        """Initialise les scénarios à partir de la configuration"""
        return [
            {
                'type': s['type'],
                'apply': self._create_scenario_function(s)
            } 
            for s in scenario_defs
        ]
    
    def _create_scenario_function(self, scenario):
        """Crée dynamiquement des fonctions de scénario"""
        if scenario['type'] == 'market_crash':
            return lambda df: self._apply_market_crash(df, scenario['severity'])
        elif scenario['type'] == 'liquidity_shock':
            return lambda df: self._apply_liquidity_shock(df, scenario['factor'])
        else:
            return lambda df: df  # Scenario neutre par défaut
    
    
    def run_all_scenarios(self,base_data:pd.DataFrame,feature_builder:ETFFeatureBuilder, model:nn.Module,device:torch.device) -> Dict:
        """Exécute tous les scénarios de stress"""

        results = {}
        for scenario in self.scenarios:
            try:
                # Application du scénario
                stressed_data = self.apply_scenario(base_data.copy(),scenario)
                features = feature_builder.transform(stressed_data)
                tensor_data= torch.tensor(features.values, dtype=torch.float32).to(device)
                
                # Prédiction
                model.eval()

                with torch.no_grad():
                    predictions = model(tensor_data)
                results[scenario['type']] = predictions.cpu().numpy().tolist()
            except Exception as e:
                logger.error(f"Scenario {scenario['type']} failed: {str(e)}")
                results[scenario['type']] = None
        return results

    def apply_scenario(self, data: pd.DataFrame, scenario: Dict) -> pd.DataFrame:
        """Applique un scénario de stress spécifique"""
        scenario_type = scenario['type']
        data = data.copy()
        
        if scenario_type == 'market_crash':
            # Augmentation de la volatilité
            severity = scenario.get('severity', 1.5)
            if 'riskAnalysis.volatility.annualized' in data.columns:
                data['riskAnalysis.volatility.annualized'] = data['riskAnalysis.volatility.annualized'].astype(float) * severity
        
        elif scenario_type == 'liquidity_shock':
            # Réduction de la liquidité
            factor = scenario.get('factor', 0.5)
            if 'fundamentals.liquidity.avgDailyVolume' in data.columns:
                data['fundamentals.liquidity.avgDailyVolume'] = data['fundamentals.liquidity.avgDailyVolume'].astype(float) * factor
        
        return data

    
    def _apply_market_crash(self, data, severity):
        """Simule un krach boursier"""
        crash_factor = 1 - severity
        data['fundamentals.priceData.currentPrice'] *= crash_factor
        data['riskAnalysis.volatility.annualized'] *= (1 + severity)
        return data
    
    def _apply_liquidity_shock(self, data, factor):
        """Simule un choc de liquidité"""
        data['fundamentals.liquidity.avgDailyVolume'] /= factor
        data['fundamentals.liquidity.marketImpactScore'] *= factor
        return data
    
    def _identify_impacted(self, original_data, stressed_scores):
        """Identifie les ETFs les plus affectés"""
        delta = original_data['score'] - stressed_scores
        return delta.nlargest(5).to_dict()