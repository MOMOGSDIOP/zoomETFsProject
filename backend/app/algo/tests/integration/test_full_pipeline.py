# tests/integration/test_full_pipeline.py
from rapp.Tech.algo.src.rating_model import ETFScoringEngine

def test_complete_analysis_flow(sample_config, minimal_etf_data):
    engine = ETFScoringEngine(sample_config)
    
    with patch('pandas.json_normalize') as mock_normalize, \
         patch.object(ETFDataPipeline, 'process') as mock_process:
        
        mock_normalize.return_value = minimal_etf_data
        mock_process.return_value = minimal_etf_data
        
        results = engine.run_full_analysis([{'etfId': 'ETF1'}])
        assert isinstance(results, dict)
        assert 'ratings' in results