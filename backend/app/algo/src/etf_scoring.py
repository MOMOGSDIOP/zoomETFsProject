import pandas as pd
import numpy as np
import torch
import logging
from sklearn.feature_selection import SelectKBest, f_regression
from config import REQUIRED_COLUMNS, COLUMN_MAPPING

logger = logging.getLogger(__name__)

class ETFScoring:
    """
    Scoring des ETFs via modèle principal et optionnellement un GNN,
    avec sélection de features.
    """
    RATING_SCALE = {
        'D': (0.0, 0.4),
        'C': (0.4, 0.6),
        'B': (0.6, 0.8),
        'A': (0.8, 0.9),
        'A+': (0.9, 1.0)
    }
    
    def __init__(self, model, device, monitor, gnn_model, feature_selector, input_dim=25):
        """Args:
            model: modèle principal PyTorch
            device: device d'exécution (cpu ou cuda)
            monitor: outil de suivi des opérations
            gnn_model: modèle GNN optionnel
            feature_selector: sélectionneur de features sklearn
            input_dim: nombre de features sélectionnées
        """
        self.model = model
        self.device = device
        self.monitor = monitor
        self.gnn_model = gnn_model
        self.features_df = feature_selector 


    def predict(self, X: pd.DataFrame) -> pd.DataFrame:
        """Prédit les scores sur les features déjà préparées.
        Hypothèse: self.features_df contient toutes les colonnes numériques nettoyées et prêtes. """
        self.monitor.log_operation_start('prediction')
        try:
            X = self.features_df.copy()

            # Remplacer les NaN par la médiane (si besoin)
            for col in X.columns:
                if X[col].isnull().any():
                    median_val = X[col].median()
                    X[col] = X[col].fillna(median_val)
                    logger.info(f"NaN remplacés dans {col} par médiane: {median_val:.2f}")

            # Conversion en tenseur PyTorch
            X_tensor = torch.tensor(X.values.astype(np.float32), device=self.device)

            with torch.no_grad():
                raw_scores_main = self.model(X_tensor).cpu().numpy().flatten()

            if self.gnn_model:
                with torch.no_grad():
                    raw_scores_gnn = self.gnn_model(X_tensor).cpu().numpy().flatten()
                raw_scores = (raw_scores_main + raw_scores_gnn) / 2
            else:
                raw_scores = raw_scores_main

            if np.isnan(raw_scores).any():
                raise RuntimeError("NaN détectés dans les prédictions")

            normalized_scores = self._normalize_scores(raw_scores)
            ratings = self._assign_ratings(normalized_scores)

            # Ici il faut que self.features_df contienne la colonne 'etfId' ou équivalent
            results = pd.DataFrame({
                'etf_id': self.features_df['etfId'].values if 'etfId' in self.features_df.columns else range(len(self.features_df)),
                'raw_score': raw_scores,
                'normalized_score': normalized_scores,
                'rating': ratings
            })

            self._validate_ratings(results)
            self.monitor.log_operation_success('prediction')
            return results

        except Exception as e:
            self.monitor.log_operation_failure('prediction', str(e))
            logger.exception("Erreur lors de la prédiction")
            return pd.DataFrame({'etf_id': [], 'raw_score': [], 'normalized_score': [], 'rating': []})


    
    def _normalize_scores(self, scores: np.ndarray) -> np.ndarray:
        """Normalise les scores entre 0 et 1."""
        finite = scores[np.isfinite(scores)]
        if finite.size == 0:
            return np.zeros_like(scores)
        min_score, max_score = finite.min(), finite.max()
        if max_score - min_score < 1e-8:
            return np.full_like(scores, 0.5)
        return np.clip((scores - min_score) / (max_score - min_score), 0, 1)
    
    def _assign_ratings(self, normalized_scores: np.ndarray) -> pd.Series:
        """Assigne une note selon le score normalisé."""
        ratings = []
        for score in normalized_scores:
            if score >= 0.9:
                ratings.append('A+')
            elif score >= 0.8:
                ratings.append('A')
            elif score >= 0.6:
                ratings.append('B')
            elif score >= 0.4:
                ratings.append('C')
            else:
                ratings.append('D')
        return pd.Series(ratings)
    
    def _validate_ratings(self, results: pd.DataFrame):
        """Vérifie la cohérence entre scores normalisés et ratings."""
        for _, row in results.iterrows():
            score, rating = row['normalized_score'], row['rating']
            min_score, max_score = self.RATING_SCALE[rating]
            if rating == 'A+':
                if not (0.9 <= score <= 1.0):
                    raise ValueError(f"Incohérence rating {rating} pour score {score:.4f}")
            else:
                if not (min_score <= score < max_score):
                    raise ValueError(f"Incohérence rating {rating} pour score {score:.4f}")
