# Nouveau fichier temporal_aligner.py
import pandas as pd


class TemporalAligner:
    def align(self, df):
        """Aligne les séries temporelles"""
        df['date'] = pd.to_datetime(df['date'])
        return df.sort_values('date').ffill()