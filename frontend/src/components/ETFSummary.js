import React from 'react';
import '../styles/ETFFilters.css';

export default function ETFSummary({ filters }) {
  const hasFilters = Object.values(filters).some(Boolean);

  if (!hasFilters) return null;

  return (
    <div className="filters-summary">
      <h4>Filtres appliqués :</h4>
      <div className="applied-filters">
        {Object.entries(filters).map(([key, value]) =>
          value ? (
            <span key={key} className="filter-tag">
              {key}: {value}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}
