"""
Configuration centrale du système
"""

# Catégories d'ETFs
DEFAULT_ETF_CATEGORIES = [
    'Equity', 'Fixed Income', 'Commodity', 
    'Alternative', 'Leveraged', 'ESG'
]

# Paramètres de risque
RISK_PARAMETERS = {
    'max_ter': 0.05,
    'min_liquidity': 1e6,
    'volatility_bounds': {
        'low': 0.05,
        'high': 0.5
    },
    'max_drawdown': -0.4
}


# Seuils de validation
VALIDATION_THRESHOLDS = {
    'price_deviation': 0.02,
    'tracking_error': 0.01,
    'required_fields': [
        'etfId', 'name', 'fundamentals.priceData.currentPrice'
    ]
}


# Configuration du modèle principal
MODEL_CONFIG = {
    'input_dim': 25,  # Doit correspondre aux features de base (X_tensor)
    'gnn_input_dim': 25,  # Doit matcher avec GRAPH_CONFIG['etf_features']
    'gnn_hidden_dim': 64,  # Dimensions des embeddings GNN
    'combined_dim': 89,  # 64 (embeddings) + 25 (features)
    'hidden_layers': [256, 128, 64],
    'learning_rate': 1e-4,
    'dropout_rate': 0.3,
    'alpha': 0.7,
    'beta': 0.3,
    'batch_size': 64,
    'gnn_output_dim': 32
}


# Configuration du graphe
GRAPH_CONFIG = {
    'normalize_features': True,
    'use_alternative_data': True,
    'use_temporal_features': True,

    # 15 features ETF (doit correspondre à gnn_input_dim)
    'etf_features': [
        # 1-5: Données fondamentales (Prix et Coûts)
        'fundamentals.priceData.currentPrice',
        'fundamentals.priceData.premiumDiscount',
        'fundamentals.costs.ter',
        'fundamentals.liquidity.avgDailyVolume',
        'fundamentals.liquidity.marketImpactScore',
        
        # 6-10: Données de risque
        'riskAnalysis.volatility.annualized',
        'riskAnalysis.drawdowns.maxDrawdown',
        'riskAnalysis.drawdowns.recoveryTimeDays',
        'riskAnalysis.liquidityRisk.basketLiquidityScore',
        'fundamentals.costs.trackingError',
        
        # 11-15: Données alternatives et flux
        'alternativeData.sentiment.newsSentiment',
        'alternativeData.sentiment.analystConsensus',
        'alternativeData.ownership.institutionalPercentage',
        'alternativeData.flows.30dNetFlow',
        'peerComparison.percentileRank.cost',
        
        # 16-20: Expositions aux facteurs et métriques techniques
        'portfolio.characteristics.factorExposures.beta',
        'portfolio.characteristics.factorExposures.quality',
        'portfolio.characteristics.factorExposures.momentum',
        'replication.optimization.samplingError',
        'replication.lending.lendingRevenue'
    ],
    'asset_features': [
        'sector',
        'country'
    ],
    'sectors': [
        'Technology', 'Health Care', 'Financials', 'Consumer Discretionary',
        'Consumer Staples', 'Industrials', 'Energy', 'Utilities',
        'Real Estate', 'Materials', 'Communication Services'
    ],
    'edge_attributes': [
        'weight',
        'contributionToTrackingError'
    ]
}



# Scénarios de stress
STRESS_SCENARIOS = [
    {
        'name': 'Market Crash', 
        'type': 'market_crash', 
        'severity': 0.5  # +50% de volatilité
    },
    {
        'name': 'Liquidity Shock', 
        'type': 'liquidity_shock', 
        'factor': 0.3  # -70% de liquidité
    },
    {
        'name': 'Interest Rate Hike', 
        'type': 'rate_increase', 
        'increase': 0.02  # +2% de taux
    }
]

#colonne  requis pour la configuration du système
REQUIRED_COLUMNS = [
    # Données de coûts
    "fundamentals.costs.ter",
    "fundamentals.costs.trackingError",
    
    # Données de liquidité
    "fundamentals.liquidity.avgDailyVolume",
    "fundamentals.liquidity.avgBidAskSpread",
    "fundamentals.liquidity.marketImpactScore",
    
    # Données de risque
    "riskAnalysis.volatility.30d",
    "riskAnalysis.drawdowns.maxDrawdown",
    "riskAnalysis.drawdowns.recoveryTimeDays",
    
    # Données alternatives
    "alternativeData.flows.30dNetFlow",
    "alternativeData.sentiment.newsSentiment",
    "alternativeData.sentiment.socialMediaSentiment",
    "alternativeData.sentiment.analystConsensus",
    
    # Facteurs
    "portfolio.characteristics.factorExposures.beta",
    "portfolio.characteristics.factorExposures.size",
    "portfolio.characteristics.factorExposures.value",
    "portfolio.characteristics.factorExposures.momentum",
    "portfolio.characteristics.factorExposures.quality",
    
    # Données techniques
    "replication.optimization.samplingError",
    "replication.lending.lendingRevenue",
    "alternativeData.ownership.institutionalPercentage",
    "replication.optimization.coverage",
    "riskAnalysis.liquidityRisk.basketLiquidityScore",
    
    # Métadonnées
    "metadata.creationDate"
]


# Paramètres avancés
ADVANCED_SETTINGS = {
    'memory_safety_factor': 0.7,
    'shap_background_size': 50,
    'max_processing_time': 30  # secondes
}


# Flags de fonctionnalités
FEATURE_FLAGS = {
    'USE_ALTERNATIVE_DATA': True,
    'USE_TEMPORAL_FEATURES': True,
    'ENABLE_STRESS_TESTING': True,
    'ENABLE_EXPLANATIONS': True
}

# Validation des données
VALIDATION_THRESHOLDS = {
    'required_fields': REQUIRED_COLUMNS
}

FEATURE_FLAGS = {
    'USE_ALTERNATIVE_DATA': True,
    'USE_TEMPORAL_FEATURES': True,
    'ENABLE_STRESS_TESTING': True,
    'ENABLE_EXPLANATIONS': True
}

COLUMN_MAPPING = {
    'cost_score': 'fundamentals.costs.ter',
    'tracking_error_score': 'fundamentals.costs.trackingError',
    'liquidity_score': 'fundamentals.liquidity.avgDailyVolume',
    'bid_ask_score': 'fundamentals.liquidity.avgBidAskSpread',
    'market_impact_score': 'fundamentals.liquidity.marketImpactScore',
    'volatility_30d': 'riskAnalysis.volatility.30d',
    'max_drawdown_score': 'riskAnalysis.drawdowns.maxDrawdown',
    'recovery_time_score': 'riskAnalysis.drawdowns.recoveryTimeDays',
    'flow_score': 'alternativeData.flows.30dNetFlow',
    'sentiment_news': 'alternativeData.sentiment.newsSentiment',
    'sentiment_social': 'alternativeData.sentiment.socialMediaSentiment',
    'analyst_consensus': 'alternativeData.sentiment.analystConsensus',
    'factor_beta': 'portfolio.characteristics.factorExposures.beta',
    'factor_size': 'portfolio.characteristics.factorExposures.size',
    'factor_value': 'portfolio.characteristics.factorExposures.value',
    'factor_momentum': 'portfolio.characteristics.factorExposures.momentum',
    'factor_quality': 'portfolio.characteristics.factorExposures.quality',
    'sampling_error_score': 'replication.optimization.samplingError',
    'lending_revenue_score': 'replication.lending.lendingRevenue',
    'institutional_score': 'alternativeData.ownership.institutionalPercentage',
    'coverage_score': 'replication.optimization.coverage',
    'basket_liquidity_score': 'riskAnalysis.liquidityRisk.basketLiquidityScore',
    'fund_age_years': 'metadata.creationDate'
    # Add mappings for ter_acceptable and liquidity_acceptable if needed
}
