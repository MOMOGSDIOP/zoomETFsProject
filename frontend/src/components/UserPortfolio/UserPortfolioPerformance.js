import React from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserPortfolioFeature.css';


export default function PerformanceGlobale({ type, onBack, onSelectETF }) {
  const navigate = useNavigate();

  // Simule données portfolio (à remplacer par vrai state ou API)
  const portfolioValue = 12000;
  const investedValue = 10000;
  const performance = ((portfolioValue - investedValue) / investedValue) * 100;

  return (
    <div className="feature-page">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4">Performance</Typography>
        <Button variant="outlined"  onClick={() => navigate('/userportfolio')}>Retour</Button>
      </Box>

      <Paper sx={{ padding: 4, marginBottom: 3, textAlign: 'center' }}>
        <Typography variant="h6">Valeur investie :</Typography>
        <Typography variant="h5" color="textSecondary">{investedValue.toFixed(2)} €</Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>Valeur actuelle :</Typography>
        <Typography variant="h5" color="textSecondary">{portfolioValue.toFixed(2)} €</Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>Performance :</Typography>
        <Typography
          variant="h3"
          sx={{ 
            color: performance >= 0 ? 'green' : 'red', 
            fontWeight: 'bold', 
            marginTop: 1 
          }}
        >
          {performance.toFixed(2)} %
        </Typography>
      </Paper>
    </div>
  );
}
