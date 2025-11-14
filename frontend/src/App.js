import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import getTheme from './styles/Theme';
import { useTheme } from './context/ThemeContext';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import UserPortfolioWithNavigate from './components/UserPortfolioWithNavigate';
import UserPortfolio from './components/UserPortfolio';
import UserPortfolioAnalysis from './components/UserPortfolio/UserPortfolioAnalysis';
import UserPortfolioAlert from './components/UserPortfolio/UserPortfolioAlert';
import UserPortfolioExport from './components/UserPortfolio/UserPortfolioExport';
import UserPortfolioRebalancement from './components/UserPortfolio/UserPortfolioRebalancement';
import UserPortfolioTransaction from './components/UserPortfolio/UserPortfolioTransaction';
import UserPortfolioConseils from './components/UserPortfolio/UserPortfolioConseils';
import UserPortfolioList from './components/UserPortfolio/UserPortfolioList';
import UserPortfolioPerformance from './components/UserPortfolio/UserPortfolioPerformance';
import Login from './pages/Login';
import FiltresAdvanced from './pages/FiltresAdvanced';
import ETFIdentityFull from './pages/ETFIdentityFull';
import ETFSearcher from './components/ETFSearcher'; // 👈 Ajout ici
import DashboardBis from './pages/DashboardBis';
import EtfAI from './pages/EtfAI'; // 👈 Ajout ici
import ETFViewer from './components/etf/ETFViewer';
import SemanticETFai from './components/SemanticETFai'; 

export default function App() {
  const { mode } = useTheme();
  const theme = useMemo(() => getTheme(mode), [mode]);

  function UserPortfolioWithNavigate() {
    const navigate = useNavigate();
    const onNavigate = (page) => {
      navigate('/' + page);
    };
    return <UserPortfolio onNavigate={onNavigate} />;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<DashboardBis/>} />
        <Route path="/dashboard" element={<DashboardBis/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/userportfolio" element={<UserPortfolioWithNavigate />} />
        <Route path="/userAnalysis" element={<UserPortfolioAnalysis />} />
        <Route path="/userPerformance" element={<UserPortfolioPerformance />} />
        <Route path="/userTransaction" element={<UserPortfolioTransaction />} />
        <Route path="/userExport" element={<UserPortfolioExport />} />
        <Route path="/userRebalancement" element={<UserPortfolioRebalancement />} />
        <Route path="/userAlert" element={<UserPortfolioAlert />} />
        <Route path="/userList" element={<UserPortfolioList />} />
        <Route path="/userConseils" element={<UserPortfolioConseils />} />
        <Route path="/filtres-advanced" element={<FiltresAdvanced />} />
        <Route path="/etfai" element={<EtfAI />} />
        <Route path="/etfsearch" element={<ETFSearcher />} />
        <Route path="/etfList" element={<ETFViewer />} />
        <Route path="/etfidentity/:name" element={<ETFIdentityFull />} />
        <Route path="/semanticResearch" element={<SemanticETFai />} />
      </Routes>
    </MuiThemeProvider>
  );
}
