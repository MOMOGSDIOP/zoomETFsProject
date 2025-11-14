"""
Pipeline avancé de traitement des données ETFs (corrigé et optimisé)
"""

import numpy as np
import pandas as pd
from sklearn.discriminant_analysis import StandardScaler
from sklearn.preprocessing import QuantileTransformer, OrdinalEncoder
from sklearn.experimental import enable_iterative_imputer
from sklearn.impute import IterativeImputer
from sklearn.ensemble import RandomForestRegressor
from scipy.stats import boxcox
from scipy.special import inv_boxcox
from sklearn.preprocessing import PowerTransformer


class ETFDataPipeline:
    
    def __init__(self):
        self.quantile_transformer = QuantileTransformer(
            output_distribution='normal',
            n_quantiles=10 )
        self.imputer = IterativeImputer(estimator=RandomForestRegressor(), random_state=42)
        self.encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
        
        # Pour traquer les colonnes
        self.cat_cols = []
        self.num_cols = []

    def process(self, df: pd.DataFrame) -> pd.DataFrame:
        """Pipeline principal : aplatissement, nettoyage, encodage, normalisation"""
        df = self.flatten_nested_structures(df) 
        df = self.add_temporal_features(df)
        df = self.handle_missing_and_encoding(df)
        df = self.process_numerical_features(df)
        return df

    def flatten_nested_structures(self, df: pd.DataFrame) -> pd.DataFrame:
        """Aplatissement récursif des colonnes de type dict et list"""
        # D'abord traiter les dictionnaires
        dict_cols = df.select_dtypes(include='object').map(lambda x: isinstance(x, dict)).any()
        while dict_cols.any():
            for col in dict_cols[dict_cols].index:
                expanded = pd.json_normalize(df[col])
                expanded.columns = [f"{col}.{subcol}" for subcol in expanded.columns]
                df = df.drop(columns=col).join(expanded)
            dict_cols = df.select_dtypes(include='object').map(lambda x: isinstance(x, dict)).any()
        
        # Ensuite traiter les listes
        list_cols = df.map(lambda x: isinstance(x, list)).any()
        for col in list_cols[list_cols].index:
            # Convertir les listes en string ou les exploser selon le besoin
            df[col] = df[col].apply(lambda x: '|'.join(map(str, x)) if isinstance(x, list) else x)
        
        return df

    def handle_missing_and_encoding(self, df: pd.DataFrame) -> pd.DataFrame:
        """Imputation + encodage catégoriel avec vérification des types"""
        # Séparation numérique / catégoriel avec vérification
        self.num_cols = df.select_dtypes(include=np.number).columns.tolist()
        self.cat_cols = [
            col for col in df.select_dtypes(exclude=np.number).columns
            if not df[col].map(lambda x: isinstance(x, (dict, list))).any()
        ]
        
        # Imputation numérique
        if self.num_cols:
            df[self.num_cols] = self.imputer.fit_transform(df[self.num_cols])
        
        # Imputation et encodage catégoriel
        if self.cat_cols:
            df[self.cat_cols] = df[self.cat_cols].fillna("Unknown")
            
            # Conversion en string pour garantir le bon fonctionnement de l'encodeur
            df[self.cat_cols] = df[self.cat_cols].astype(str)
            
            df[self.cat_cols] = self.encoder.fit_transform(df[self.cat_cols])
        
        return df


    def process_numerical_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Transformation robuste avec gestion complète des cas limites"""
        self.num_cols = df.select_dtypes(include=np.number).columns.tolist()
        
        if not self.num_cols:
            return df
        
        # Dictionnaire pour stocker les paramètres de transformation
        self.transformers = {}
        constant_cols = []
        processed_cols = []
        
        for col in self.num_cols:
            col_data = df[col].values.copy()  # Travailler directement avec un array numpy
            
            # 1. Gestion des valeurs manquantes et infinis
            median_val = np.median(col_data[~np.isnan(col_data)])
            col_data = np.where(np.isnan(col_data), median_val, col_data)
            col_data = np.nan_to_num(col_data, nan=median_val,
                                     posinf=np.percentile(col_data, 95),
                                     neginf=np.percentile(col_data, 5))
            
            # 2. Détection des colonnes constantes ou quasi-constantes
            unique_vals = np.unique(col_data)
            std_dev = np.std(col_data)
            
            if len(unique_vals) < 2 or std_dev < 1e-8:
                constant_cols.append(col)
                self.transformers[col] = {'type': 'constant', 'value': col_data[0]}
                continue
            
            # 3. Winsorisation (écrêtage des valeurs extrêmes)
            q1 = np.percentile(col_data, 5)
            q3 = np.percentile(col_data, 95)
            col_data = np.clip(col_data, q1, q3)
            

            # 4. Transformation Yeo-Johnson (généralisation de Box-Cox)

            try:
                pt = PowerTransformer(method='yeo-johnson', standardize=False)
                transformed = pt.fit_transform(col_data.reshape(-1, 1))
                df[col] = transformed.flatten()
                self.transformers[col] = {'type': 'yeo-johnson', 'transformer': pt}
                processed_cols.append(col)
            
            except Exception as e:
                # Fallback vers une transformation logarithmique sécurisée
                min_val = np.min(col_data)
                offset = max(0, 1 - min_val) if min_val <= 0 else 0
                df[col] = np.log1p(col_data + offset)
                self.transformers[col] = {'type': 'log', 'offset': offset}
                processed_cols.append(col)
            
            # 5. Normalisation des colonnes non constantes
            
            if processed_cols:
                # Éviter la division par zéro
                scaler = StandardScaler()
                df[processed_cols] = scaler.fit_transform(df[processed_cols])
                self.scaler = scaler
            
            # 6. Gestion finale des colonnes constantes
            for col in constant_cols:
                df[col] = 0  # Valeur neutre après standardisation
            
            return df

    def inverse_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Pour retrouver les valeurs originales si nécessaire"""
        
        if hasattr(self, 'scaler'):
            df[self.num_cols] = self.scaler.inverse_transform(df[self.num_cols])
        
        for col in self.num_cols:
            if col in self.transformers:
                lmbda = self.transformers[col]['lambda']
                shift = self.transformers[col]['shift']
                # Inverse Box-Cox
                df[col] = inv_boxcox(df[col], lmbda) - shift
        
        return df


    def add_temporal_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Ajout de variables temporelles (si présentes)"""
        if 'date' in df.columns:
            df['days_since_inception'] = (pd.to_datetime('today') - pd.to_datetime(df['date'])).dt.days
            if 'returns' in df.columns:
                df['market_regime'] = df['returns'].rolling(90, min_periods=1).apply(self._detect_regime)
        return df

    def _detect_regime(self, returns: pd.Series) -> int:
        """Détecte bull/bear/neutral market"""
        if len(returns) < 2:  # Minimum 2 points pour calculer std et mean
            return 0
        vol = returns.std()
        mean = returns.mean()
        if vol > 0.25 and mean < -0.1:
            return -1
        elif vol < 0.15 and mean > 0.1:
            return 1
        return 0