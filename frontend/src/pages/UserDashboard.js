import React from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import TopRightQuadrant from '../components/quadrants/TopRightQuadrant';
import BottomRightQuadrant from '../components/quadrants/BottomRightQuadrant';
import TopLeftQuadrant from '../components/quadrants/TopLeftQuadrant';
import BottomLeftQuadrant from '../components/quadrants/BottomLeftQuadrant';
import ErrorBoundary from '../components/ErrorBoundary';

import '../styles/GridLayout.css';

export default function UserDashboard() {
  const { toggleTheme, mode } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <ErrorBoundary>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar className="dashboard-header">
          <div className="header-left">
            <IconButton edge="start" onClick={handleMenuClick} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>About</MenuItem>
            </Menu>
            <Typography variant="h6" className="project-title">
              ZoomETF
            </Typography>
          </div>

          <Button onClick={() => navigate('/')}>Déconnexion</Button>
        </Toolbar>
      </AppBar>

      <div className="dashboard-grid">
        <div className="quadrant top-left">
          <TopLeftQuadrant />
        </div>
        <div className="quadrant top-right">
          <TopRightQuadrant />
        </div>
        <div className="quadrant bottom-left">
          <BottomLeftQuadrant />
        </div>
        <div className="quadrant bottom-right">
          <BottomRightQuadrant />
        </div>

        <Button
          variant="outlined"
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000,
          }}
        >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>
    </ErrorBoundary>
  );
}
