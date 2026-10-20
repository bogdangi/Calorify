export type AppLanguage = 'de' | 'uk';

export interface UserSettings {
  id: 'current_settings';
  language: AppLanguage;
  dailyCalorieGoal: number;
  selectedModelId: string;
  theme: 'dark' | 'light' | 'system';
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  id: 'current_settings',
  language: 'de',
  dailyCalorieGoal: 2000,
  selectedModelId: 'food-classifier-mock',
  theme: 'dark',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
