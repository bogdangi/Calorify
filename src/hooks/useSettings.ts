import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTranslation } from 'react-i18next';
import { settingsRepository } from '../db/repositories/settingsRepository';
import { DEFAULT_SETTINGS, type UserSettings } from '../types/settings';

export function useSettings() {
  const { i18n } = useTranslation();
  const settings = useLiveQuery(
    async () => {
      return settingsRepository.getSettings();
    },
    [],
    DEFAULT_SETTINGS
  );

  // Sync i18n when language in settings changes
  useEffect(() => {
    if (settings?.language && settings.language !== i18n.language) {
      i18n.changeLanguage(settings.language);
      localStorage.setItem('calorify_language', settings.language);
    }
  }, [settings?.language, i18n]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    const updated = await settingsRepository.saveSettings(updates);
    if (updates.language) {
      await i18n.changeLanguage(updates.language);
      localStorage.setItem('calorify_language', updates.language);
    }
    return updated;
  };

  return {
    settings: settings || DEFAULT_SETTINGS,
    updateSettings,
  };
}
