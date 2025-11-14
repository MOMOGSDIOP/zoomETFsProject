import React, { useState } from 'react';
import UserPortfolio from '../UserPortfolio';
import UserPortfolioList from '../UserPortfolio/UserPortfolioList';
import UserPortfolioPerformance from '../UserPortfolio/UserPortfolioPerformance';
import UserPortfolioAnalysis from '../UserPortfolio/UserPortfolioAnalysis';
import UserPortfolioRebalancement from '../UserPortfolio/UserPortfolioRebalancement';
import UserPortfolioDividendes from '../UserPortfolio/UserPortfolioDividendes';
import UserPortfolioExport from '../UserPortfolio/UserPortfolioExport';
import UserPortfolioConseils from '../UserPortfolio/UserPortfolioConseils';
import ETFIdentity from '../ETFIdentity';
import UserPortfolioAlert from '../UserPortfolio/UserPortfolioAlert';
import UserPortfolioTransaction from '../UserPortfolio/UserPortfolioTransaction';

export default function BottomLeftQuadrant({ isExpanded }) {
  const [view, setView] = useState('user');
  const [selectedETF, setSelectedETF] = useState(null);
  
  const handleSelectETF = (name) => {
    setSelectedETF(name);
    setView('identity');
  };

  const renderView = () => {
    switch (view) {
      case 'user':
        return <UserPortfolio onNavigate={setView} />;
      case 'list':
        return <UserPortfolioList  onNavigate={setView}  onBack={() => setView('user')}  onSelectETF={handleSelectETF} />;
      case 'performance':
        return <UserPortfolioPerformance onNavigate={setView}   onBack={() => setView('user')} onSelectETF={handleSelectETF}   />;
      case 'analysis':
        return <UserPortfolioAnalysis onNavigate={setView} onBack={() => setView('user')}  onSelectETF={handleSelectETF} />;
      case 'rebalancement':
        return <UserPortfolioRebalancement onNavigate={setView} onBack={() => setView('user')}  onSelectETF={handleSelectETF}/>;
      case 'dividendes':
        return <UserPortfolioDividendes onNavigate={setView} onBack={() => setView('user')}  onSelectETF={handleSelectETF}/>;
      case 'export':
        return <UserPortfolioExport onNavigate={setView} onBack={() => setView('user')}  onSelectETF={handleSelectETF} />;
      case 'conseils':
        return <UserPortfolioConseils onNavigate={setView} onBack={() => setView('user')}  onSelectETF={handleSelectETF}/>;
      case 'identity':
        return <ETFIdentity name={selectedETF} onBack={() => setView('user')} />;
      case 'alert':
        return <UserPortfolioAlert onNavigate={setView} onBack={() => setView('user')}  onSelectETF={handleSelectETF} />;
      case 'transaction':
        return <UserPortfolioTransaction nonNavigate={setView} onBack={() => setView('user')}  onSelectETF={handleSelectETF} />;
      default:
        return <UserPortfolio onNavigate={setView} />;
    }
  };

  return <div className={`quadrant-content ${isExpanded ? 'expanded' : ''}`}>
      {renderView()}</div>;
}
