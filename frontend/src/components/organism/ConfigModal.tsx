'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/atom/Button';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage as useLangHook } from '@/hooks/useLanguage';
import { getConfigTexts } from '@/libs/i18n';

/**
 * Modal de configuración inicial.
 *
 * Se muestra SOLO si el usuario no tiene
 * idioma o tema configurados previamente.
 */
export function ConfigModal() {
const { theme, setLight, setDark } = useTheme();
  const { language, setSpanish, setEnglish } = useLangHook();

  const texts = getConfigTexts(language);

  const [isOpen, setIsOpen] = useState(false);

  /**
   * Verifica si el usuario ya tiene configuración guardada.
   */
  useEffect(() => {
    const hasTheme = Boolean(localStorage.getItem('theme'));
    const hasLanguage = Boolean(localStorage.getItem('language'));

    if (!hasTheme || !hasLanguage) {
      setIsOpen(true);
    }
  }, []);

  /**
   * Guarda configuración y cierra el modal.
   */
  const handleSave = () => {
    setIsOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title={texts.title}>
      <div className="flex flex-col gap-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {texts.subtitle}
        </p>

        {/* Idioma */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {texts.language}
          </span>

          <div className="flex gap-2">
            <Button
              variant={language === 'es' ? 'primary' : 'secondary'}
              onClick={setSpanish}
            >
              Español
            </Button>

            <Button
              variant={language === 'en' ? 'primary' : 'secondary'}
              onClick={setEnglish}
            >
              English
            </Button>
          </div>
        </div>

        {/* Tema */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {texts.theme}
          </span>

          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              onClick={setLight}
            >
              {texts.light}
            </Button>

            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={setDark}
            >
              {texts.dark}
            </Button>
          </div>
        </div>

        <Button onClick={handleSave}>
          {texts.save}
        </Button>
      </div>
    </Modal>
  );
}
