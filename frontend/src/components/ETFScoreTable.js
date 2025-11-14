import React from 'react';
import PropTypes from 'prop-types';
import '../styles/ETFScoreTable.css';

function StarRating({ rating }) {
  const stars = [];
  // Convertit la performance (0-100) en étoiles (1-5)
  const starValue = rating !== undefined && rating !== null
    ? Math.min(5, Math.max(1, Math.floor(rating / 20))) 
    : 1;

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className={`star ${i <= starValue ? 'full-star' : 'empty-star'}`}
        aria-hidden="true"
      >
        {i <= starValue ? '★' : '☆'}
      </span>
    );
  }

  return <div className="star-rating" aria-label={`Note: ${starValue} sur 5 étoiles`}>{stars}</div>;
}

function VolatilityBar({ value }) {
  const percentage = value !== undefined && value !== null
    ? Math.min(100, Math.max(0, value))
    : 0;

  return (
    <div className="volatility-bar-container" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
      <div
        className="volatility-bar"
        style={{ width: `${percentage}%` }}
      />
      <span className="volatility-value">{value !== undefined && value !== null ? `${value.toFixed(1)}%` : 'N/A'}</span>
    </div>
  );
}

export default function ETFScoreTable({
  etfs = [],
  sortKey = 'performance',
  sortOrder = 'desc',
  onBack,
  onSelectETF,
}) {
  if (!etfs || etfs.length === 0) {
    return (
      <div className="no-etfs-message">
        <p>Aucun ETF ne correspond aux filtres sélectionnés.</p>
        {onBack && (
          <button className="btn-back" onClick={onBack}>
            ← Retour au Dashboard
          </button>
        )}
      </div>
    );
  }

  const sortedEtfs = [...etfs].sort((a, b) => {
    const aVal = a[sortKey] ?? a.returns?.annual ?? 0;
    const bVal = b[sortKey] ?? b.returns?.annual ?? 0;

    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="etf-table-container">
      {onBack && (
        <div className="back-button-container">
          <button className="btn-back" onClick={onBack}>
            ← Retour au Dashboard
          </button>
        </div>
      )}

      <table className="etf-score-table" role="table" aria-label="Tableau des ETFs">
        <thead>
          <tr>
            <th className="name-column" scope="col">Nom</th>
            <th scope="col">Performance</th>
            <th scope="col">Volatilité</th>
            <th scope="col">Frais (TER)</th>
            <th scope="col">Prix (USD)</th>
            <th className="rating-column" scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          {sortedEtfs.map((etf) => (
            <tr
              key={etf.name}
              className="etf-row"
              onClick={() => onSelectETF?.(etf)}
              tabIndex={0}
              role="row"
              aria-label={`ETF ${etf.name}, performance ${(etf.performance ?? etf.returns?.annual)?.toFixed(1) ?? 'N/A'} pourcent`}
            >
              <td className="etf-name" role="cell">
                <div className="etf-name-wrapper">
                  <span className="etf-main-name">{etf.name}</span>
                  <span className="etf-issuer">{etf.issuer || ''}</span>
                </div>
              </td>
              <td className="performance-cell" role="cell">
                {(etf.performance ?? etf.returns?.annual)?.toFixed(1) ?? 'N/A'}%
              </td>
              <td role="cell">
                <VolatilityBar value={etf.volatility ?? etf.riskMetrics?.vol1y} />
              </td>
              <td className="ter-cell" role="cell">
                {etf.TER !== undefined && etf.TER !== null
                  ? `${etf.TER}%`
                  : etf.generalInfo?.totalExpenseRatio ?? 'N/A'}
              </td>
              <td className="price-cell" role="cell">
                {etf.currentPrice !== undefined && etf.currentPrice !== null
                  ? etf.currentPrice.toFixed(2)
                  : 'N/A'}
              </td>
              <td className="star-rating-cell" role="cell">
                <StarRating rating={etf.performance ?? etf.returns?.annual} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

ETFScoreTable.propTypes = {
  etfs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      issuer: PropTypes.string,
      currentPrice: PropTypes.number,
      performance: PropTypes.number,
      volatility: PropTypes.number,
      dividendYield: PropTypes.number,
      TER: PropTypes.number,
      returns: PropTypes.shape({
        annual: PropTypes.number,
      }),
      riskMetrics: PropTypes.shape({
        vol1y: PropTypes.number,
      }),
      generalInfo: PropTypes.shape({
        totalExpenseRatio: PropTypes.string,
        currency: PropTypes.string,
      }),
    })
  ).isRequired,
  sortKey: PropTypes.string,
  sortOrder: PropTypes.oneOf(['asc', 'desc']),
  onSelectETF: PropTypes.func,
  onBack: PropTypes.func,
};
