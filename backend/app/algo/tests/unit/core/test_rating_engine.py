# tests/unit/core/test_rating_engine.py
from app.Tech.algo.src.rating_model import ETFScoringEngine

def test_engine_initialization(sample_config):
    engine = ETFScoringEngine(sample_config)
    assert hasattr(engine, 'semi_supervised_model')
    assert hasattr(engine, 'gnn_model')

def test_predict_returns_ratings(sample_config, minimal_etf_data):
    engine = ETFScoringEngine(sample_config)
    with patch.object(engine.feature_builder, 'transform') as mock_transform:
        mock_transform.return_value = pd.DataFrame(np.random.rand(2, 24))
        results = engine.predict(minimal_etf_data)
        assert 'rating' in results.columns