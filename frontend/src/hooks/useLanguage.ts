import { useEffect } from 'react';
import { useLanguageContext } from '@/context/LanguageContext';
import { languageStore } from '@/stores/language.store';

/**
 * Hook público de idioma.
 * Mantiene compatibilidad total con el código existente.
 */
export function useLanguage() {
  const { language, setLanguage } = useLanguageContext();

  /**
   * Sincroniza el idioma actual con el store global
   * para que HttpClient pueda leerlo.
   */
  useEffect(() => {
    languageStore.set(language);
  }, [language]);

  return {
    language,
    isSpanish: language === 'es',
    isEnglish: language === 'en',
    setSpanish: () => setLanguage('es'),
    setEnglish: () => setLanguage('en'),
  };
}
