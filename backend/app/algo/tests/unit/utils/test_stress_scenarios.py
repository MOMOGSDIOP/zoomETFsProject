# tests/unit/utils/test_stress_scenarios.py
from app.Tech.algo.src.stress_scenarios import ETFStressTester

def test_stress_scenario_application():
    scenarios = [{'name': 'Test', 'type': 'market_crash', 'severity': 0.5}]
    tester = ETFStressTester(scenarios)
    df = pd.DataFrame({'fundamentals.priceData.currentPrice': [100, 200]})
    
    with patch.object(tester, '_apply_market_crash') as mock_apply:
        mock_apply.return_value = df
        tester.run_all_scenarios(df, MagicMock())
        mock_apply.assert_called_once()