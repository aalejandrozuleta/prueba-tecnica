import { useLanguageContext } from '@/context/LanguageContext';

/**
 * Hook público de idioma.
 */
export function useLanguage() {
  const { language, setLanguage } = useLanguageContext();

  return {
    language,
    isSpanish: language === 'es',
    isEnglish: language === 'en',
    setSpanish: () => setLanguage('es'),
    setEnglish: () => setLanguage('en'),
  };
}
