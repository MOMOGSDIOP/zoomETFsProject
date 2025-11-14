// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark'); // <-- thème sombre par défaut

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Applique automatiquement les variables CSS
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.style.setProperty('--background-color', '#121212');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--card-background', '#1e1e1e');
    } else {
      root.style.setProperty('--background-color', '#ffffff');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--card-background', '#f5f5f5');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
