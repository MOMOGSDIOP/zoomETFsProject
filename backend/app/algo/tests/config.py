# tests/conftest.py
import pytest
import pandas as pd
import numpy as np
import torch
from app.Tech.algo.src.config import REQUIRED_COLUMNS, MODEL_CONFIG, RISK_PARAMETERS

@pytest.fixture
def sample_config():
    return {
        'input_dim': MODEL_CONFIG['input_dim'],
        'hidden_layers': MODEL_CONFIG['hidden_layers'],
        'learning_rate': MODEL_CONFIG['learning_rate'],
        'dropout_rate': MODEL_CONFIG['dropout_rate'],
        'alpha': MODEL_CONFIG['alpha'],
        'beta': MODEL_CONFIG['beta'],
        'batch_size': MODEL_CONFIG['batch_size'],
        'weight_decay': 1e-5,
        'gnn_input_dim': 3,
        'RISK_PARAMETERS': RISK_PARAMETERS,
        'VALIDATION_THRESHOLDS': {'required_fields': REQUIRED_COLUMNS},
        'stress_scenarios': [
            {'name': 'Market Crash', 'type': 'market_crash', 'severity': 0.3},
            {'name': 'Liquidity Shock', 'type': 'liquidity_shock', 'factor': 2}
        ],
        'REQUIRED_COLUMNS': REQUIRED_COLUMNS
    }

@pytest.fixture
def minimal_etf_data():
    return pd.DataFrame({
        'etfId': ['ETF1', 'ETF2'],
        'fundamentals.costs.ter': [0.001, 0.02],
        'fundamentals.liquidity.avgDailyVolume': [1e6, 2e6],
        'riskAnalysis.volatility.annualized': [0.15, 0.25]
    })

@pytest.fixture
def sample_graph_data():
    return {
        'x': torch.randn(2, 3),
        'edge_index': torch.tensor([[0, 1], [1, 0]], dtype=torch.long),
        'etf_ids': ['ETF1', 'ETF2']
    }