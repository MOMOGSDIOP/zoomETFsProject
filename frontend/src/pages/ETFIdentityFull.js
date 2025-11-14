import React from 'react';
import {
  Paper, Typography, Box, Divider, Button
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useParams, useNavigate } from 'react-router-dom';
import etfs from '../data/dataETFsFull';

export default function ETFIdentityFull() {
  const { name } = useParams();
  const navigate = useNavigate();

  const normalize = str =>
    decodeURIComponent(str).toLowerCase().replace(/\s+/g, ' ').trim();

  const etf = etfs.find(e => normalize(e.name) === normalize(name));

  if (!etf) {
    return (
      <Paper sx={{ p: 4, m: 4 }}>
        <Typography variant="h5">ETF introuvable  </Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Retour
        </Button>
      </Paper>
    );
  }

  const performance = ((etf.currentPrice - etf.previousClose) / etf.previousClose) * 100;
  const formattedPerformance = performance.toFixed(2) + ' %';

  const PerformanceWithIcon = () => {
    if (performance > 0) return <span>{formattedPerformance} <ArrowDropUpIcon color="success" /></span>;
    if (performance < 0) return <span>{formattedPerformance} <ArrowDropDownIcon color="error" /></span>;
    return <span>{formattedPerformance}</span>;
  };

  return (
    <Paper sx={{ p: 5, m: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{etf.name}</Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Retour
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Catégorie : {etf.category || 'N/A'}</Typography>
        <Typography variant="h6">Prix actuel : {etf.currentPrice} €</Typography>
        <Typography variant="h6">Clôture précédente : {etf.previousClose} €</Typography>
        <Typography variant="h6">Performance journalière : <PerformanceWithIcon /></Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {etf.description && (
        <Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {etf.description}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
