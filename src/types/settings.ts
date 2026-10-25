export type AppLanguage = 'de' | 'uk';
export type BiologicalSex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extreme';

export interface UserSettings {
  id: 'current_settings';
  language: AppLanguage;
  dailyCalorieGoal: number;
  selectedModelId: string;
  theme: 'dark' | 'light' | 'system';
  // Calorie calculator profile (US-1). null = not entered yet.
  sex: BiologicalSex | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: ActivityLevel | null;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'current_settings',
  language: 'de',
  dailyCalorieGoal: 2000,
  selectedModelId: 'food-classifier-mock',
  theme: 'dark',
  sex: null,
  age: null,
  heightCm: null,
  weightKg: null,
  activityLevel: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
