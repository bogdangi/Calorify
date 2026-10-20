import { describe, it, expect } from 'vitest';
import { validateExportJson, validateMealEntry, validateWeightEntry } from '../utils/validation';

describe('Validation: JSON Backup and Schema Integrity', () => {
  it('accepts valid export payload', () => {
    const validJson = JSON.stringify({
      version: 1,
      exportedAt: '2026-10-20T12:00:00Z',
      meals: [
        {
          id: 'meal-1',
          date: '2026-10-20',
          time: '12:30',
          name: 'Chicken and Rice',
          calories: 550,
          source: 'manual',
          createdAt: '2026-10-20T12:30:00Z',
          updatedAt: '2026-10-20T12:30:00Z',
        },
      ],
      weights: [
        {
          id: 'weight-1',
          date: '2026-10-20',
          weightKg: 73.5,
          createdAt: '2026-10-20T08:00:00Z',
          updatedAt: '2026-10-20T08:00:00Z',
        },
      ],
      settings: {
        language: 'de',
        dailyCalorieGoal: 2000,
      },
    });

    const result = validateExportJson(validJson);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.meals.length).toBe(1);
      expect(validateMealEntry(result.data.meals[0])).toBe(true);
      expect(result.data.weights.length).toBe(1);
      expect(validateWeightEntry(result.data.weights[0])).toBe(true);
      expect(result.data.settings.language).toBe('de');
    }
  });

  it('rejects invalid JSON syntax', () => {
    const corruptJson = '{"version": 1, invalid}';
    const result = validateExportJson(corruptJson);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('invalid_json_format');
    }
  });

  it('rejects unsupported versions', () => {
    const wrongVersion = JSON.stringify({
      version: 99,
      meals: [],
      weights: [],
    });
    const result = validateExportJson(wrongVersion);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('unsupported_version');
    }
  });

  it('rejects malformed meal entries', () => {
    const invalidMealJson = JSON.stringify({
      version: 1,
      meals: [
        {
          id: '',
          date: 'invalid-date',
          name: '',
          calories: -100, // Negative calories
        },
      ],
      weights: [],
    });
    const result = validateExportJson(invalidMealJson);
    expect(result.valid).toBe(false);
  });

  it('rejects malformed weight entries', () => {
    const invalidWeightJson = JSON.stringify({
      version: 1,
      meals: [],
      weights: [
        {
          id: 'w1',
          date: '2026-10-20',
          weightKg: -5, // Negative weight
        },
      ],
    });
    const result = validateExportJson(invalidWeightJson);
    expect(result.valid).toBe(false);
  });
});
