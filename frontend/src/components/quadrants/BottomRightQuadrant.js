// quadrants/BottomRightQuadrant.js
import React, { useState } from 'react';
import ETFList from '../ETFList';
import ETFIdentity from '../ETFIdentity';
import ETFListFull from '../ETFListFull';
import ETFIdentityFull from '../../pages/ETFIdentityFull';

export default function BottomRightQuadrant({ isExpanded }) {
  const [view, setView] = useState('list');
  const [selectedETF, setSelectedETF] = useState(null);

  const handleSelectETF = (name) => {
    setSelectedETF(name);
    setView('identity');
  };

  const handleNavigate = (viewType) => {
    setView(viewType);
  };

  const renderView = () => {
    switch (view) {
      case 'list':
        return <ETFList onSelect={handleSelectETF} onNavigate={handleNavigate} />;
      case 'identity':
        return <ETFIdentity name={selectedETF} onBack={() => setView('list')} />;
      case 'best':
      case 'worst':
        return <ETFListFull type={view} onBack={() => setView('list')} onSelectETF={handleSelectETF}/>;
      default:
        return <ETFList onSelect={handleSelectETF} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`quadrant-content ${isExpanded ? 'expanded' : ''}`}>
      {renderView()}
    </div>
  );
}