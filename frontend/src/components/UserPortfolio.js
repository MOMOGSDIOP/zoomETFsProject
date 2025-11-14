import React, { useContext, useState } from 'react';
import '../styles/UserPortfolio.css';
import userEtfs from '../data/User/UpEtfs';
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
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

export default function UserPortfolio() {
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

  if (!userEtfs || userEtfs.length === 0) {
    return <div>Erreur : Aucune donnée ETF trouvée.</div>;
  }

  const investmentData = userEtfs.map((etf) => ({
    name: etf.name,
    value: parseFloat((100 / userEtfs.length).toFixed(2)),
  }));

  const performanceData = [
    { date: 'Jan', performance: 100 },
    { date: 'Fév', performance: 108 },
    { date: 'Mar', performance: 115 },
    { date: 'Avr', performance: 120 },
    { date: 'Mai', performance: 127 },
  ];

  return (
    <div className="portfolio-container">
      {/* Header */}
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

      {/* Sidebar */}
      <div className="portfolio-sidebar">
        <div className="portfolio-section">
          <ul className="feature-list">
            <li onClick={() => navigate('/userList')}>Mes ETFS</li>
            <li onClick={() => navigate('/userPerformance')}>Performances</li>
            <li onClick={() => navigate('/userAnalysis')}>Analyses</li>
            <li onClick={() => navigate('/userTransaction')}>Transactions</li>
            <li onClick={() => navigate('/userAlert')}>Alertes</li>
            <li onClick={() => navigate('/userRebalancement')}>Rebalancement</li>
            <li onClick={() => navigate('/userDividendes')}>Dividendes</li>
            <li onClick={() => navigate('/userExport')}>Export Fichiers</li>
            <li onClick={() => navigate('/userConseils')}>Conseils</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="portfolio-main">
        <div className="portfolio-grid">
          <div className="portfolio-center">
            <Typography variant="h6" gutterBottom>
              Répartition par ETF
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={investmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {investmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="portfolio-performance">
            <Typography variant="h6" gutterBottom>
              Évolution de la performance
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="performance" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Toggle Theme Button */}
      <Button
        variant="outlined"
        onClick={toggleTheme}
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        {mode === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
      </Button>
    </div>
  );
}
