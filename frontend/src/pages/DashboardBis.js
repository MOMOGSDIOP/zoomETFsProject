import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/GridLayoutBis.css';
import ErrorBoundary from '../components/ErrorBoundary';
import TopLeftQuadrant from '../components/quadrants/TopLeftQuadrant';
import TopRightQuadrant from '../components/quadrants/TopRightQuadrant';
import BottomRightQuadrant from '../components/quadrants/BottomRightQuadrant';
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
import ETFFiltersManager from '../components/ETFFiltersManager';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export default function DashboardBis() {
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
      <div className={mode === 'light' ? 'light-mode' : 'dark-mode'}>
        <AppBar position="static" color="default" elevation={5}>
          <Toolbar className="dashboard-header">
            <div className="header-left">
              <IconButton
                edge="start"
                onClick={handleMenuClick}
                aria-label="Menu"
                sx={{ ml: 2, mt:3}} 
                >
                <MenuIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleNavigation('/settings')}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Paramètres" />
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/about')}>
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
              <MenuItem onClick={() => handleNavigation('/etfList')}>
                <ListItemIcon>
                  <TrendingUpIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Liste ETFs" />
              </MenuItem>
              </Menu>
            </div>
             {!isLoggedIn ? (
               <Button sx={{ fontSize: 18 }} onClick={() => navigate('/login')}>Se connecter</Button>) : (
               <Button  sx={{ fontSize: 18 }} onClick={() => navigate('/userportfolio')}>Mon Portefeuille</Button>)
              }
          </Toolbar>
        </AppBar>
      </div>
 
      <div className="dashboard-grid">
        <div className="panel left-panel">
          <TopLeftQuadrant />
        </div>
        <div className="panel top-right">
          <TopRightQuadrant />
        </div>
        <div className="panel bottom-right">
          <BottomRightQuadrant />
        </div>
      </div>
    </ErrorBoundary>
  );
}