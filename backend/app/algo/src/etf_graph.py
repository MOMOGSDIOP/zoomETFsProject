from typing import Dict, List, Optional, Tuple, Any
import numpy as np
import torch
from torch_geometric.data import Data
import logging
from dataclasses import dataclass
from config import MODEL_CONFIG
logger = logging.getLogger(__name__)

@dataclass
class ETFGraphConfig:
    normalize_features: bool = True
    use_alternative_data: bool = False
    use_temporal_features: bool = False
    etf_features: List[str] = None
    asset_features: List[str] = None
    sectors: List[str] = None
    edge_attributes: List[str] = None
    device: str = 'cuda' if torch.cuda.is_available() else 'cpu'

class ETFGraphProcessor:
    """Processeur de graphe ETF avec configuration dynamique et gestion cohérente des dimensions"""
    
    def __init__(self, config: ETFGraphConfig):
        self.config = config
        self.feature_stats = {}
        self.etf_node_indices = {}  # {etf_id: index dans le tableau de nœuds}
        self.asset_node_indices = {}  # {asset_id: index dans le tableau de nœuds}
        
    def build_graph_from_raw(self, etf_data: List[Dict[str, Any]]) -> Data:
        """Construction du graphe avec gestion robuste des dimensions"""
        try:
            # 1. Extraction des éléments de base
            base_features, edge_index, etf_ids, asset_ids, edge_attr = self._extract_base_elements(etf_data)
            logger.info(f"Base features extracted: {len(base_features)} nodes")
            
            # 2. Extraction des features avancées alignées sur les nœuds ETF
            alt_features = self._extract_alternative_features(etf_data) if self.config.use_alternative_data else None
            if alt_features is not None:
                logger.info(f"Alternative features extracted: {len(alt_features)} samples")
            
            # 3. Combinaison des features avec alignement dimensionnel
            all_features = self._combine_features_with_alignment(base_features, alt_features, etf_ids)
            logger.info(f"Combined features shape: {all_features.shape}")
            
            # 4. Normalisation
            if self.config.normalize_features and len(all_features) > 0:
                all_features = self._normalize_features(all_features)
                
            # In ETFGraphProcessor
            print(f"Final feature dimension: {all_features.shape[1]}")
            # 5. Extraction des features temporelles
            temp_features = self._extract_temporal_features(etf_data) if self.config.use_temporal_features else None
            if temp_features is not None:
                logger.info(f"Temporal features extracted: {temp_features.shape}")
                
            # 6. Construction du graphe
            graph_data = Data(
                x=torch.FloatTensor(all_features).to(self.config.device),
                edge_index=torch.LongTensor(edge_index).t().contiguous().to(self.config.device),
                etf_ids=etf_ids,
                asset_ids=asset_ids,
                edge_attr=torch.FloatTensor(edge_attr).to(self.config.device) if edge_attr else None,
                temporal_features=temp_features
            )
            logger.info(f"Graph built with {graph_data.num_nodes} nodes and {graph_data.num_edges} edges")


            if all_features.shape[1] != MODEL_CONFIG['gnn_input_dim']:
                raise ValueError(
                    f"Feature dimension {all_features.shape[1]} "
                    f"doesn't match model input_dim {MODEL_CONFIG['gnn_input_dim']}"
                    )
            
            return graph_data
            
        except Exception as e:
            logger.error(f"Graph construction failed: {str(e)}", exc_info=True)
            raise
        

    def _extract_base_elements(self, etf_data: List[Dict[str, Any]]) -> Tuple:
        """Extraction basée sur la configuration avec gestion robuste des données"""
        # Vérification de la configuration
        if not self.config.etf_features or not self.config.asset_features:
            raise ValueError("Graph feature configuration is missing")
        
        # Réinitialiser les indices
        self.etf_node_indices = {} 
        self.asset_node_indices = {}
        
        # Dimensions
        NUM_ETF_FEATURES = len(self.config.etf_features)
        NUM_ASSET_FEATURES = len(self.config.asset_features)
        TOTAL_FEATURES = NUM_ETF_FEATURES + NUM_ASSET_FEATURES
        
        node_features = []
        edge_index = [[], []]
        etf_ids = []
        asset_ids = []
        holdings_info = []
        asset_info = {}
        edge_attributes = []
        current_idx = 0
        
        # First, ensure etf_data is a list of dictionaries
        if not isinstance(etf_data, list):
            raise ValueError("etf_data should be a list of ETF dictionaries")
        
        # Premier passage: traiter tous les ETFs
        for etf in etf_data:
            if not isinstance(etf, dict):
                logger.warning("Skipping non-dictionary ETF data")
                continue
            
            
            try:
                etf_id = int(etf.get('etfId'))  
                if etf_id == 0:
                    logger.warning("Skipping ETF with missing or invalid ID")
                    continue
                
                self.etf_node_indices[etf_id] = current_idx
                etf_ids.append(etf_id)
                
                # Features des ETFs basées sur la configuration
                etf_features = [0.0] * TOTAL_FEATURES
                
                for i, feature_path in enumerate(self.config.etf_features):
                    value = self._get_nested_value(etf, feature_path)
                    etf_features[i] = float(value) if value is not None else 0.0
                    
                node_features.append(etf_features)
                current_idx += 1
                
                # Collecter les holdings pour traitement ultérieur
                portfolio = etf.get('portfolio', {})
                holdings = portfolio.get('holdings', []) if isinstance(portfolio, dict) else []
                
                for holding in holdings:
                    if not isinstance(holding, dict):
                        continue
                    asset_id = holding.get('assetId')
                    
                    if asset_id:
                        holdings_info.append((etf_id, asset_id, holding))
                        
                        # Stocker les infos de l'actif
                        if asset_id not in asset_info:
                            asset_info[asset_id] = {}
                            for feature in self.config.asset_features:
                                asset_info[asset_id][feature] = holding.get(feature)
            
            except (KeyError, ValueError, TypeError) as e:
                logger.warning(f"Error processing ETF data: {str(e)}")
                continue
        
        
        # Deuxième passage: créer les nœuds d'actifs
        for asset_id, info in asset_info.items():
            if not isinstance(info, dict):
                continue
            
            self.asset_node_indices[asset_id] = current_idx
            asset_ids.append(asset_id)
            
            # Features des actifs basées sur la configuration
            asset_features = [0.0] * TOTAL_FEATURES
            
            for i, feature in enumerate(self.config.asset_features):
                value = info.get(feature, '')
                col_idx = NUM_ETF_FEATURES + i
                
                # Encodage spécial pour le secteur
                if feature == 'sector' and self.config.sectors:
                    if value in self.config.sectors:
                        asset_features[col_idx] = float(self.config.sectors.index(value) + 1)
                
                else: 
                    # Conversion en float pour les autres caractéristique
                    try:
                        asset_features[col_idx] = float(value) if isinstance(value, (int, float)) else 0.0
                    except (ValueError, TypeError):
                        asset_features[col_idx] = 0.0
            
            node_features.append(asset_features)
            current_idx += 1
            
        
        # Troisième passage: créer les connections et attributs d'arête
        for etf_id, asset_id, holding in holdings_info:
            etf_idx = self.etf_node_indices.get(etf_id)
            asset_idx = self.asset_node_indices.get(asset_id)
            
            if etf_idx is not None and asset_idx is not None:
                edge_index[0].append(etf_idx)
                edge_index[1].append(asset_idx)
                
                # Attributs d'arête basés sur la configuration
                edge_attr = []
                for attr in self.config.edge_attributes:
                    value = holding.get(attr, 0.0)
                    
                    try:
                        edge_attr.append(float(value))
                    except (ValueError, TypeError):
                        edge_attr.append(0.0)
                edge_attributes.append(edge_attr)
        
        return (
            np.array(node_features, dtype=np.float32),
            edge_index, 
            etf_ids, 
            asset_ids,
            edge_attributes
            )
    



    def _get_nested_value(self, data: Dict, path: str) -> Any:
        """Accès sécurisé aux valeurs imbriquées avec conversion en float"""
        keys = path.split('.')
        current = data
        for key in keys:
            if isinstance(current, dict) and key in current:
                current = current[key]
            else:
                return None
        
        # Conversion des types non numériques
        if isinstance(current, bool):
            return float(current)
        if isinstance(current, (int, float)):
            return current
        return None

    def _extract_alternative_features(self, etf_data: List[Dict[str, Any]]) -> Optional[np.ndarray]:
        """Extraction des données alternatives alignées sur les nœuds ETF"""
        if not self.etf_node_indices:
            return None
            
        # Initialiser avec des zéros pour tous les nœuds ETF
        num_etfs = len(self.etf_node_indices)
        features = np.zeros((num_etfs, 3), dtype=np.float32)
        
        for etf_id, idx in self.etf_node_indices.items():
            etf = next((e for e in etf_data if e.get('etfId') == etf_id), None)
            if etf is None:
                continue
                
            try:
                alt_data = etf.get('alternativeData', {})
                peer_data = etf.get('peerComparison', {})
                
                features[idx] = [
                    np.clip(alt_data.get('sentiment', {}).get('newsSentiment', 0.5), 0, 1),
                    alt_data.get('flows', {}).get('30dNetFlow', 0) / 1e9,
                    np.clip(peer_data.get('percentileRank', {}).get('cost', 0.5), 0, 1)
                ]
            except Exception as e:
                logger.warning(f"Alternative data error for ETF {etf_id}: {str(e)}")
        
        return features

    def _extract_temporal_features(self, etf_data: List[Dict[str, Any]]) -> Optional[torch.Tensor]:
        """Extraction des features temporelles alignées sur les nœuds ETF"""
        if not self.etf_node_indices:
            return None
            
        num_etfs = len(self.etf_node_indices)
        temporal_features = np.zeros((num_etfs, 7), dtype=np.float32)
        
        for etf_id, idx in self.etf_node_indices.items():
            etf = next((e for e in etf_data if e.get('etfId') == etf_id), None)
            if etf is None:
                continue
                
            try:
                # Statistiques des returns
                returns = np.array(etf.get('timeSeries', {}).get('dailyReturns', [0]))
                feat = [
                    float(np.mean(returns)),
                    float(np.std(returns)),
                    float(np.min(returns)),
                    float(np.max(returns)),
                    float(np.percentile(returns, 25)),
                    float(np.percentile(returns, 75))
                ]
                
                # Valeur NAV
                nav_history = etf.get('timeSeries', {}).get('historicalNav', [])
                if nav_history:
                    last_nav = nav_history[-1].get('value', nav_history[-1]) if isinstance(nav_history[-1], dict) else nav_history[-1]
                    feat.append(float(last_nav))
                else:
                    feat.append(float(etf.get('fundamentals', {}).get('priceData', {}).get('currentPrice', 0)))
                
                temporal_features[idx] = feat
            except Exception as e:
                logger.warning(f"Temporal data error for ETF {etf_id}: {str(e)}")
        
        return torch.FloatTensor(temporal_features).to(self.config.device)

    def _combine_features_with_alignment(self, base_features: np.ndarray, 
                                        alt_features: Optional[np.ndarray],
                                        etf_ids: List[str]) -> np.ndarray:
        """Combinaison robuste avec alignement sur les nœuds ETF"""
        if alt_features is None:
            return base_features
        
        # Vérifier la cohérence des dimensions
        num_etfs = len(etf_ids)
        if alt_features.shape[0] != num_etfs:
            raise ValueError(f"Alt features dimension mismatch: {alt_features.shape[0]} vs {num_etfs}")
        
        # Créer un tableau étendu avec des zéros pour les actifs
        num_assets = base_features.shape[0] - num_etfs
        num_alt_features = alt_features.shape[1]
        extended_alt_features = np.zeros((base_features.shape[0], num_alt_features), dtype=np.float32)
        
        # Remplir les valeurs pour les ETFs
        for i, etf_id in enumerate(etf_ids):
            if etf_id in self.etf_node_indices:
                idx = self.etf_node_indices[etf_id]
                extended_alt_features[idx] = alt_features[i]
        
        # Combinaison avec les caractéristiques de base
        return np.concatenate([base_features, extended_alt_features], axis=1)

    def _normalize_features(self, features: np.ndarray) -> np.ndarray:
        """Normalisation MinMax des features avec gestion des constantes"""
        if len(features) == 0:
            return features
            
        min_vals = np.min(features, axis=0)
        max_vals = np.max(features, axis=0)
        ranges = max_vals - min_vals
        
        # Éviter la division par zéro
        ranges[ranges == 0] = 1.0
        
        return (features - min_vals) / ranges