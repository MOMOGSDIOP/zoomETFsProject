import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserPortfolioFeature.css';
import { Button, Paper, Typography, Box } from '@mui/material';


export default function UserPortfolioExport({ type, onBack, onSelectETF }) {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4">Export Fichiers</Typography>
        <Button variant="outlined"  onClick={() => navigate('/userportfolio')}>Retour</Button>
      </Box>
      <h4>🔄 Portfolio EXport</h4>
      <p>Fonctionnalité à venir...</p>
    </div>
  );
}
