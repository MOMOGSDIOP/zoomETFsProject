import React, { createContext, useState } from 'react';

export const QuadrantContext = createContext();

export function QuadrantProvider({ children }) {
  const [layout, setLayout] = useState({
    expanded: null,
    hidden: []
  });

  const handleExpand = (quadrant) => {
    setLayout(prev => ({
      expanded: prev.expanded === quadrant ? null : quadrant,
      hidden: prev.hidden
    }));
  };

  const handleHide = (quadrant) => {
    setLayout(prev => ({
      expanded: null,
      hidden: prev.hidden.includes(quadrant)
        ? prev.hidden.filter(q => q !== quadrant)
        : [...prev.hidden, quadrant]
    }));
  };

  return (
    <QuadrantContext.Provider value={{ layout, handleExpand, handleHide }}>
      {children}
    </QuadrantContext.Provider>
  );
}