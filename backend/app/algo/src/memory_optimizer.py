import torch
import gc
from typing import Optional, Tuple
from math import ceil

class MemoryOptimizer:
    """Gestion optimisée de la mémoire GPU/CPU et des batch sizes"""
    
    def __init__(self, device: torch.device, safety_factor: float = 0.8):
        """
        Args:
            device: Device torch (cuda/cpu)
            safety_factor: Coefficient de sécurité pour l'allocation mémoire (0-1)
        """
        self.device = device
        self.safety_factor = max(0.1, min(safety_factor, 0.9))  # Borné entre 10% et 90%
        
    def clear_tensors(self, *tensors: Optional[torch.Tensor]) -> None:
        """Nettoie explicitement les tensors de la mémoire GPU
        
        Args:
            *tensors: Tensors à nettoyer (peut être None)
        """
        for tensor in tensors:
            if tensor is not None and isinstance(tensor, torch.Tensor):
                if tensor.is_cuda:
                    del tensor
        gc.collect()
        if self.device.type == 'cuda':
            torch.cuda.empty_cache()
    
    def calculate_adaptive_batch_size(
        self, 
        dataset_size: int, 
        sample_tensor: torch.Tensor,
        max_batch_size: int = 1024,
        min_batch_size: int = 8
    ) -> int:
        """Calcule dynamiquement la taille de batch optimale
        
        Args:
            dataset_size: Taille totale du dataset
            sample_tensor: Tensor exemple pour estimation mémoire
            max_batch_size: Batch size maximum autorisé
            min_batch_size: Batch size minimum autorisé
            
        Returns:
            Taille de batch optimale
        """
        if self.device.type == 'cpu':
            return min(max_batch_size, dataset_size)
            
        # Estimation mémoire disponible
        total_mem = torch.cuda.get_device_properties(self.device).total_memory
        allocated = torch.cuda.memory_allocated(self.device)
        free_mem = (total_mem - allocated) * self.safety_factor
        
        # Estimation mémoire nécessaire par sample
        sample_mem = sample_tensor.element_size() * sample_tensor.nelement()
        
        # Calcul batch size théorique
        batch_size = int(free_mem // sample_mem)
        
        # Application des contraintes
        batch_size = max(min_batch_size, min(batch_size, max_batch_size, dataset_size))
        
        return batch_size

    def auto_batch_loader(
        self,
        dataset: torch.utils.data.Dataset,
        sample_tensor: torch.Tensor,
        shuffle: bool = True
    ) -> torch.utils.data.DataLoader:
        """Crée un DataLoader avec batch size adaptatif
        
        Args:
            dataset: Dataset PyTorch
            sample_tensor: Tensor exemple pour le calcul
            shuffle: Si True, mélange les données
            
        Returns:
            DataLoader configuré
        """
        batch_size = self.calculate_adaptive_batch_size(
            len(dataset),
            sample_tensor
        )
        return torch.utils.data.DataLoader(
            dataset,
            batch_size=batch_size,
            shuffle=shuffle,
            pin_memory=self.device.type == 'cuda'
        )