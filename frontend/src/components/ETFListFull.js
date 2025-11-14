import React from 'react';
import {
  Paper, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button, Box
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../styles/ETFListfull.css';
import etfs from '../data/dataETFsFull';
import { useNavigate } from 'react-router-dom';

export default function ETFListFull({ type, onBack, onSelectETF }) {
  const navigate = useNavigate();

  if (!type || (type !== 'best' && type !== 'worst')) {
    return <Typography variant="body1" sx={{ m: 2 }}>Type non reconnu</Typography>;
  }

  const calculateDailyPerformance = (etf) =>
    ((etf.currentPrice - etf.previousClose) / etf.previousClose) * 100;

  const sortedETFs = etfs.filter(etf => etf.currentPrice && etf.previousClose);

  const data = [...sortedETFs].sort((a, b) =>
    type === 'best'
      ? calculateDailyPerformance(b) - calculateDailyPerformance(a)
      : calculateDailyPerformance(a) - calculateDailyPerformance(b)
  );

  const title = type === 'best'
    ? 'Liste complète - Meilleures performances'
    : 'Liste complète - Pires performances';

  const PriceWithArrow = ({ currentPrice, previousClose }) => {
    const performance = ((currentPrice - previousClose) / previousClose) * 100;
    const formatted = performance.toFixed(2) + ' %';
    if (performance > 0) return <span>{formatted} <ArrowDropUpIcon color="success" /></span>;
    if (performance < 0) return <span>{formatted} <ArrowDropDownIcon color="error" /></span>;
    return <span>{formatted}</span>;
  };

  return (
    <Paper className="etf-full-list" sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{title}</Typography>
        <Button variant="outlined" onClick={onBack}>Retour</Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Performance journalière</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(etf => (
              <TableRow
                key={etf.name}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => onSelectETF && onSelectETF(etf.name)}
              >
                <TableCell>{etf.name}</TableCell>
                <TableCell align="right">
                  <PriceWithArrow
                    currentPrice={etf.currentPrice}
                    previousClose={etf.previousClose}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
