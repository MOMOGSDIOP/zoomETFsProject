"""
explanation.py - Module de génération d'explications avancées pour les ETFs
"""

import numpy as np
import pandas as pd
import logging
from typing import Dict, List, Optional, Tuple
import shap
import torch

logger = logging.getLogger(__name__)

class ETFExplanationGenerator:
    """Générateur d'explications dynamiques pour les prédictions d'ETF"""
    
    def __init__(self, model: Optional[torch.nn.Module] = None, device: str = 'cpu'):
        """
        Args:
            model: Modèle PyTorch pour les explications SHAP
            device: Device pour les calculs (cpu/cuda)
        """
        self.model = model
        self.device = device
        self.explainer = None
        self.feature_stats = {}
        
    def initialize_shap(self, background_data: pd.DataFrame) -> None:
        """Initialise l'explicateur SHAP avec des données de référence"""
        try:
            if not isinstance(background_data, pd.DataFrame) or background_data.empty:
                raise ValueError("Background data must be a non-empty DataFrame")
                
            background_tensor = torch.FloatTensor(background_data.values).to(self.device)
            self.explainer = shap.DeepExplainer(self.model, background_tensor)
            logger.info(f"SHAP explainer initialized with {len(background_data)} samples")
        except Exception as e:
            logger.error(f"SHAP initialization failed: {str(e)}")
            self.explainer = None

    def compute_dynamic_thresholds(self, etf_data: pd.DataFrame) -> Dict[str, float]:
        """Calcule les seuils dynamiques basés sur les percentiles"""
        required_columns = {
            'fundamentals.costs.ter',
            'fundamentals.liquidity.avgDailyVolume',
            'riskAnalysis.volatility.annualized'
        }
        
        missing = required_columns - set(etf_data.columns)
        if missing:
            raise ValueError(f"Missing required columns for thresholds: {missing}")
        
        return {
            'ter_low': np.percentile(etf_data['fundamentals.costs.ter'], 10),
            'ter_high': np.percentile(etf_data['fundamentals.costs.ter'], 90),
            'liquidity_low': np.percentile(etf_data['fundamentals.liquidity.avgDailyVolume'], 10),
            'liquidity_high': np.percentile(etf_data['fundamentals.liquidity.avgDailyVolume'], 90),
            'volatility_low': np.percentile(etf_data['riskAnalysis.volatility.annualized'], 10),
            'volatility_high': np.percentile(etf_data['riskAnalysis.volatility.annualized'], 90),
        }

    def generate_shap_insights(self, features: pd.DataFrame, n_features: int = 3) -> Tuple[List[str], List[str]]:
        """Génère des insights basés sur les valeurs SHAP"""
        if self.explainer is None or not hasattr(self.explainer, 'shap_values'):
            return [], []
            
        try:
            shap_values = self.explainer.shap_values(features.values)
            if isinstance(shap_values, list):
                shap_values = shap_values[0]  # Prend le premier output pour les modèles multi-output
                
            feature_names = features.columns.tolist()
            
            # Analyse pour chaque échantillon
            all_pos, all_neg = [], []
            for i in range(len(features)):
                top_pos = np.argsort(-shap_values[i])[:n_features]
                top_neg = np.argsort(shap_values[i])[:n_features]
                
                pos = [f"{feature_names[j]}(+{shap_values[i][j]:.2f})" for j in top_pos]
                neg = [f"{feature_names[j]}(-{abs(shap_values[i][j]):.2f})" for j in top_neg]
                
                all_pos.append(", ".join(pos))
                all_neg.append(", ".join(neg))
                
            return all_pos, all_neg
            
        except Exception as e:
            logger.error(f"SHAP explanation failed: {str(e)}")
            return [], []

    def generate_explanations(self, etf_data: pd.DataFrame, scores: np.ndarray, 
                            prepared_features: Optional[pd.DataFrame] = None) -> Dict[str, List[str]]:
        """Génère des explications complètes pour chaque ETF"""
        explanations = {
            'strengths': [],
            'weaknesses': [],
            'model_insights': [],
            'risk_analysis': []
        }
        
        try:
            # 1. Calcul des seuils dynamiques
            thresholds = self.compute_dynamic_thresholds(etf_data)
            
            # 2. Insights basés sur le modèle
            shap_pos, shap_neg = [], []
            if prepared_features is not None:
                shap_pos, shap_neg = self.generate_shap_insights(prepared_features)
            
            # 3. Génération pour chaque ETF
            for idx, (_, row) in enumerate(etf_data.iterrows()):
                # Points forts dynamiques
                strengths = self._generate_strengths(row, thresholds)
                
                # Points faibles dynamiques
                weaknesses = self._generate_weaknesses(row, thresholds)
                
                # Analyse de risque avancée
                risk_analysis = self._generate_risk_analysis(row)
                
                explanations['strengths'].append(" | ".join(strengths) or "No significant strengths")
                explanations['weaknesses'].append(" | ".join(weaknesses) or "No significant weaknesses")
                explanations['model_insights'].append(
                    f"Model highlights: {shap_pos[idx]}" if idx < len(shap_pos) else "")
                explanations['risk_analysis'].append(" | ".join(risk_analysis) or "No significant risk factors")
                
        except Exception as e:
            logger.error(f"Explanation generation error: {str(e)}")
            raise
            
        return explanations

    def _generate_strengths(self, row: pd.Series, thresholds: Dict) -> List[str]:
        """Génère les points forts spécifiques"""
        strengths = []
        
        # Analyse des frais
        ter = row.get('fundamentals.costs.ter', float('nan'))
        if not np.isnan(ter) and ter < thresholds['ter_low']:
            strengths.append(
                f"Low fees (TER {ter*100:.2f}% < {thresholds['ter_low']*100:.2f}% percentile)")
        
        # Analyse de liquidité
        liquidity = row.get('fundamentals.liquidity.avgDailyVolume', float('nan'))
        if not np.isnan(liquidity) and liquidity > thresholds['liquidity_high']:
            strengths.append(
                f"High liquidity ({liquidity/1e6:.1f}M > {thresholds['liquidity_high']/1e6:.1f}M percentile)")
        
        # Analyse de tracking error
        tracking_error = row.get('fundamentals.costs.trackingError', float('nan'))
        if not np.isnan(tracking_error) and tracking_error < 0.002:
            strengths.append("Excellent tracking (error < 0.2%)")
            
        return strengths

    def _generate_weaknesses(self, row: pd.Series, thresholds: Dict) -> List[str]:
        """Génère les points faibles spécifiques"""
        weaknesses = []
        
        # Analyse de volatilité
        volatility = row.get('riskAnalysis.volatility.annualized', float('nan'))
        if not np.isnan(volatility) and volatility > thresholds['volatility_high']:
            weaknesses.append(
                f"High volatility ({volatility:.1%} > {thresholds['volatility_high']:.1%} percentile)")
        
        # Analyse des frais élevés
        ter = row.get('fundamentals.costs.ter', float('nan'))
        if not np.isnan(ter) and ter > thresholds['ter_high']:
            weaknesses.append(
                f"High fees (TER {ter*100:.2f}% > {thresholds['ter_high']*100:.2f}% percentile)")
        
        # Analyse de liquidité faible
        liquidity = row.get('fundamentals.liquidity.avgDailyVolume', float('nan'))
        if not np.isnan(liquidity) and liquidity < thresholds['liquidity_low']:
            weaknesses.append(
                f"Low liquidity ({liquidity/1e6:.1f}M < {thresholds['liquidity_low']/1e6:.1f}M percentile)")
            
        return weaknesses

    def _generate_risk_analysis(self, row: pd.Series) -> List[str]:
        """Génère l'analyse de risque avancée"""
        risks = []
        
        # Risque de drawdown
        max_drawdown = row.get('riskAnalysis.drawdowns.maxDrawdown', float('nan'))
        if not np.isnan(max_drawdown) and max_drawdown < -0.2:
            risks.append(f"Significant drawdown risk ({max_drawdown:.1%})")
        
        # Risque de concentration
        top_holding = row.get('portfolio.characteristics.topHoldingWeight', float('nan'))
        if not np.isnan(top_holding) and top_holding > 0.1:
            risks.append(f"Concentration risk (top holding = {top_holding:.1%})")
            
        return risks