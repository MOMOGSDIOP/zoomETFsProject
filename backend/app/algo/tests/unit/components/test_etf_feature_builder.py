# tests/unit/components/test_etf_feature_builder.py
from app.Tech.algo.src.etf_feature_builder import ETFFeatureBuilder

def test_feature_builder_transform(minimal_etf_data):
    builder = ETFFeatureBuilder()
    features = builder.transform(minimal_etf_data)
    assert 'cost_score' in features.columns
    assert 'liquidity_score' in features.columns
    assert features.isna().sum().sum() == 0