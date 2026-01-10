'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

/**
 * Temas soportados por la aplicación.
 */
export type Theme = 'light' | 'dark';

/**
 * Contrato del contexto de tema.
 */
interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Proveedor global del tema de la aplicación.
 *
 * - Controla dark / light mode
 * - Aplica la clase `dark` al HTML
 * - Persiste la preferencia del usuario
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  /**
   * Aplica el tema al elemento HTML.
   */
  const applyTheme = (value: Theme) => {
    const root = document.documentElement;

    if (value === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  /**
   * Cambia el tema y lo persiste.
   */
  const setTheme = (value: Theme) => {
    setThemeState(value);
    localStorage.setItem('theme', value);
    applyTheme(value);
  };

  /**
   * Alterna entre light y dark.
   */
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  /**
   * Inicializa el tema desde localStorage.
   */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      applyTheme('light');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para consumir el ThemeContext.
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }

  return context;
}
