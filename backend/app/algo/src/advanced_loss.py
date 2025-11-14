"""
Fonctions de loss avancées pour la notation d'ETFs
"""
import torch
import torch.nn as nn
import torch.nn.functional as F

class ETFCompositeLoss(nn.Module):
    def __init__(self, alpha=0.5, beta=0.3):
        super().__init__()
        self.alpha = alpha  # Poids pour la loss supervisée
        self.beta = beta    # Poids pour la KL divergence
        self.mse = nn.MSELoss()
        
    def forward(self, preds, targets, vae_outputs=None, original_input=None):
        # Ensure tensors have compatible shapes
        if preds.dim() != targets.dim():
            if preds.dim() == 2 and targets.dim() == 1:
                targets = targets.unsqueeze(1)
            elif preds.dim() == 1 and targets.dim() == 2:
                preds = preds.unsqueeze(1)
        
        # Verify shapes match
        if preds.shape != targets.shape:
            min_len = min(preds.shape[0], targets.shape[0])
            preds = preds[:min_len]
            targets = targets[:min_len]
            
            if preds.shape != targets.shape:
                raise ValueError(f"Shape mismatch after truncation: preds {preds.shape}, targets {targets.shape}")
        
        # Loss supervisée
        supervised_loss = self.mse(preds, targets)
        
        if vae_outputs is None:
            return supervised_loss
            
        # Loss non supervisée (VAE)
        recon_x, mu, logvar = vae_outputs
        if original_input is None:
            raise ValueError("original_input is None")
        
        recon_loss = F.mse_loss(recon_x, original_input, reduction='mean')
        kld_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
        
        return (self.alpha * supervised_loss + 
                (1-self.alpha) * recon_loss + 
                self.beta * kld_loss)