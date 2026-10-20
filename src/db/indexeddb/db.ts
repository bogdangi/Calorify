import Dexie, { type Table } from 'dexie';
import type { MealEntry } from '../../types/meal';
import type { WeightEntry } from '../../types/weight';
import type { UserSettings } from '../../types/settings';

export class CalorifyDatabase extends Dexie {
  meals!: Table<MealEntry, string>;
  weights!: Table<WeightEntry, string>;
  settings!: Table<UserSettings, string>;

  constructor(dbName = 'calorify_db') {
    super(dbName);
    this.version(1).stores({
      meals: 'id, date, mealType, source, createdAt',
      weights: 'id, date, createdAt',
      settings: 'id',
    });
  }
}

export const db = new CalorifyDatabase();
