import React from 'react';

const SortArrow = ({ order }) => (
  <span style={{ fontSize: '1.2rem', marginLeft: 4 }}>
    {order === 'asc' ? '↑' : '↓'}
  </span>
);

export default function SortControls({ sortKey, sortOrder, onChangeSort }) {
  return (
    <div className="sort-controls">
      <span
        className={sortKey === 'performance' ? 'sort-active' : 'sort-inactive'}
        onClick={() => onChangeSort('performance')}
      >
        Trier par Performance {sortKey === 'performance' && <SortArrow order={sortOrder} />}
      </span>
      <span
        className={sortKey === 'price' ? 'sort-active' : 'sort-inactive'}
        onClick={() => onChangeSort('price')}
      >
        Trier par Prix {sortKey === 'price' && <SortArrow order={sortOrder} />}
      </span>
    </div>
  );
}
