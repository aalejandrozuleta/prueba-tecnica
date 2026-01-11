'use client';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { getConfigTexts } from '@/libs/i18n';
import { Button } from '@/components/atom/Button';

/**
 * Navbar principal del dashboard.
 *
 * Permite:
 * - Cambiar idioma
 * - Cambiar tema (light / dark)
 */
export function DashboardNavbar() {
  const { theme, setDark, setLight } = useTheme();
  const { language, setSpanish, setEnglish } = useLanguage();

  const texts = getConfigTexts(language);

  return (
    <nav
      className="
        flex items-center justify-between
        border-b border-gray-200
        bg-white px-6 py-3
        dark:border-gray-800
        dark:bg-gray-950
      "
    >
      {/* Logo / Title */}
      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Dashboard</div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Language switch */}
        <div className="flex gap-1">
          <Button variant={language === 'es' ? 'primary' : 'secondary'} onClick={setSpanish}>
            ES
          </Button>

          <Button variant={language === 'en' ? 'primary' : 'secondary'} onClick={setEnglish}>
            EN
          </Button>
        </div>

        {/* Theme switch */}
        <div className="flex gap-1">
          <Button variant={theme === 'light' ? 'primary' : 'secondary'} onClick={setLight}>
            {texts.light}
          </Button>

          <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={setDark}>
            {texts.dark}
          </Button>
        </div>
      </div>
    </nav>
  );
}
