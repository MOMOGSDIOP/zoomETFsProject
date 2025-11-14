import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserPortfolio from './UserPortfolio';

export default function UserPortfolioWithNavigate() {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    console.log(`Naviguer vers ${page}`); // Vérification du comportement de la navigation
    navigate(`/${page}`);
  };

  return (
    <div>
      <h1>Page du Portefeuille</h1>
      <UserPortfolio onNavigate={handleNavigate} />
    </div>
  );
}
