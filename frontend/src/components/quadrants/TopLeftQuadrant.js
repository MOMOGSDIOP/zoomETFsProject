import React, { useState } from 'react';
import ETFFiltersManager from '../ETFFiltersManager';
import ETFIdentity from '../ETFIdentity';
import FiltresAdvanced from '../../pages/FiltresAdvanced';
import Dashboard from '../../pages/Dashboard';

export default function TopLeftQuadrant({ isExpanded }) {
  const [view, setView] = useState('filtre');
  const [selectedETF, setSelectedETF] = useState(null);

  const handleSelectETF = (name) => {
    setSelectedETF(name);
    setView('identity');
  };

  const handleBack = () => {
    setView('filtre');
    setSelectedETF(null);
  };

  const renderView = () => {
    switch (view) {
      case 'filtre':
        return <ETFFiltersManager onSelectETF={handleSelectETF} />;
      case 'identity':
        return <ETFIdentity name={selectedETF} onBack={() => setView('dashboard')}  />;
      case 'filtres-advanced':
        return <FiltresAdvanced name={selectedETF} onBack={() => setView('filtre')}/>;
      default:
        return <ETFFiltersManager onSelectETF={handleSelectETF} />;
    }
  };

  return <div className="quadrant top-left">{renderView()}</div>;
}