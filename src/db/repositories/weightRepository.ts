import type { Table } from 'dexie';
import type { WeightEntry } from '../../types/weight';
import { db, CalorifyDatabase } from '../indexeddb/db';

export class WeightRepository {
  private table: Table<WeightEntry, string>;

  constructor(database: CalorifyDatabase = db) {
    this.table = database.weights;
  }

  async getAll(): Promise<WeightEntry[]> {
    return this.table.orderBy('date').toArray();
  }

  async getByDate(date: string): Promise<WeightEntry | undefined> {
    return this.table.where('date').equals(date).first();
  }

  async getLatest(): Promise<WeightEntry | undefined> {
    return this.table.orderBy('date').reverse().first();
  }

  async create(data: Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<WeightEntry> {
    const now = new Date().toISOString();
    const entry: WeightEntry = {
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await this.table.put(entry);
    return entry;
  }

  async update(id: string, updates: Partial<WeightEntry>): Promise<WeightEntry> {
    const existing = await this.table.get(id);
    if (!existing) {
      throw new Error(`Weight entry with id ${id} not found`);
    }
    const updated: WeightEntry = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    await this.table.put(updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.table.delete(id);
  }

  async bulkAdd(entries: WeightEntry[]): Promise<void> {
    await this.table.bulkPut(entries);
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }
}

export const weightRepository = new WeightRepository();
