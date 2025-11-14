import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // État de connexion (true si token trouvé, false sinon)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Au chargement du composant, vérifier la présence du token dans localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // Fonction de connexion : stocker token + mettre isLoggedIn à true
  const login = (token) => {
    localStorage.setItem('auth_token', token);
    setIsLoggedIn(true);
  };

  // Fonction de déconnexion : supprimer token + mettre isLoggedIn à false
  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
