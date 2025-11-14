import pandas as pd
import numpy as np
from datetime import datetime
from config import REQUIRED_COLUMNS


class ETFFeatureBuilder:
    def __init__(self, config=None):
        self.config = config or {}
        self.required_columns = self.config.get('REQUIRED_COLUMNS', REQUIRED_COLUMNS)
        self.risk_params = self.config.get('RISK_PARAMETERS', {})

    def transform(self, etf_data: pd.DataFrame) -> pd.DataFrame:
        """Transforme les données brutes d'ETFs en features prêtes pour le modèle"""
        features = pd.DataFrame(index=etf_data.index)

        # Coût
        features["cost_score"] = 1 - self._normalize(etf_data["fundamentals.costs.ter"])
        features["tracking_error_score"] = 1 - self._normalize(etf_data["fundamentals.costs.trackingError"])

        # Liquidité
        features["liquidity_score"] = self._normalize(np.log1p(etf_data["fundamentals.liquidity.avgDailyVolume"]))
        features["bid_ask_score"] = 1 - self._normalize(etf_data["fundamentals.liquidity.avgBidAskSpread"])
        features["market_impact_score"] = 1 - self._normalize(etf_data["fundamentals.liquidity.marketImpactScore"])

        # Risque
        features["volatility_30d"] = self._normalize(etf_data["riskAnalysis.volatility.30d"])
        features["max_drawdown_score"] = 1 + self._normalize(etf_data["riskAnalysis.drawdowns.maxDrawdown"])  # drawdown négatif
        features["recovery_time_score"] = 1 - self._normalize(etf_data["riskAnalysis.drawdowns.recoveryTimeDays"])

        # Flows / Sentiment
        features["flow_score"] = self._normalize(np.log1p(etf_data["alternativeData.flows.30dNetFlow"]))
        features["sentiment_news"] = self._normalize(etf_data["alternativeData.sentiment.newsSentiment"])
        features["sentiment_social"] = self._normalize(etf_data["alternativeData.sentiment.socialMediaSentiment"])
        features["analyst_consensus"] = self._normalize(etf_data["alternativeData.sentiment.analystConsensus"])

        # Facteurs (expositions)
        for factor in ["beta", "size", "value", "momentum", "quality"]:
            col = f"portfolio.characteristics.factorExposures.{factor}"
            if col in etf_data.columns:
                features[f"factor_{factor}"] = self._normalize(etf_data[col])

        # Structure / technique
        features["sampling_error_score"] = 1 - self._normalize(etf_data["replication.optimization.samplingError"])
        features["lending_revenue_score"] = self._normalize(etf_data["replication.lending.lendingRevenue"])

        # Divers
        features["institutional_score"] = self._normalize(etf_data["alternativeData.ownership.institutionalPercentage"])
        features["coverage_score"] = self._normalize(etf_data["replication.optimization.coverage"])
        features["basket_liquidity_score"] = self._normalize(etf_data["riskAnalysis.liquidityRisk.basketLiquidityScore"])
        
        
        # Ajouter des features basées sur les seuils de configuration
        features["ter_acceptable"] = (
            etf_data["fundamentals.costs.ter"] <= self.risk_params.get('max_ter', 0.05)
        ).astype(int)
        
        features["liquidity_acceptable"] = (
            etf_data["fundamentals.liquidity.avgDailyVolume"] >= 
            self.risk_params.get('min_liquidity', 1e6)
        ).astype(int)
        
        
        # Âge du fonds
        if "metadata.creationDate" in etf_data.columns:
            today = pd.Timestamp("today").normalize()
            creation_dates = pd.to_datetime(etf_data["metadata.creationDate"], errors="coerce")
            features["fund_age_years"] = (today - creation_dates).dt.days / 365.25

        return features

    def _normalize(self, series: pd.Series, inverse: bool = False) -> pd.Series:
        """Normalise une série entre 0 et 1"""
        series = series.astype(float)
        min_val = series.min()
        max_val = series.max()
        if max_val == min_val:
            return pd.Series(0.5, index=series.index)  # constante
        norm = (series - min_val) / (max_val - min_val)
        return 1 - norm if inverse else norm
    
    
    def _validate_input(self, df):
        """Vérifie que le DataFrame contient toutes les colonnes requises"""
        missing = [c for c in self.required_columns if c not in df.columns]
        if missing:
            raise ValueError(f"Données incomplètes. Colonnes manquantes: {missing}")
