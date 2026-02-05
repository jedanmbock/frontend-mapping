'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // On initialise 'light' par défaut pour le serveur
  const [theme, setTheme] = useState<string>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Récupération sécurisée côté client uniquement
    const storedTheme = localStorage.getItem('theme') || 'light';
    setTheme(storedTheme);
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  // CORRECTION : On retourne TOUJOURS le Provider.
  // On utilise 'mounted' seulement pour éviter le flash de contenu incorrect si nécessaire,
  // mais ici on laisse le rendu se faire pour éviter le blocage.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* 
         Pour éviter les erreurs d'hydratation sur le style, on peut rendre 
         le contenu invisible jusqu'au montage, ou simplement rendre children.
         Ici, on rend children directement pour que les hooks fonctionnent.
      */}
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
