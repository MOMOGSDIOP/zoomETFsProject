import React, { useState } from 'react';
import ETFSearcher from '../ETFSearcher';
import ETFIdentity from '../ETFIdentity';

export default function TopRightQuadrant({ isExpanded }) {
  const [view, setView] = useState('search');
  const [selectedETFName, setSelectedETFName] = useState('');

  const handleSelectETF = (etfName) => {
    if (!etfName) {
      console.error('Nom ETF vide');
      return;
    }
    setSelectedETFName(etfName);
    setView('identity');
  };

  const renderView = () => {
    switch (view) {
      case 'search':
        return <ETFSearcher onSelectETF={handleSelectETF} />;
      case 'identity':
        return <ETFIdentity name={selectedETFName} onBack={() => setView('search')} />;
      default:
        return <ETFSearcher onSelectETF={handleSelectETF} />;
    }
  };

  return <div className="quadrant top-right">{renderView()}</div>;
}