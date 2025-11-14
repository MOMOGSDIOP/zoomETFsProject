import React, { useContext, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material'
import etfs from '../../data/dataETFsFull'; // Changement du nom d'import
import FicheCompare from '../comparaison/Fiche_Compare';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Exemple from '../comparaison/Exemple';

export default function UserPortfolioRebalancement() {
  const navigate = useNavigate();
  const { toggleTheme, mode } = useTheme();
  const { logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };
  
  // Vérification que les données sont bien chargées
  if (!etfs || etfs.length < 2) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Erreur : Données ETF non disponibles</Typography>
        <Button onClick={() => navigate('/userportfolio')} sx={{ mt: 2 }}>
          Retour
        </Button>
      </Box>
    );
  }

  const [etf1, etf2] = etfs.slice(0, 2);

  return (
    <div className="user-portfolio-rebalancement">
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar className="dashboard-header">
          <Box className="header-left">
            <IconButton edge="start" onClick={handleMenuClick} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Paramètres" />
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="À propos" />
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><LanguageIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Langue" />
              </MenuItem>
              <MenuItem onClick={() => navigate('/filtres-advanced')}>
                <ListItemIcon><SearchIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Recherche avancée" />
              </MenuItem>
              <MenuItem onClick={() => navigate('/etfsearch')}>
                <ListItemIcon><TrendingUpIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Big Moves" />
              </MenuItem>
            </Menu>
            <Typography variant="h6" className="project-title">
              ETFsZoom
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button onClick={() => navigate('/dashboard')}>Menu Principal</Button>
            <Button color="error" onClick={handleLogout}>Déconnexion</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/userportfolio')}
          sx={{ ml: 2 }}
        >
          Retour
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Exemple />
      </Box>
    </div>
  );
}