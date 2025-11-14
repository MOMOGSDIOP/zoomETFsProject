// pages/FiltresAdvanced.jsx
import React, { useState, useMemo } from 'react';
import ETFFilters from '../components/ETFFilters';
import ETFScoreTable from '../components/ETFScoreTable';
import etfs from '../data/dataETFsFull';
import noterETFAvance from '../utils/NoterETFAdvanced';
import '../styles/FiltresAdvanced.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  Box
} from '@mui/material';
 import { ListItemIcon, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import ErrorBoundary from '../components/ErrorBoundary';

export default function FiltresAdvanced({ onBack, onSelectETF }) {
   const { toggleTheme, mode } = useTheme();
   const navigate = useNavigate();
   const [anchorEl, setAnchorEl] = React.useState(null);
  
   const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [filters, setFilters] = useState({
    region: '',
    type: '',
    replication: '',
    sector: '',
    availability: '',
    risk: '',
    strategy: ''
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [sortKey, setSortKey] = useState('performance');
  const [sortOrder, setSortOrder] = useState('desc');

  const onChangeSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'performance' ? 'desc' : 'asc');
    }
  };

  const resetFilters = () => {
    const resetState = {
      region: '',
      type: '',
      replication: '',
      sector: '',
      availability: '',
      risk: '',
      strategy: ''
    };
    setFilters(resetState);
    setAppliedFilters(resetState);
  };
  const applyFilters = () => setAppliedFilters(filters);

  const filteredEtfs = useMemo(() => {
    return etfs.filter(e => {
      const { region, type, replication, sector, availability, risk, strategy } = appliedFilters;

      if (availability && availability !== '') {
        if (availability === 'Partout') {
          if (e.availability !== 'Partout') return false;
        } else {
          if (e.availability !== availability && e.availability !== 'Partout') return false;
        }
      }
      if (region && region !== '' && e.region !== region) return false;
      if (type && type !== '' && e.type !== type) return false;
      if (replication && replication !== '' && e.replication !== replication) return false;
      if (sector && sector !== '' && sector !== 'Tous secteurs' && e.sector !== sector) return false;
      if (risk && risk !== '' && e.risk !== risk) return false;
      if (strategy && strategy !== '' && !e.strategies?.includes(strategy)) return false;

      return true;
    }).map(etf => {
      const {globalNote,globalScore,scores } = noterETFAvance(etf);
      return { ...etf, score: globalScore,notation : {globalNote,scores}};
    }).sort((a, b) => b.score - a.score);
  }, [appliedFilters]);

  return (
    <ErrorBoundary>
       <AppBar position="static" color="default" elevation={0}   >
        <Toolbar className="dashboard-header">
          <div className="header-left">
            <IconButton edge="start" onClick={handleMenuClick} aria-label="menu">
              <MenuIcon />
            </IconButton>
               <Menu> 
                 anchorEl={anchorEl}
                 open={Boolean(anchorEl)}
                 onClose={handleMenuClose}
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
              </Menu>  
            <Typography variant="h6" className="project-title">
              ETFsZoom
            </Typography>
          </div>
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
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>Retour</Button>
        </Toolbar>
      </AppBar>
    <div className="filtres-advanced-wrapper">
      <div className="filters-advanced-column">
        <ETFFilters
         filters={filters}
          setFilters={setFilters}
          onReset={resetFilters}
          onApply={applyFilters}
          onChangeSort={onChangeSort}
          sortKey={sortKey}
          sortOrder={sortOrder}
        />
      </div>
      <div className="table-advanced-column">
        <ETFScoreTable 
           etfs={filteredEtfs}
           sortKey={sortKey}
           sortOrder={sortOrder}
           onSelectETF={onSelectETF}  />
      </div>
    </div>
  </ErrorBoundary>
  );
}
