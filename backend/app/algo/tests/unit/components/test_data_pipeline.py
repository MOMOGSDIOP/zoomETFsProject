# tests/unit/components/test_data_pipeline.py
from app.Tech.algo.src.data_pipeline import ETFDataPipeline

def test_data_pipeline_handles_missing_values():
    pipeline = ETFDataPipeline()
    df = pd.DataFrame({'col1': [1, None, 3], 'col2': ['A', None, 'C']})
    processed = pipeline.handle_missing_values(df)
    assert processed.isna().sum().sum() == 0