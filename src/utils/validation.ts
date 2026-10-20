import type { ExportDataV1 } from '../types/export';
import type { MealEntry } from '../types/meal';
import type { WeightEntry } from '../types/weight';

export interface ValidationSuccess {
  valid: true;
  data: ExportDataV1;
}

export interface ValidationFailure {
  valid: false;
  error: string;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export function isValidDateString(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(str);
}

export function isValidTimeString(str: unknown): boolean {
  if (typeof str !== 'string') return false;
  return /^\d{2}:\d{2}$/.test(str);
}

export function validateMealEntry(entry: unknown): entry is MealEntry {
  if (!entry || typeof entry !== 'object') return false;
  const m = entry as Record<string, unknown>;

  if (typeof m.id !== 'string' || m.id.trim() === '') return false;
  if (!isValidDateString(m.date)) return false;
  if (typeof m.name !== 'string' || m.name.trim() === '') return false;
  if (typeof m.calories !== 'number' || isNaN(m.calories) || m.calories < 0) return false;

  return true;
}

export function validateWeightEntry(entry: unknown): entry is WeightEntry {
  if (!entry || typeof entry !== 'object') return false;
  const w = entry as Record<string, unknown>;

  if (typeof w.id !== 'string' || w.id.trim() === '') return false;
  if (!isValidDateString(w.date)) return false;
  if (typeof w.weightKg !== 'number' || isNaN(w.weightKg) || w.weightKg <= 0 || w.weightKg > 600) {
    return false;
  }

  return true;
}

export function validateExportJson(jsonString: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { valid: false, error: 'invalid_json_format' };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { valid: false, error: 'invalid_root_object' };
  }

  const obj = parsed as Record<string, unknown>;

  if (obj.version !== 1) {
    return { valid: false, error: 'unsupported_version' };
  }

  if (!Array.isArray(obj.meals)) {
    return { valid: false, error: 'invalid_meals_array' };
  }

  for (let i = 0; i < obj.meals.length; i++) {
    if (!validateMealEntry(obj.meals[i])) {
      return { valid: false, error: `invalid_meal_entry_at_index_${i}` };
    }
  }

  if (!Array.isArray(obj.weights)) {
    return { valid: false, error: 'invalid_weights_array' };
  }

  for (let i = 0; i < obj.weights.length; i++) {
    if (!validateWeightEntry(obj.weights[i])) {
      return { valid: false, error: `invalid_weight_entry_at_index_${i}` };
    }
  }

  const validatedData: ExportDataV1 = {
    version: 1,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
    meals: obj.meals as MealEntry[],
    weights: obj.weights as WeightEntry[],
    settings: (obj.settings && typeof obj.settings === 'object' ? obj.settings : {}) as ExportDataV1['settings'],
  };

  return { valid: true, data: validatedData };
}
