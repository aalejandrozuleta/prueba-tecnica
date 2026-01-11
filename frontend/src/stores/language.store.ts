/**
 * Store simple para manejar el idioma actual
 * sin depender de React.
 */

let currentLanguage = 'es';

export const languageStore = {
  get(): string {
    return currentLanguage;
  },

  set(language: string) {
    currentLanguage = language;
  },
};
