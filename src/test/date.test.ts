import { describe, it, expect } from 'vitest';
import { getLocalDateString, parseLocalDate, addDaysToDateString, getDateRangeArray } from '../utils/date';

describe('Date Utilities (Timezone Safety)', () => {
  it('formats dates into local YYYY-MM-DD format', () => {
    const fixedDate = new Date(2026, 9, 20, 23, 45); // Month is 0-indexed (9 = Oct)
    const str = getLocalDateString(fixedDate);
    expect(str).toBe('2026-10-20');
  });

  it('parses YYYY-MM-DD into a midday Date without day shifts', () => {
    const parsed = parseLocalDate('2026-10-20');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(9);
    expect(parsed.getDate()).toBe(20);
  });

  it('adds and subtracts days without timezone or month-end drift', () => {
    expect(addDaysToDateString('2026-10-20', 1)).toBe('2026-10-21');
    expect(addDaysToDateString('2026-10-20', -1)).toBe('2026-10-19');
    expect(addDaysToDateString('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDaysToDateString('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('generates date range array for past N days', () => {
    const range = getDateRangeArray('2026-10-20', 3);
    expect(range).toEqual(['2026-10-18', '2026-10-19', '2026-10-20']);
  });
});
