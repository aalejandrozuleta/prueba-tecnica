'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setLight: () => void;
  setDark: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  /**
   * Aplica el tema al elemento <html>.
   */
  const applyTheme = (value: Theme) => {
    const html = document.documentElement;

    if (value === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    localStorage.setItem('theme', value);
    setTheme(value);
  };

  /**
   * Inicializa el tema desde localStorage.
   */
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;

    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored);
    } else {
      applyTheme('dark'); // default
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setLight: () => applyTheme('light'),
        setDark: () => applyTheme('dark'),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }

  return context;
}
