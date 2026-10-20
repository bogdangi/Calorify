import { describe, it, expect } from 'vitest';
import i18n from '../i18n';

describe('Internationalization (i18n)', () => {
  it('defaults to German and provides expected translations', async () => {
    await i18n.changeLanguage('de');
    expect(i18n.t('nav.today')).toBe('Heute');
    expect(i18n.t('mealTypes.breakfast')).toBe('Frühstück');
    expect(i18n.t('mealTypes.lunch')).toBe('Mittagessen');
    expect(i18n.t('mealTypes.dinner')).toBe('Abendessen');
  });

  it('switches to Ukrainian immediately', async () => {
    await i18n.changeLanguage('uk');
    expect(i18n.t('nav.today')).toBe('Сьогодні');
    expect(i18n.t('mealTypes.breakfast')).toBe('Сніданок');
    expect(i18n.t('mealTypes.lunch')).toBe('Обід');
    expect(i18n.t('mealTypes.dinner')).toBe('Вечеря');
  });

  it('falls back to German for missing keys or unsupported locale', async () => {
    await i18n.changeLanguage('fr'); // Not configured
    expect(i18n.t('nav.today')).toBe('Heute');
  });
});
