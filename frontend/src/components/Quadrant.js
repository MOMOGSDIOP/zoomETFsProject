import React, { useContext } from 'react';
import { QuadrantContext } from '../context/QuadrantContext';
import TopLeftQuadrant from './quadrants/TopLeftQuadrant';
import TopRightQuadrant from './quadrants/TopRightQuadrant';
import BottomLeftQuadrant from './quadrants/BottomLeftQuadrant';
import BottomRightQuadrant from './quadrants/BottomRightQuadrant';

const Quadrant = ({ position }) => {
  const { layout, handleExpand, handleHide } = useContext(QuadrantContext);
  const isExpanded = layout.expanded === position;
  const isHidden = layout.hidden.includes(position);

  if (isHidden) return null;

  return (
    <div className={`quadrant ${position} ${isExpanded ? 'expanded' : ''}`}>
      <div className="quadrant-controls">
        <button onClick={() => handleHide(position)}>−</button>
        <button onClick={() => handleExpand(position)}>🗖</button>
      </div>
      {renderQuadrantContent(position)}
    </div>
  );
};

const renderQuadrantContent = (position) => {
  switch(position) {
    case 'topLeft': return <TopLeftQuadrant />;
    case 'topRight': return <TopRightQuadrant />;
    case 'bottomLeft': return <BottomLeftQuadrant />;
    case 'bottomRight': return <BottomRightQuadrant />;
    default: return null;
  }
};

export default Quadrant;