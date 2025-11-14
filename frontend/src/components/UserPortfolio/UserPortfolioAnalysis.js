import React from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserPortfolioFeature.css';


export default function UserPortfolioAnalysis({ type, onBack, onSelectETF }) {
  const navigate = useNavigate();

  return (
    <div className="user-portfolio-feature">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4">Outils d'analyse</Typography>
        <Button variant="outlined"  onClick={() => navigate('/userportfolio')}>Retour</Button>
      </Box>

      <Paper sx={{ padding: 3, mb: 2 }}>
        <Typography>Fonctionnalités à venir :</Typography>
        <ul>
          <li>Analyse de performance par secteur</li>
          <li>Graphiques interactifs</li>
          <li>Alertes personnalisées</li>
        </ul>
      </Paper>

    
    </div>
  );
}
