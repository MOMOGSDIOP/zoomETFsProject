"""
ETFs Analysis System - Core Rating Model (Version Intégrée)
"""

import datetime
import json
import logging
import pickle
from typing import Dict, List, Optional, Tuple, Union
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
import shap
from datetime import datetime
from torch_geometric.data import Data
from pandas import json_normalize

logger = logging.getLogger(__name__)


# Import des modules internes
from advanced_loss import ETFCompositeLoss
from semi_supervised_model import ETFSemiSupervisedModel
from gnn_model import ETFGraphModel
from validation_utils import ETFValidator
from monitoring import ETFSystemMonitor
from data_pipeline import ETFDataPipeline
from stress_scenarios import ETFStressTester
from etf_feature_builder import ETFFeatureBuilder
from etf_graph import ETFGraphProcessor, ETFGraphConfig
from explanations import ETFExplanationGenerator
from memory_optimizer import MemoryOptimizer
from data_utils import DataPreprocessor
import data_utils as du
from etf_scoring import ETFScoring





class ETFScoringEngine:
    """Moteur de notation unifié intégrant tous les composants"""
    
    def __init__(self, config: Dict):
        """Initialise le moteur de notation complet
          Args:
          config: Configuration du système (voir config.py)"""
        
        self.config = config
        self.device = self._init_device()
        self.monitor = ETFSystemMonitor()
        self.data_pipeline = ETFDataPipeline()
        self.stress_tester = ETFStressTester(config['stress_scenarios'])
        graph_config =  ETFGraphConfig(
            normalize_features=config['GRAPH_CONFIG']['normalize_features'],
            use_alternative_data=config['FEATURE_FLAGS']['USE_ALTERNATIVE_DATA'],
            use_temporal_features=config['FEATURE_FLAGS']['USE_TEMPORAL_FEATURES'],
            etf_features=config['GRAPH_CONFIG']['etf_features'],
            asset_features=config['GRAPH_CONFIG']['asset_features'],
            sectors=config['GRAPH_CONFIG']['sectors'],
            edge_attributes=config['GRAPH_CONFIG']['edge_attributes'],
            device=self.device)
        

        self.graph_processor = ETFGraphProcessor(graph_config)

        
        # Initialisation avec la configuration complète
        self.feature_builder = ETFFeatureBuilder({
            'RISK_PARAMETERS': config.get('RISK_PARAMETERS', {}),
            'VALIDATION_THRESHOLDS': config.get('VALIDATION_THRESHOLDS', {})
        })
        
        # Remplacer cette vérification :
        if len(self.feature_builder.transform(pd.DataFrame(columns=REQUIRED_COLUMNS)).columns) != config['MODEL_CONFIG']['gnn_input_dim']:
            raise ValueError("Incompatibilité dimension features/modèle")
        
        # Par cette version plus informative :
        test_df = pd.DataFrame(columns=REQUIRED_COLUMNS)
        transformed_features = self.feature_builder.transform(test_df)
        actual_dim = len(transformed_features.columns)
        expected_dim = config['MODEL_CONFIG']['gnn_input_dim']

        if actual_dim != expected_dim:
            raise ValueError(
                f"Incompatibilité dimension features/modèle. "
                f"Attendu: {expected_dim}, Obtenu: {actual_dim}. "
                f"Colonnes transformées: {list(transformed_features.columns)}"
                )
        
        # Initialisation des modèles
        self._init_models()
        self._init_loss_and_optim()
        self.explanation_generator = ETFExplanationGenerator(model=self.semi_supervised_model,device=self.device)
        self.memory_optimizer = MemoryOptimizer(device=self.device, safety_factor=0.7)
        
        logger.info("ETFScoringEngine initialized with config: %s", config)
    
    def _init_device(self) -> torch.device:
        """Détermine le device de calcul optimal"""
        return torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    def _init_models(self):
        """Initialise les différents modèles composants"""
        # Modèle semi-supervisé principal
        self.semi_supervised_model = ETFSemiSupervisedModel(
            input_dim=self.config['input_dim'],  # 25
            combined_dim=self.config.get('combined_dim')  # 89
        ).to(self.device)
        print(f"Config input_dim for semi supervised model : {self.config.get('input_dim')}")

        # Explicateur SHAP
        self.explainer = None
        
        # Initialize models
        self.gnn_model = ETFGraphModel(
            input_dim=self.config.get('gnn_input_dim')
            ).to(self.device)
        print(f"Config gnn_input_dim for etf_graph_model : {self.config.get('gnn_input_dim')}")
    
    def _init_loss_and_optim(self):
        """Initialise les fonctions de loss et optimiseurs"""
        self.loss_fn = ETFCompositeLoss(
            alpha=self.config['alpha'],
            beta=self.config['beta']
        )
        
        params = list(self.semi_supervised_model.parameters()) + \
                 list(self.gnn_model.parameters())
                 
        self.optimizer = torch.optim.AdamW(
            params,
            lr=self.config['learning_rate'],
            weight_decay=self.config['weight_decay']
        )
    
    
    def train(self, X: pd.DataFrame, y: pd.Series, graph_data: Optional[Dict] = None,epochs: int = 100) -> Dict:
        """Entraînement complet du système intégrant modèle semi-supervisé et GNN
           Args:
           X: DataFrame contenant les features d'entraînement
           y: Series contenant les cibles supervisées
           graph_data: Données graphiques optiosnnelles pour le GNN (format brut ou prétraité)
           epochs: Nombre d'époques d'entraînement (défaut: 100)    
         Returns:
             Dict: Métriques consolidées d'entraînement contenant:
            - supervised_loss: Perte supervisée
            - vae_loss: Perte du VAE
            - gnn_loss: Perte du GNN (si applicable)
            - correlation: Corrélation du GNN (si applicable)
        Raises:
        ValueError: Si les données d'entrée sont invalides
        RuntimeError: Si l'entraînement échoue pour des raisons techniques"""
        # Début du monitoring
        
        self.monitor.log_operation_start('full_training')
        self.monitor.track_performance('training_epochs', epochs)

        try:
            # Validation des entrée
            if not isinstance(X, pd.DataFrame):
                raise ValueError("X doit être un DataFrame pandas")
            
            if not isinstance(y, pd.Series):
                raise ValueError("y doit être une Series pandas")
            
            if graph_data is not None and not isinstance(graph_data, Data):
                raise ValueError("graph_data doit être un Data si fourni")
            
            if len(X) != len(y):
                raise ValueError("X et y doivent avoir la même longueur")
            if epochs <= 0:
                raise ValueError("Le nombre d'époques doisst être positif")
            if X.empty:
                raise ValueError("Le DataFrame prétraité est vide")

            X_tensor, y_tensor = self._prepare_tensors(X, y)
            
            # 2. Entraînement semi-supervisé principal
            train_metrics = self._train_semi_supervised(X_tensor, y_tensor, epochs)
            self.monitor.track_performance('supervised_loss', train_metrics['supervised_loss'])
            
            # 3. Fine-tuning avec GNN si données disponibles
            if graph_data is not None:
                gnn_metrics = self._train_with_gnn(graph_data, y_tensor)
                train_metrics.update(gnn_metrics)
                self.monitor.track_performance('gnn_loss', gnn_metrics['gnn_loss'])

            # 4. Initialisation de l'explicateur SHAP
            #self._init_explainer(X_processed)
            
            # Suivi des performances globales
            self.monitor.track_performance('total_training_loss',train_metrics.get('gnn_loss', train_metrics['supervised_loss']))
            self.monitor.log_operation_success('full_training')
            
            return train_metrics
        
        except ValueError as ve:
            error_msg = f"Validation error in training: {str(ve)}"
            self.monitor.log_operation_failure('full_training', error_msg)
            logger.error(error_msg)
            raise
        
        except RuntimeError as re:
            error_msg = f"Training execution error: {str(re)}"
            self.monitor.log_operation_failure('full_training', error_msg)
            logger.error(error_msg)
            raise
        
        except Exception as e:
            error_msg = f"Unexpected training error: {str(e)}"
            self.monitor.log_operation_failure('full_training', error_msg)
            logger.error(error_msg, exc_info=True)
            raise
         
    
    
    def _train_semi_supervised(self, X: torch.Tensor, y: torch.Tensor, 
                              epochs: int) -> Dict:
        """Entraînement du modèle semi-supervisé"""
        dataset = TensorDataset(X, y)
        loader = DataLoader(dataset, batch_size=self.config['batch_size'], shuffle=True)
        
        for epoch in range(epochs):
            for batch_X, batch_y in loader:
                try:
                    self.optimizer.zero_grad()
                    # Forward pass supervisé
                    preds = self.semi_supervised_model(batch_X, use_combined=False)
                    supervised_loss = self.loss_fn(preds, batch_y)
                    # Forward pass VAE
                    recon, mu, logvar = self.semi_supervised_model(batch_X, supervised=False)
                    vae_loss = self.loss_fn(
                        preds=preds,
                        targets=batch_y,
                        vae_outputs=(recon, mu, logvar),
                        original_input=batch_X
                        )
                    # Backpropagation
                    total_loss = supervised_loss + vae_loss
                    total_loss.backward()
                    self.optimizer.step()
                
                finally:
                    self.memory_optimizer.clear_tensors(batch_X, batch_y)
        
        return {
            'supervised_loss': supervised_loss.item(),
            'vae_loss': vae_loss.item()}

    

    def _train_with_gnn(self, graph_data: Data, y: torch.Tensor) -> Dict:
        """Effectue l'entraînement avec le modèle GNN en utilisant le monitoring système
         Args:graph_data: Données graphiques sous forme brute ou prétraitées y: 
         Tensors des cibles d'entraînement"""

        self.monitor.log_operation_start('gnn_training')
        try:
            # Validation de y
            if y is None or not isinstance(y, torch.Tensor):
                raise ValueError("Target y must be a valid torch.Tensor")
            
            # Conversion ou validation des données graph
            if not isinstance(graph_data, Data) or 'x' not in graph_data:
                self.monitor.track_performance('data_conversion', 1)
            
            else:
                self.monitor.track_performance('data_conversion', 0)
            
            # Appel direct à la méthode d'entraînement du modèle GNN
            metrics = self.gnn_model.train(
                graph_data=graph_data,
                targets=y,
                downstream_model=self.semi_supervised_model,
                loss_fn=self.loss_fn,
                optimizer=self.optimizer,
                device=self.device)
            
            # Suivi
            self.monitor.track_performance('gnn_training', metrics['gnn_loss'])
            self.monitor.log_operation_success('gnn_training')
            
            return metrics
        
        except ValueError as ve:
            msg = f"Validation error in GNN training: {str(ve)}"
            self.monitor.log_operation_failure('gnn_training', msg)
            logger.error(msg)
            raise
        
        except RuntimeError as re:
            msg = f"Runtime error during GNN training: {str(re)}"
            self.monitor.log_operation_failure('gnn_training', msg)
            logger.error(msg)
            raise
        
        except Exception as e:
            msg = f"Unexpected error in GNN training: {str(e)}"
            self.monitor.log_operation_failure('gnn_training', msg)
            logger.error(msg, exc_info=True)
            raise


    def _prepare_etf_features(self, etf_data: pd.DataFrame) -> pd.DataFrame:
        """Transforme les données ETF brutes en features pour le modèle"""
        return self.feature_builder.transform(etf_data)
    

    
    def _validate_config(self): 
        """Vérifie la cohérence de la configuration du moteur"""
        required_keys = ['input_dim', 'hidden_layers', 'learning_rate', 
                   'gnn_input_dim', 'REQUIRED_COLUMNS']
        
        for key in required_keys:
            if key not in self.config:
                raise ValueError(f"Configuration manquante: {key}")

    
    def _generate_explanations(self, etf_data: pd.DataFrame, scores: np.ndarray) -> Dict:
        features = self._prepare_etf_features(etf_data)
        return self.explanation_generator.generate_explanations(
            etf_data=etf_data,
            scores=scores,
            prepared_features=features)
    

    def evaluate(self, X: pd.DataFrame, y: pd.Series) -> Dict[str, float]:
        X_tensor, y_tensor = self._prepare_tensors(X, y)
        with torch.no_grad():
            preds = self.semi_supervised_model(X_tensor)
            mse = nn.MSELoss()(preds, y_tensor).item()
            mae = torch.mean(torch.abs(preds - y_tensor)).item()
            
        return {'MSE': mse, 'MAE': mae}

        
    def explain(self, X: pd.DataFrame, sample_size: int = 100) -> pd.DataFrame:
        """Génère des explications SHAP pour les prédictions
        Args:
        X: 
          Données à expliquer
          sample_size: Taille de l'échantillon pour approximation   
        Returns:
        DataFrame avec les valeurs SHAP
        """
        
        if self.explainer is None:
            self._init_explainer(X)
        
        sample = X.sample(min(sample_size, len(X)))
        # Conversion en tensor
        sample_tensor = torch.tensor(sample.values, dtype=torch.float32).to(self.device)
        
        # Calcul des valeurs SHAP
        shap_values = self.explainer.shap_values(sample_tensor)
        
        return pd.DataFrame(
            shap_values,
            columns=X.columns,
            index=sample.index
            )
    
    
    def evaluate_stress_scenarios(self, X: pd.DataFrame) -> Dict:
        """Évalue les performances sous différents scénarios de stress
        Args:
            X: Données de base
        Returns: Résultats des stress tests
        """
        return self.stress_tester.run_all_scenarios(X, self)
    

    def save(self, path: str):
        """Sauvegarde l'état complet du moteur"""
        state = {
            'model_state': self.semi_supervised_model.state_dict(),
            'gnn_state': self.gnn_model.state_dict(),
            'optimizer': self.optimizer.state_dict(),
            'config': self.config
        }
        torch.save(state, path)
        logger.info("Model saved to %s", path)
    


    def load(self, path: str):
        """Charge un état sauvegardé"""
        state = torch.load(path)
        self.semi_supervised_model.load_state_dict(state['model_state'])
        self.gnn_model.load_state_dict(state['gnn_state'])
        self.optimizer.load_state_dict(state['optimizer'])
        logger.info("Model loaded from %s", path)



    def run_full_analysis(self, raw_etf_data: List[Dict]) -> Dict:
        """Pipeline complet intégrant tous les composants: 
        données → features → graphe → entraînement → notation → analyse de risque → 
        scénarios de stress → explicabilité
        Args:raw_etf_data: Données brutes des ETFs au format JSON/dictionnaire """
        
        self.monitor.log_operation_start('full_analysis')
        
        try:

            # Traitement des données
            flattened_df = json_normalize(raw_etf_data, sep='.')
            processed = data_preprocessor.process_numerical_data(flattened_df)
            processed_data = self.data_pipeline.process(processed)
            
            if processed_data.empty:
                raise ValueError("Processed ETF data is empty after pipeline")
            
            if processed_data.isnull().values.any():
                raise ValueError("NaN values detected in processed ETF data")
            
            
            # 3 Construction des features et du graphe 
            graph_data = self.graph_processor.build_graph_from_raw(raw_etf_data)
        
            if not isinstance(graph_data, Data):
                raise ValueError("build_graph_from_raw must return a PyG Data object")
            if not hasattr(graph_data, 'x') or not hasattr(graph_data, 'edge_index'):
                raise ValueError("Data object must contain x and edge_index attributes")
            
            # TRANSFORMATION EN FEATURES
            features = self._prepare_etf_features(processed_data)

            # 4 generation de cibles fictives proxy 
            dummy_targets = pd.Series(np.random.rand(len(processed_data)))
          
            # 5. Entraînement AVEC LES FEATURES
            self.train(X=features, y=dummy_targets, graph_data=graph_data, epochs=30)

            # 6. Notation    
            scoring_system = ETFScoring(
                model=self.semi_supervised_model,
                gnn_model=self.gnn_model,
                device=self.device,
                monitor=self.monitor,
                feature_selector=features
                )
            
            # print(f"configuration du scoring Feature selector : 
            # {scoring_system.feature_selector.columns}")
            
            # Notation AVEC LES FEATURES
            ratings = scoring_system.predict(scoring_system.feature_selector)
    
            # 7. Analyse de risque avec validation
            validator = ETFValidator(thresholds=self.config['VALIDATION_THRESHOLDS'])
            risk_analysis = validator.validate_ratings(ratings, processed_data)
            
            # 8. Scénarios de stress
            stress_results = self.stress_tester.run_all_scenarios(
                base_data=processed_data,
                feature_builder=self.feature_builder,
                model=self.semi_supervised_model,
                device=self.device
                )
            

            # 9. Explicabilité (désactivée pour le moment)
            # sample_size = min(25, len(processed_data))
            # # explanations = self.explain(X=processed_data, sample_size=sample_size)
            
            # 10. Métadonnées système
            system_stats = {
                'device': str(self.device),
                'memory_usage': self.monitor.get_memory_usage(),
                'processing_time': self.monitor.get_operation_duration('full_analysis')
                }
            
            self.monitor.log_operation_success('full_analysis')
            
            return {
                'timestamp': datetime.now().isoformat(),
                'ratings': ratings.to_dict('records'),
                'risk_analysis': risk_analysis,
                'stress_test': stress_results,
                # 'explanations': explanations.to_dict('list'),
                'data_stats': {
                    'num_etfs': len(ratings),
                    'avg_score': float(ratings['normalized_score'].mean()),
                    'risk_distribution': risk_analysis['risk_distribution']
                    },
                'system': system_stats
                }
        
        except ValueError as ve:
            error_msg = f"Data validation error: {str(ve)}"
            self.monitor.log_operation_failure('full_analysis', error_msg)
            logger.error(error_msg)
            raise
        
        except RuntimeError as re:
            error_msg = f"Analysis execution error: {str(re)}"
            self.monitor.log_operation_failure('full_analysis', error_msg)
            logger.error(error_msg)
            raise
        
        except Exception as e:
            error_msg = f"Unexpected analysis error: {str(e)}"
            self.monitor.log_operation_failure('full_analysis', error_msg)
            logger.error(error_msg, exc_info=True)
            raise





    ## LEs méthodes privées pour la préparation des données et des tensors
    # sont utilisées pour transformer les données brutes en formats utilisables par les modèles.
    

    def _prepare_tensors(self, X: pd.DataFrame, y: pd.Series) -> Tuple[torch.Tensor, torch.Tensor]:
        
        try:
            X_tensor = torch.FloatTensor(X.values).to(self.device)
            
            if isinstance(y, (pd.Series, np.ndarray)):
                y_tensor = torch.FloatTensor(y.values).to(self.device)
            else:
                y_tensor = torch.FloatTensor(y).to(self.device)
            
            if X_tensor.shape[0] != y_tensor.shape[0]:
                raise ValueError("Mismatch in number of samples between X and y")
            
            return X_tensor, y_tensor
        
        except Exception as e:
            logger.error(f"Tensor conversion failed: {str(e)}")
            raise


    def _prepare_graph_data(self, etf_data: List[Dict]) -> Dict:
        """Alias vers la nouvelle implémentation"""
        return self.graph_processor.prepare_graph_data(etf_data) 


    def _init_explainer(self, etf_data: pd.DataFrame,num=10) -> None:
        """Initialise SHAP en exploitant pleinement le dataset ETF.
         Args:
         etf_data: DataFrame issu du JSON avec colonnes:
            - 'fundamentals.liquidity.avgDailyVolume' (obligatoire)
            - 'etfId' (pour le déduplication)
            - Toutes colonnes requises par _prepare_etf_features()"""
            
        #Vérification renforcée du schéma de donnée
        required_columns = {
            'fundamentals.liquidity.avgDailyVolume',
            'etfId'}

        missing = required_columns - set(etf_data.columns)
        if missing:
            raise ValueError(f"Colonnes manquantes: {missing}")

        try:
            # 1. Sélection des ETFs représentatifs
            background = (
                etf_data
                .sort_values('fundamentals.liquidity.avgDailyVolume', ascending=False)
                .drop_duplicates('etfId')
                .head(num)  # Taille fixe pour la stabilité
                )
            
            logger.debug(f"SHAP background: {len(background)} ETFs sélectionnés")
            
            # 2. Vérification du contenu des features
            if 'fundamentals.costs.ter' not in background.columns:
                logger.warning("TER manquant - utilisation de 0.001 comme valeur par défaut")
                background['fundamentals.costs.ter'] = background.get('fundamentals.costs.ter', 0.001)
            
            # 3. Préparation des features
            features = self._prepare_etf_features(background)
            if features.isnull().any().any():
                raise ValueError("NaN détectés dans les features après préparation")

            # 4. Conversion pour SHAP
            background_tensor = torch.FloatTensor(features.values).to(self.device)

            # 5. Initialisation avec vérification du modèle
            self.explainer = shap.DeepExplainer(
                model=self.semi_supervised_model,
                data=background_tensor)
            
            logger.info(f"SHAP initialisé. Shape: {background_tensor.shape}")
        
        except Exception as e:
            logger.error("Échec initialisation SHAP", exc_info=True)
            raise RuntimeError(f"Erreur SHAP: {str(e)}") from e


    def _get_graph_data(self, etf_data: List[Dict]) -> Dict:
        """Alias vers la nouvelle implémentation"""
        return self.graph_processor.prepare_graph_data(etf_data)
    







if __name__ == "__main__":
    from config import (
        MODEL_CONFIG,
        RISK_PARAMETERS,
        VALIDATION_THRESHOLDS,
        REQUIRED_COLUMNS,
        GRAPH_CONFIG,
        FEATURE_FLAGS,
        STRESS_SCENARIOS
    )
    
    data_preprocessor = DataPreprocessor()

    # Configuration consolidée
    config = {
        # Import direct des configurations principales
        'MODEL_CONFIG': MODEL_CONFIG,
        'RISK_PARAMETERS': RISK_PARAMETERS,
        'VALIDATION_THRESHOLDS': VALIDATION_THRESHOLDS,
        'REQUIRED_COLUMNS': REQUIRED_COLUMNS,
        'GRAPH_CONFIG': GRAPH_CONFIG,
        'FEATURE_FLAGS': FEATURE_FLAGS,
        
        # Paramètres dérivés (avec valeurs par défaut si manquantes)
        'weight_decay': MODEL_CONFIG.get('weight_decay', 1e-5),
        'gnn_input_dim': MODEL_CONFIG.get('gnn_input_dim', len(GRAPH_CONFIG['etf_features'])),
        
        # Scénarios de stress (peuvent être modifiés)
        'stress_scenarios': STRESS_SCENARIOS,
        'alpha' : MODEL_CONFIG['alpha'],
        'beta':MODEL_CONFIG['beta'],
        'learning_rate':MODEL_CONFIG['learning_rate'],
        'batch_size':MODEL_CONFIG['batch_size'],
        'input_dim': MODEL_CONFIG['input_dim'],
        'combined_dim': MODEL_CONFIG['combined_dim']
    }

    # Validation de cohérence
    assert config['gnn_input_dim'] == len(config['GRAPH_CONFIG']['etf_features'])+5, \
        f"Incohérence dimension GNN: config={config['gnn_input_dim']}, features={len(config['GRAPH_CONFIG']['etf_features'])}"
    
    
    try:
        engine = ETFScoringEngine(config)
        logger.info("Engine initialized successfully")
        
        # Chargement des données
        with open('etf_data_test.json') as f:
            etf_data = json.load(f)
            
        # Vérification des champs requis
        sample_item = etf_data[0]
        missing_fields = [field for field in REQUIRED_COLUMNS 
                        if not du._nested_field_exists(sample_item, field)]
        
        if missing_fields:
            logger.warning("Missing required fields: %s", missing_fields)
       
        
        # Exécution et sauvegarde
        results = engine.run_full_analysis(etf_data)
        du.save_results(results)  
      
    except Exception as e:
        logger.error("System failure: %s", str(e), exc_info=True)
        raise