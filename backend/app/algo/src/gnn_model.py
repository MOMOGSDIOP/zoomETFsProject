import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GATConv
from torch_geometric.data import Data
import logging 

logger = logging.getLogger(__name__)

class ETFGraphModel(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int = 64, heads: int = 3, dropout: float = 0.1):
        super().__init__()
        self.hidden_dim = hidden_dim

        # Couche GNN
        self.gnn = GATConv(
            in_channels=input_dim,
            out_channels=hidden_dim, 
            heads=heads, 
            concat=False,
            add_self_loops=True
        )

        # Module Temporel
        self.temporal = nn.LSTM(hidden_dim, hidden_dim, batch_first=True)

        # Têtes de prédiction
        self.correlation_head = nn.Sequential(
            nn.Linear(hidden_dim * 2, 32),
            nn.ReLU(),
            nn.Linear(32, 1))
        
        self.uncertainty_head = nn.Sequential(
            nn.Linear(hidden_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 2))
        
        self.dropout = nn.Dropout(dropout)

    def _init_weights(self):
        for m in self.modules():
            if isinstance(m, nn.Linear):
                nn.init.xavier_uniform_(m.weight)
                nn.init.constant_(m.bias, 0)


    def forward(self, graph_data):
        """Forward pass avec validation des dimensions"""
        if not hasattr(graph_data, 'x') or not hasattr(graph_data, 'edge_index'):
            raise ValueError("GraphData doit contenir 'x' et 'edge_index'")
            
        x, edge_index = graph_data.x, graph_data.edge_index
        
        # Transposition automatique si nécessaire
        if edge_index.size(0) != 2:
            edge_index = edge_index.t().contiguous()
            logger.debug(f"Edge index transposé automatiquement vers {edge_index.shape}")

        # Passage GNN
        x = F.relu(self.gnn(x, edge_index))
        x = self.dropout(x)

        # Traitement temporel
        x, _ = self.temporal(x.unsqueeze(0))
        x = x.squeeze(0)

        # Calcul des sortie
        corr_matrix = self._compute_correlations(x)
        mu_sigma = self.uncertainty_head(x)
        mu, sigma = mu_sigma.chunk(2, dim=1)

        return x, corr_matrix, mu, sigma

    def train(self, graph_data: Data, targets: torch.Tensor, downstream_model: nn.Module,
              loss_fn: nn.Module, optimizer: torch.optim.Optimizer, device: torch.device,
              memory_optimizer=None) -> dict:
        """Entraînement avec gestion flexible du modèle downstream"""
        
        try: 
            # Validation de base
            if not isinstance(graph_data, Data):
                raise TypeError("graph_data doit être un objet Data")
            if not isinstance(targets, torch.Tensor):
                raise TypeError("targets doit être un Tensor")
            
            # Transfert sur device
            graph_data = graph_data.to(device)
            targets = targets.to(device).float()
            
            # Gestion des dimensions des targets
            if targets.dim() == 1:
                targets = targets.view(-1, 1)

            # Forward pass
            embeddings, corr, mu, sigma = self.forward(graph_data)
            
            # Vérification des dimensions
            if embeddings.shape[0] != graph_data.x.shape[0]:
                raise ValueError("Incohérence entre embeddings et features")

            # Combinaison des features
            combined = torch.cat([embeddings, graph_data.x], dim=1)
            
            # Entraînement
            for param in self.parameters():
                param.grad = None 

            # Appel flexible au modèle downstream
            if hasattr(downstream_model, 'encoder'):
                preds = downstream_model(combined)
            else:
                preds = downstream_model(combined, use_combined=True)
            
            # Ajustement des dimensions si nécessaire
            if preds.dim() == 1 and targets.dim() == 2:
                preds = preds.unsqueeze(1)
            elif preds.dim() == 2 and targets.dim() == 1:
                targets = targets.unsqueeze(1)

            loss = loss_fn(preds, targets)
            loss.backward()
            optimizer.step()
            
            return {
                "gnn_loss": float(loss.item()),
                "correlation": float(corr.mean().item()),
                "mu": float(mu.mean().item()),
                "sigma": float(sigma.mean().item())
            }
            
        finally:
            if memory_optimizer:
                memory_optimizer.clear_tensors()


    def _compute_correlations(self, x):
        x_norm = F.normalize(x, p=2, dim=1)
        corr = torch.mm(x_norm, x_norm.t())
        return torch.triu(corr, diagonal=1)  #
    
    
    def predict_portfolio_weights(self, graph_data, temperature=1.0):
        """Convertit les embeddings en poids de portefeuille"""
        with torch.no_grad():
            embeddings, _, mu, _ = self.forward(graph_data)
            weights = F.softmax(mu / temperature, dim=0)
        return weights
    
    def compute_risk_metrics(self, graph_data):
        """Calcule des métriques de risque basées sur les sorties"""
        _, corr_matrix, mu, sigma = self.forward(graph_data)
        portfolio_variance = (sigma**2).sum() + 2 * (corr_matrix * sigma @ sigma.T).sum()
        return {
            'volatility': torch.sqrt(portfolio_variance).item(),
            'diversification': 1 / (sigma**2).sum().item()
            }
    
    @torch.inference_mode()
    def inference(self, graph_data):
        """Version optimisée pour l'inférence"""
        return self.forward(graph_data)