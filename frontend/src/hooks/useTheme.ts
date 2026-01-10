import { useThemeContext } from '@/context/ThemeContext';

/**
 * Hook público para interactuar con el tema de la aplicación.
 */
export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeContext();

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setLight: () => setTheme('light'),
    setDark: () => setTheme('dark'),
  };
}
