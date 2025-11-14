import React, { useEffect, useState } from "react";
import { fetchETF } from "../../services/etfService";
import "../../styles/ETFTable.css";
import { Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ETFViewer() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const etfData = await fetchETF();
        setData(etfData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded shadow">
      Erreur : {error}
    </div>
  );

  if (loading) return (
    <div className="p-4 flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3">Chargement des données...</span>
    </div>
  );

  return (
    <div className="etf-table-container">
       <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <h1 className="text-2xl font-bold mb-6 text-gray-800">Liste des ETFs</h1>
              <Button  variant="outlined"  onClick={() => navigate('/dashboard')}>Retour</Button>
        </Box>
      {data.length === 0 ? (
        <div className="no-results">
          Aucun ETF disponible
        </div>
      ) : (
        <table className="etf-table">
          <thead>
            <tr>
              <th className="cell-left">Symbole</th>
              <th className="cell-left">Nom</th>
              <th className="cell-right">Variation</th>
              <th className="cell-right">Clôture</th>
              <th className="cell-right">Volume</th>
              <th className="cell-right">Ouverture</th>
              <th className="cell-right">Plus haut</th>
              <th className="cell-left">Secteur</th>
              <th className="cell-left">Type</th>
              <th className="cell-left">Mise à jour</th>
            </tr>
          </thead>
          <tbody>
            {data.map((etf) => (
              <tr key={etf.symbol}>
                <td className="cell-left">
                  <h2 className="font-bold text-gray-900">{etf.symbol}</h2>
                </td>
                <td className="cell-left">
                  <h3 className="text-gray-600">
                    {etf.name || `ETF ${etf.symbol}`}
                  </h3>
                </td>
                <td className="cell-right">
                  {etf.price_data?.change !== undefined && (
                    <span className={
                      etf.price_data.change >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }>
                      {etf.price_data.change.toFixed(2)}%
                    </span>
                  )}
                </td>
                <td className="cell-right">
                  ${etf.price_data?.close?.toFixed(2) || '--'}
                </td>
                <td className="cell-right">
                  {etf.price_data?.volume?.toLocaleString() || '--'}
                </td>
                <td className="cell-right">
                  ${etf.price_data?.open?.toFixed(2) || '--'}
                </td>
                <td className="cell-right">
                  ${etf.price_data?.high?.toFixed(2) || '--'}
                </td>
                <td className="cell-left">
                  {etf.sector || 'Non spécifié'}
                </td>
                <td className="cell-left">
                  {etf.asset_type || 'ETF'}
                </td>
                <td className="cell-left">
                  {new Date(etf.last_updated).toLocaleString()}
                  {etf.price_data?.date && (
                    <> • {new Date(etf.price_data.date).toLocaleDateString()}</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}