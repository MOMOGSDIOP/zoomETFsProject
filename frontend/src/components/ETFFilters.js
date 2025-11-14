import React, { useState } from 'react';
import Select from 'react-select';
import {
  FaMapMarkedAlt,      // Pour "Région"
  FaChartBar,          // Pour "Type"
  FaClone,             // Pour "Réplication"
  FaIndustry,          // Pour "Secteur" (conservé)
  FaCalendarCheck,     // Pour "Disponibilité"
  FaExclamationTriangle, // Pour "Risque"
  FaChessKnight,       // Pour "Stratégie"
  FaBuilding,          // Pour "Émetteur"
  FaLeaf,              // Pour "Notation ESG" (conservé)
  FaMoneyBillWave,     // Pour "Liquidité"
  FaWallet             // Pour "Encours (AUM)"
} from 'react-icons/fa';
import countries from '../data/countries';
import '../styles/ETFFilters.css';



const types = ['Accumulation', 'Capitalisation', 'Hybride'];
const replications = ['Physique', 'Synthétique'];
const sectors = [
  'Tous secteurs', 'Technologie', 'Santé', 'Finance',
  'Énergie', 'Consommation', 'Immobilier', 'Industrie',
];
const risks = ['Faible', 'Moyen', 'Élevé'];
const strategies = ['Smart Beta', 'Factor Investing', 'ESG', 'Sectoriel', 'Géographique'];
const esgRatings = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC'];
const liquidities = ['Faible', 'Moyenne', 'Élevée'];
const aumRanges = ['<100M', '100M–1B', '1B–10B', '>10B'];
const issuers = ['iShares', 'Vanguard', 'Lyxor', 'Amundi', 'Xtrackers', 'SPDR', 'Autre'];

const SortArrow = ({ order }) => (
  <span className="sort-arrow">
    {order === 'asc' ? '↑' : '↓'}
  </span>
);

function FilterToggle({ label, icon, field, options, value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="filter-block">
      <label
        onClick={() => setVisible(!visible)}
        className="filter-label-toggle"
      >
        {icon} {label}
      </label>
      {visible && (
        <Select
          options={[{ value: '', label: '-- Tous --' }, ...options.map(o => ({ value: o, label: o }))]}
          value={{ value: value || '', label: value || '-- Tous --' }}
          onChange={opt => onChange(field, opt ? opt.value : '')}
          className="react-select"
          classNamePrefix="select"
          isClearable
          placeholder="-- Tous --"
        />
      )}
    </div>
  );
}

export default function ETFFilters({
  filters,
  setFilters,
  onReset,
  onApply,
  onChangeSort,
  sortKey,
  sortOrder
}) {
  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSortChange = (field) => {
    if (!onChangeSort) return;
    onChangeSort(field);
  };

  return (
    <div className="etf-filters-container">
      <div className="filters-header-buttons">
        <button className="btn-apply" onClick={onApply}>OK</button>
        <button className="btn-reset" onClick={onReset}>Réinitialiser</button>
      </div>

      <div className="sort-box">
        <div className="sort-row">
          <span
            className={sortKey === 'performance' ? 'sort-active' : 'sort-inactive'}
            onClick={() => handleSortChange('performance')}
            role="button"
            tabIndex={0}
          >
            Performance {sortKey === 'performance' && <SortArrow order={sortOrder} />}
          </span>
          <span
            className={sortKey === 'price' ? 'sort-active' : 'sort-inactive'}
            onClick={() => handleSortChange('price')}
            role="button"
            tabIndex={0}
          >
            Prix {sortKey === 'price' && <SortArrow order={sortOrder} />}
          </span>
        </div>
      </div>

      <div className="filters-header">
      </div>

     <div className="filters-vertical">
  <FilterToggle label="Région" icon={<FaMapMarkedAlt />} field="region" options={countries} value={filters.region} onChange={handleFilterChange} />
  <FilterToggle label="Type" icon={<FaChartBar />} field="type" options={types} value={filters.type} onChange={handleFilterChange} />
  <FilterToggle label="Réplication" icon={<FaClone />} field="replication" options={replications} value={filters.replication} onChange={handleFilterChange} />
  <FilterToggle label="Secteur" icon={<FaIndustry />} field="sector" options={sectors} value={filters.sector} onChange={handleFilterChange} />
  <FilterToggle label="Disponibilité" icon={<FaCalendarCheck />} field="availability" options={countries} value={filters.availability} onChange={handleFilterChange} />
  <FilterToggle label="Risque" icon={<FaExclamationTriangle />} field="risk" options={risks} value={filters.risk} onChange={handleFilterChange} />
  <FilterToggle label="Stratégie" icon={<FaChessKnight />} field="strategy" options={strategies} value={filters.strategy} onChange={handleFilterChange} />
  <FilterToggle label="Émetteur" icon={<FaBuilding />} field="issuer" options={issuers} value={filters.issuer} onChange={handleFilterChange} />
  <FilterToggle label="Notation ESG" icon={<FaLeaf />} field="esg" options={esgRatings} value={filters.esg} onChange={handleFilterChange} />
  <FilterToggle label="Liquidité" icon={<FaMoneyBillWave />} field="liquidity" options={liquidities} value={filters.liquidity} onChange={handleFilterChange} />
  <FilterToggle label="Encours (AUM)" icon={<FaWallet />} field="aum" options={aumRanges} value={filters.aum} onChange={handleFilterChange} />
</div>

      {Object.values(filters).some(Boolean) && (
        <div className="filters-summary">
          <h4>Filtres appliqués :</h4>
          <div className="applied-filters">
            {Object.entries(filters).map(([key, value]) =>
              value && <span key={key} className="filter-tag">{key}: {value}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
