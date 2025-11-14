import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ETFFilters from './ETFFilters';
import ETFTable from './ETFTable';
import etfs from '../data/etfs';
import '../styles/ETFFilters.css';
import '../styles/ETFTable.css';
import '../styles/ETFFiltersManager.css';
import NoterETFAvanced from '../utils/NoterETFAdvanced';

export default function ETFFiltersManager({ type, onBack, onSelectETF }) {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    region: '',
    type: '',
    replication: '',
    sector: '',                                                    
    availability: '',
    risk: '',
    strategy: ''
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [sortKey, setSortKey] = useState('performance');
  const [sortOrder, setSortOrder] = useState('desc');

  const onChangeSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'performance' ? 'desc' : 'asc');
    }
  };

  const resetFilters = () => {
    const resetState = {
      region: '',
      type: '',
      replication: '',
      sector: '',
      availability: '',
      risk: '',
      strategy: ''
    };
    setFilters(resetState);
    setAppliedFilters(resetState);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filteredEtfs = useMemo(() => {
    return etfs
      .filter((e) => {
        const { region, type, replication, sector, availability, risk, strategy } = appliedFilters;

        if (availability && availability !== '') {
          if (availability === 'Partout') {
            if (e.availability !== 'Partout') return false;
          } else {
            if (e.availability !== availability && e.availability !== 'Partout') return false;
          }
        }

        if (region && region !== '') {
          if (e.region !== region) return false;
        }

        if (type && type !== '') {
          if (e.type !== type) return false;
        }

        if (replication && replication !== '') {
          if (e.replication !== replication) return false;
        }

        if (sector && sector !== '') {
          if (sector !== 'Tous secteurs' && e.sector !== sector) return false;
        }

        if (risk && risk !== '') {
          if (e.risk !== risk) return false;
        }

        if (strategy && strategy !== '') {
          if (!e.strategies?.includes(strategy)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortKey === 'performance') {
          return sortOrder === 'asc'
            ? a.performance - b.performance
            : b.performance - a.performance;
        }
        if (sortKey === 'price') {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        }
        return 0;
      });
  }, [appliedFilters, sortKey, sortOrder]);

  return (
    <div className="etf-manager-wrapper">
      <div className="etf-manager-container">
        {/* Colonne Filtres */}
        <div className="filters-column">
          <div className="filters-header-bar">
            <h3>Filtres ETF</h3>
            <button
              className="btn-advanced-filters"
              onClick={() => navigate('/filtres-advanced')}
              aria-label="Accéder aux filtres avancés"
            >
              Filtres avancés
            </button>
          </div>
          <ETFFilters
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
            onApply={applyFilters}
            onChangeSort={onChangeSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          />
        </div>

        {/* Colonne Tableau */}
        <div className="table-column">
  <div className="table-header-bar">
    <h3>Liste des ETFs filtrés</h3>
  </div>
  <div className="etf-table-wrapper">
    <ETFTable
      etfs={filteredEtfs}
      sortKey={sortKey}
      sortOrder={sortOrder}
      onSelectETF={onSelectETF}
    />
  </div>
  
</div>

      </div>
    </div>
  );
}
