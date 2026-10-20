import { parseLocalDate } from './date';

/**
 * Normalizes app language ('de' | 'uk') into a full BCP 47 locale tag.
 */
export function getLocaleTag(language: string = 'de'): string {
  if (language === 'uk') return 'uk-UA';
  return 'de-DE';
}

/**
 * Formats a YYYY-MM-DD date string using Intl.DateTimeFormat.
 */
export function formatLocalDateString(
  dateString: string,
  language: string = 'de',
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' }
): string {
  try {
    const date = parseLocalDate(dateString);
    const locale = getLocaleTag(language);
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Formats a number with locale decimal / grouping separators.
 */
export function formatNumber(
  value: number,
  language: string = 'de',
  options: Intl.NumberFormatOptions = {}
): string {
  try {
    const locale = getLocaleTag(language);
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
}

/**
 * Formats calorie value (e.g. "1.240 kcal" or "1 240 ккал").
 */
export function formatCalories(value: number, language: string = 'de'): string {
  const formattedNum = formatNumber(Math.round(value), language);
  const unit = language === 'uk' ? 'ккал' : 'kcal';
  return `${formattedNum} ${unit}`;
}

/**
 * Formats weight in kilograms (e.g. "72,5 kg" or "72,5 кг").
 */
export function formatWeight(weightKg: number, language: string = 'de'): string {
  const formattedNum = formatNumber(weightKg, language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const unit = language === 'uk' ? 'кг' : 'kg';
  return `${formattedNum} ${unit}`;
}

/**
 * Formats confidence percentage (e.g. "82%").
 */
export function formatConfidence(ratio: number, _language: string = 'de'): string {
  const percent = Math.round(ratio <= 1 ? ratio * 100 : ratio);
  return `${percent}%`;
}
