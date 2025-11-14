import React from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserPortfolioFeature.css';


export default function UserPortfolioAlert({ type, onBack, onSelectETF }) {
  const navigate = useNavigate();

  return (
    <div className="user-portfolio-feature">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4">Alertes personnalisées</Typography>
        <Button variant="outlined"  onClick={() => navigate('/userportfolio')}>Retour</Button>
      </Box>

      <Paper sx={{ padding: 3, mb: 2 }}>
        <Typography>Fonctionnalités à venir :</Typography>
        <ul>
          <li>Alertes  .. </li>
          <li>.... ...</li>
          <li>.. ...</li>
        </ul>
      </Paper>

    
    </div>
  );
}
