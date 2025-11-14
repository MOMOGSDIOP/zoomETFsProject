# data_utils.py
import numpy as np
import pandas as pd
import json
from sklearn.preprocessing import QuantileTransformer
from typing import Dict, Any, Union


class DataPreprocessor:
    def __init__(self):
        self.quantile_transformer = QuantileTransformer(
            output_distribution='normal',
            n_quantiles=10  # Valeur réduite adaptée aux petits datasets
        )
        
    def safe_log_transform(self, df: pd.DataFrame, num_cols: list) -> pd.DataFrame:
        """Transforme les données numériques en évitant les valeurs invalides pour log1p"""
        df[num_cols] = df[num_cols].apply(
            lambda col: np.log1p(col - col.min() + 1)  # +1 pour garantir des valeurs > 0
        )
        return df

    def quantile_transform(self, df: pd.DataFrame, num_cols: list) -> pd.DataFrame:
        """Applique la transformation quantile en ajustant dynamiquement aux données"""
        n_samples = len(df)
        if n_samples < self.quantile_transformer.n_quantiles:
            self.quantile_transformer.set_params(n_quantiles=n_samples)
            
        df[num_cols] = self.quantile_transformer.fit_transform(df[num_cols])
        return df

    def process_numerical_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Pipeline complet de traitement des données numériques"""
        num_cols = df.select_dtypes(include=np.number).columns.tolist()
        if num_cols:
            df = self.safe_log_transform(df, num_cols)
            df = self.quantile_transform(df, num_cols)
            df[num_cols] = df[num_cols].astype(np.float64)  # Conversion en float64
        return df



def numpy_json_serializer(obj: Any) -> Union[float, int, list]:
    """Convertit les types numpy en types natifs pour la sérialisation JSON"""
    if isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, np.integer):
        return int(obj)
    raise TypeError(f"Type non sérialisable : {type(obj)}")

def save_results(results: Dict, filename: str = 'results.json') -> None:
    """Sauvegarde les résultats en JSON avec gestion des types numpy"""
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2, default=numpy_json_serializer)



def _nested_field_exists(data: dict, field_path: str) -> bool:
    """Vérifie récursivement si un champ imbriqué existe"""
    parts = field_path.split('.')
    current = data
    for part in parts:
        if part not in current:
            return False
        current = current[part]
    return True



