import React from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserPortfolioFeature.css';


export default function UserPortfolioRebalancement({ type, onBack, onSelectETF }) {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4">Conseils</Typography>
        <Button variant="outlined"  onClick={() => navigate('/userportfolio')}>Retour</Button>
      </Box>
      <h4>🔄 Portfolio COnseil</h4>
      <p>Fonctionnalité à venir...</p>
    </div>
  );
}
