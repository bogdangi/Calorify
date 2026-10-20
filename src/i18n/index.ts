import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { de } from './locales/de';
import { uk } from './locales/uk';

export const defaultNS = 'translation';
export const resources = {
  de,
  uk,
} as const;

export function getInitialLanguage(): 'de' | 'uk' {
  if (
    typeof window !== 'undefined' &&
    typeof localStorage !== 'undefined' &&
    typeof localStorage.getItem === 'function'
  ) {
    try {
      const saved = localStorage.getItem('calorify_language');
      if (saved === 'uk' || saved === 'de') {
        return saved;
      }
    } catch {
      // Ignore storage access errors
    }
  }
  if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('uk')) {
    return 'uk';
  }
  return 'de';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'de',
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
