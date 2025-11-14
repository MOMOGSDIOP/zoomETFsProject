"""
Utils de validation pour ETFs - Version corrigée
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List
import logging

from sklearn.model_selection import TimeSeriesSplit

logger = logging.getLogger(__name__)

class ETFValidator:
    def __init__(self, thresholds: Dict[str, Any]):
        """Initialisation avec les seuils de validation"""
        self.thresholds = thresholds
        self.logger = logging.getLogger(__name__)
        
    def validate_ratings(self, ratings: pd.DataFrame, etf_data: pd.DataFrame) -> Dict:
        """
        Validation complète des ratings selon les seuils configurés
        
        Args:
            ratings: DataFrame des scores calculés
            etf_data: Données brutes des ETFs
            
        Returns:
            Dict: Résultats de validation avec:
                - risk_distribution: Distribution des risques
                - validation_flags: ETFs validés/rejetés
                - metrics: Métriques calculées
        """
        try:
            results = {
                'risk_distribution': {},
                'validation_flags': [],
                'metrics': {}
            }
            
            # 1. Validation des seuils de risque
            if 'volatility_bounds' in self.thresholds:
                results['risk_distribution']['volatility'] = self._check_volatility(
                    etf_data['riskAnalysis.volatility.annualized'],
                    self.thresholds['volatility_bounds']
                )
            
            if 'max_ter' in self.thresholds:
                results['risk_distribution']['cost'] = self._check_ter(
                    etf_data['fundamentals.costs.ter'],
                    self.thresholds['max_ter']
                )
            
            # 2. Marquage des ETFs valides/invalides
            results['validation_flags'] = self._generate_validation_flags(ratings, etf_data)
            
            # 3. Calcul des métriques globales
            results['metrics'] = self._compute_global_metrics(ratings)
            
            return results
            
        except Exception as e:
            self.logger.error(f"Validation error: {str(e)}", exc_info=True)
            raise

    def _check_volatility(self, volatilities: pd.Series, bounds: Dict) -> Dict:
        """Vérification des bornes de volatilité"""
        low = bounds.get('low', 0)
        high = bounds.get('high', float('inf'))
        
        return {
            'within_bounds': ((volatilities >= low) & (volatilities <= high)).mean(),
            'median': volatilities.median(),
            'max': volatilities.max()
        }

    def _check_ter(self, ters: pd.Series, max_ter: float) -> Dict:
        """Vérification du TER maximum"""
        return {
            'valid': (ters <= max_ter).mean(),
            'median': ters.median(),
            'max': ters.max()
        }
    
    
    def _generate_validation_flags(self, ratings: pd.DataFrame, etf_data: pd.DataFrame) -> List[Dict]:
        """Génération des flags de validation sans utiliser d'identifiant"""
        
        flags = []
        for i in range(len(ratings)):
            rating_row = ratings.iloc[i]
            etf_row = etf_data.iloc[i]
            flag = {
                'is_valid': True,
                'reasons': []
                }
            
            # Vérification de la volatilité
            if 'volatility_bounds' in self.thresholds:
                vol = etf_row.get('riskAnalysis.volatility.annualized')
                if vol is None:
                    flag['is_valid'] = False
                    flag['reasons'].append('missing_volatility_data')
                
                else:
                    bounds = self.thresholds['volatility_bounds']
                    if not (bounds['low'] <= vol <= bounds['high']):
                        flag['is_valid'] = False
                        flag['reasons'].append('volatility_out_of_bounds')
                        
            
            # Vérification du TER
            if 'max_ter' in self.thresholds:
                ter = etf_row.get('fundamentals.costs.ter')
                if ter is None:
                    flag['is_valid'] = False
                    flag['reasons'].append('missing_ter_data')
                elif ter > self.thresholds['max_ter']:
                    flag['is_valid'] = False
                    flag['reasons'].append('ter_too_high')
            
            flags.append(flag)

        return flags


    def _compute_global_metrics(self, ratings: pd.DataFrame) -> Dict:
        """Calcul des métriques globales"""
        return {
            'avg_score': ratings['normalized_score'].mean(),
            'score_distribution': {
                'min': ratings['normalized_score'].min(),
                '25p': ratings['normalized_score'].quantile(0.25),
                'median': ratings['normalized_score'].median(),
                '75p': ratings['normalized_score'].quantile(0.75),
                'max': ratings['normalized_score'].max()
            }
        }

    @staticmethod
    def time_series_cv(model, X, y, n_splits=5):
        """Validation croisée temporelle"""
        tscv = TimeSeriesSplit(n_splits=n_splits)
        scores = []
        
        for train_idx, test_idx in tscv.split(X):
            X_train, X_test = X[train_idx], X[test_idx]
            y_train, y_test = y[train_idx], y[test_idx]
            
            model.fit(X_train, y_train)
            scores.append(model.score(X_test, y_test))
            
        return np.mean(scores)
    
    @staticmethod
    def stress_test(model, X, stress_scenarios):
        """Test sur scénarios extrêmes"""
        results = {}
        for name, scenario in stress_scenarios.items():
            X_stress = scenario.apply(X)
            results[name] = model.predict(X_stress)
        return results