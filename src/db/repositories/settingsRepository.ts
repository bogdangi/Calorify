import type { Table } from 'dexie';
import type { UserSettings } from '../../types/settings';
import { DEFAULT_SETTINGS } from '../../types/settings';
import { db, CalorifyDatabase } from '../indexeddb/db';

export class SettingsRepository {
  private table: Table<UserSettings, string>;

  constructor(database: CalorifyDatabase = db) {
    this.table = database.settings;
  }

  private buildInitialSettings(): UserSettings {
    // Determine initial language from navigator if available
    let browserLang: 'de' | 'uk' = 'de';
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.startsWith('uk')) {
        browserLang = 'uk';
      }
    }

    return {
      ...DEFAULT_SETTINGS,
      language: browserLang,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Read-only: safe to call from liveQuery. Does not persist.
  async getSettings(): Promise<UserSettings> {
    const existing = await this.table.get('current_settings');
    return existing ?? this.buildInitialSettings();
  }

  // Seeds the row on first run. Call once at app startup, outside liveQuery.
  async ensureSettings(): Promise<UserSettings> {
    const existing = await this.table.get('current_settings');
    if (existing) return existing;
    const initial = this.buildInitialSettings();
    await this.table.put(initial);
    return initial;
  }

  async saveSettings(updates: Partial<UserSettings>): Promise<UserSettings> {
    const existing = await this.getSettings();
    const updated: UserSettings = {
      ...existing,
      ...updates,
      id: 'current_settings',
      updatedAt: new Date().toISOString(),
    };
    await this.table.put(updated);
    return updated;
  }

  async clear(): Promise<void> {
    await this.table.clear();
  }
}

export const settingsRepository = new SettingsRepository();
