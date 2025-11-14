import React from 'react';
import {
  Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Box
} from '@mui/material';
import etfs from '../../data/etfs';
import '../../styles/UserPortfolioFeature.css';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';



export default function ListeETFs({ onBack, onSelectETF }) {

  const navigate = useNavigate();
  const { toggleTheme, mode } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const PriceWithArrow = ({ currentPrice, previousClose }) => {
    const performance = ((currentPrice - previousClose) / previousClose) * 100;
    const formatted = performance.toFixed(2) + ' %';
    return (
      <span style={{ color: performance > 0 ? 'green' : performance < 0 ? 'red' : 'inherit' }}>
        {formatted}
      </span>
    );
  };

  return (
    <div className="feature-page">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4">Liste de mes ETFs</Typography>
        <Button variant="outlined" onClick={() => navigate('/userportfolio')}>Retour</Button>
      </Box>

      <Paper sx={{ marginBottom: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Prix actuel</TableCell>
                <TableCell align="right">Performance</TableCell>
                <TableCell>Émetteur</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {etfs.map(etf => (
                <TableRow
                  key={etf.name}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onSelectETF(etf.name)}
                >
                  <TableCell>{etf.name}</TableCell>
                  <TableCell align="right">{etf.currentPrice.toFixed(2)} €</TableCell>
                  <TableCell align="right">
                    <PriceWithArrow currentPrice={etf.currentPrice} previousClose={etf.previousClose} />
                  </TableCell>
                  <TableCell>{etf.issuer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
