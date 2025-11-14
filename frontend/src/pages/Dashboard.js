import React from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import ETFFiltersManager from '../components/ETFFiltersManager';
import ErrorBoundary from '../components/ErrorBoundary';

import '../styles/GridLayout.css';

export default function Dashboard() {

  const { toggleTheme, mode } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isLoggedIn } = React.useContext(AuthContext);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    handleMenuClose();
    navigate(path);
  };

  return (
    <ErrorBoundary>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className="dashboard-header">
          <div className="header-left">
            <IconButton edge="start" onClick={handleMenuClick} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Paramètres" />
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <InfoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="À propos" />
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <LanguageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Langue" />
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/filtres-advanced')}>
                <ListItemIcon>
                  <SearchIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Recherche avancée" />
              </MenuItem>
              <MenuItem onClick={() => handleNavigation('/etfsearch')}>
                <ListItemIcon>
                  <TrendingUpIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Big Moves" />
              </MenuItem>
            </Menu>
            <Typography variant="h6" className="project-title">
              ETFsZoom
            </Typography>
            <Button 
            variant="outlined" 
            onClick={toggleTheme}
            style={{ 
              position: 'fixed',
              bottom: 16,
              left: 16,
              zIndex: 1000
            }}
          >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          </div>

          {!isLoggedIn ? (
            <Button onClick={() => navigate('/login')}>Se connecter</Button>) : (
            <Button onClick={() => navigate('/userportfolio')}>Mon Portefeuille</Button>)
          }
        </Toolbar>
      </AppBar>
      <div className="dashboard-grid">
        <div className="main-panel">
          <ETFFiltersManager />
        </div>
      </div>
    </ErrorBoundary>
  );
}
