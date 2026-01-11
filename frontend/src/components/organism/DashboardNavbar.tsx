'use client';

import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { getConfigTexts } from '@/libs/i18n';
import { Button } from '@/components/atom/Button';
import { useDebtStats } from '@/hooks/useDebtStats';
import { getDebtStatsTexts } from '@/libs/i18n';

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
  const { data, loading } = useDebtStats();

  const texts = getConfigTexts(language);
  const statsTexts = getDebtStatsTexts(language);

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

      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
        {statsTexts.statistics}

        <span className="ml-2 text-xs font-normal text-gray-500">
          {loading && statsTexts.loading}

          {!loading && data && (
            <>
              {statsTexts.totalDebts}: {data.data.totalDebts} · {statsTexts.paidDebts}: {data.data.totalPaidDebts} ·{' '}
              {statsTexts.pendingDebts}: {data.data.totalPendingDebts} · {statsTexts.totalAmount}: $
              {data.data.totalDebtAmount}
            </>
          )}
        </span>
      </div>

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
