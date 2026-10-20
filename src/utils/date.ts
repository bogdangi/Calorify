/**
 * Returns YYYY-MM-DD using the user's LOCAL calendar date, preventing UTC timezone shifts.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns HH:mm in local time.
 */
export function getLocalTimeString(d: Date = new Date()): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parses YYYY-MM-DD into a local Date object without UTC drift.
 */
export function parseLocalDate(dateString: string): Date {
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return new Date();
  }
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 12, 0, 0);
}

/**
 * Adds or subtracts days from a YYYY-MM-DD date string.
 */
export function addDaysToDateString(dateString: string, days: number): string {
  const d = parseLocalDate(dateString);
  d.setDate(d.getDate() + days);
  return getLocalDateString(d);
}

/**
 * Generates an array of date strings for the past N days ending at `endDateStr`.
 */
export function getDateRangeArray(endDateStr: string, count: number): string[] {
  const dates: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    dates.push(addDaysToDateString(endDateStr, -i));
  }
  return dates;
}

/**
 * Returns current ISO timestamp.
 */
export function getNowIsoString(): string {
  return new Date().toISOString();
}
