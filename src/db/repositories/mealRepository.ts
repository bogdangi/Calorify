import type { Table } from 'dexie';
import type { MealEntry } from '../../types/meal';
import { db, CalorifyDatabase } from '../indexeddb/db';

export class MealRepository {
  private table: Table<MealEntry, string>;

  constructor(database: CalorifyDatabase = db) {
    this.table = database.meals;
  }

  async getAll(): Promise<MealEntry[]> {
    return this.table.toArray();
  }

  async getByDate(date: string): Promise<MealEntry[]> {
    return this.table.where('date').equals(date).sortBy('time');
  }

  async getByDateRange(startDate: string, endDate: string): Promise<MealEntry[]> {
    return this.table
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  async getById(id: string): Promise<MealEntry | undefined> {
    return this.table.get(id);
  }

  async create(data: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<MealEntry> {
    const now = new Date().toISOString();
    const entry: MealEntry = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await this.table.put(entry);
    return entry;
  }

  async update(id: string, updates: Partial<MealEntry>): Promise<MealEntry> {
    const existing = await this.table.get(id);
    if (!existing) {
      throw new Error(`Meal with id ${id} not found`);
    }
    const updated: MealEntry = {
      ...existing,
      ...updates,
      id, // Preserve ID
      updatedAt: new Date().toISOString(),
    };
    await this.table.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.table.delete(id);
  }

  async bulkAdd(entries: MealEntry[]): Promise<void> {
    await this.table.bulkPut(entries);
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }
}

export const mealRepository = new MealRepository();
