import type { MealEntry } from './meal';
import type { WeightEntry } from './weight';
import type { UserSettings } from './settings';

export interface ExportDataV1 {
  version: 1;
  exportedAt: string;
  meals: MealEntry[];
  weights: WeightEntry[];
  settings: Partial<UserSettings>;
}

export interface ImportResult {
  success: boolean;
  importedMealsCount: number;
  importedWeightsCount: number;
  error?: string;
}
