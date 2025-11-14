# utils/etf_validation.py  
def validate_etf(etf: Dict) -> bool:  
    required_fields = ["isin", "name", "fees", "performance_1y"]  
    return all(field in etf for field in required_fields)  