import React from 'react';
import { useQuadrantContext } from '../context/QuadrantContext'; // Utilisation du hook personnalisé
import TopLeftQuadrant from './quadrants/TopLeftQuadrant';
import TopRightQuadrant from './quadrants/TopRightQuadrant';
import BottomLeftQuadrant from './quadrants/BottomLeftQuadrant';
import BottomRightQuadrant from './quadrants/BottomRightQuadrant';

const components = {
  topLeft: TopLeftQuadrant,
  topRight: TopRightQuadrant,
  bottomLeft: BottomLeftQuadrant,
  bottomRight: BottomRightQuadrant
};

export default function QuadrantWrapper({ position }) {
  const { layout, expandQuadrant, minimizeQuadrant } = useQuadrantContext();
  const QuadrantComponent = components[position];
  const isExpanded = layout.mode === 'expanded' && layout.expandedQuadrant === position;
  const isMinimized = layout.mode === `${position}Minimized`;

  if (isMinimized) return null;

  return (
    <div className={`quadrant ${position.replace(/([A-Z])/g, '-$1').toLowerCase()} ${isExpanded ? 'expanded' : ''}`}>
      <div className="quadrant-controls">
        <button onClick={() => minimizeQuadrant(position)}>−</button>
        <button onClick={() => expandQuadrant(position)}>🗖</button>
      </div>
      <QuadrantComponent />
    </div>
  );
}