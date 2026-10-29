import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload, ShieldCheck, Cpu, Globe, Target, Info, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { mealRepository } from '../db/repositories/mealRepository';
import { weightRepository } from '../db/repositories/weightRepository';
import { modelRegistry } from '../ml/core/registry';
import { validateExportJson } from '../utils/validation';
import { calculateCalorieRecommendation, MIN_DAILY_KCAL } from '../utils/calculations';
import { formatCalories } from '../utils/formatters';
import type { ExportDataV1 } from '../types/export';
import type { ActivityLevel, AppLanguage, UserSettings } from '../types/settings';

const ACTIVITY_LEVELS: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'very', 'extreme'];

const NUMBER_FIELDS = [
  { key: 'age', labelKey: 'settings.calculator.age', min: 1, max: 120, step: 1 },
  { key: 'heightCm', labelKey: 'settings.calculator.height', min: 50, max: 250, step: 1 },
  { key: 'weightKg', labelKey: 'settings.calculator.weight', min: 20, max: 400, step: 0.1 },
] as const;

type NumberFieldKey = (typeof NUMBER_FIELDS)[number]['key'];

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings, updateSettings } = useSettings();

  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = {
    sex: settings.sex ?? null,
    age: settings.age ?? null,
    heightCm: settings.heightCm ?? null,
    weightKg: settings.weightKg ?? null,
    activityLevel: settings.activityLevel ?? null,
  };
  const recommendation = calculateCalorieRecommendation(profile);

  const saveProfile = async (updates: Partial<UserSettings>) => {
    const rec = calculateCalorieRecommendation({ ...profile, ...updates });
    await updateSettings(rec ? { ...updates, dailyCalorieGoal: rec.target } : updates);
  };

  const setNumberField = (field: NumberFieldKey, value: number | null): Partial<UserSettings> =>
    field === 'age' ? { age: value } : field === 'heightCm' ? { heightCm: value } : { weightKg: value };

  const handleNumberBlur =
    (field: NumberFieldKey, min: number, max: number) => async (e: React.FocusEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const val = raw === '' ? null : Number(raw);
      const valid = val === null || (isFinite(val) && val >= min && val <= max);
      if (!valid) e.target.value = '';
      await saveProfile(setNumberField(field, valid ? val : null));
    };

  const handleGoalBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val > 500 && val < 15000) {
      await updateSettings({ dailyCalorieGoal: val });
    } else {
      e.target.value = String(settings.dailyCalorieGoal || 2000);
    }
  };

  const models = modelRegistry.getAll();

  const handleLanguageChange = async (newLang: AppLanguage) => {
    await updateSettings({ language: newLang });
  };

  const handleModelChange = async (modelId: string) => {
    await updateSettings({ selectedModelId: modelId });
  };

  const handleExportData = async () => {
    try {
      const allMeals = await mealRepository.getAll();
      const allWeights = await weightRepository.getAll();

      const exportPayload: ExportDataV1 = {
        version: 1,
        exportedAt: new Date().toISOString(),
        meals: allMeals,
        weights: allWeights,
        settings: {
          language: settings.language,
          dailyCalorieGoal: settings.dailyCalorieGoal,
          selectedModelId: settings.selectedModelId,
          sex: settings.sex,
          age: settings.age,
          heightCm: settings.heightCm,
          weightKg: settings.weightKg,
          activityLevel: settings.activityLevel,
        },
      };

      const jsonStr = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `calorify_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setFeedbackMessage({
        type: 'success',
        text: t('settings.exportSuccess'),
      });
    } catch (err) {
      console.error('Export error:', err);
      setFeedbackMessage({
        type: 'error',
        text: 'Export failed',
      });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const validation = validateExportJson(content);
      if (!validation.valid) {
        setFeedbackMessage({
          type: 'error',
          text: t('settings.importError', { error: validation.error }),
        });
        return;
      }

      if (window.confirm(t('settings.importConfirmMessage'))) {
        try {
          const { meals, weights, settings: importedSettings } = validation.data;

          if (meals.length > 0) {
            await mealRepository.bulkAdd(meals);
          }
          if (weights.length > 0) {
            await weightRepository.bulkAdd(weights);
          }
          if (importedSettings && typeof importedSettings === 'object') {
            await updateSettings(importedSettings);
          }

          setFeedbackMessage({
            type: 'success',
            text: t('settings.importSuccess', {
              meals: meals.length,
              weights: weights.length,
            }),
          });
        } catch (err) {
          console.error('Import save error:', err);
          setFeedbackMessage({
            type: 'error',
            text: t('settings.importError', { error: 'Database write failed' }),
          });
        }
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="main-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('settings.title')}</h2>

      {/* Feedback banner */}
      {feedbackMessage && (
        <div
          style={{
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background:
              feedbackMessage.type === 'success'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${
              feedbackMessage.type === 'success'
                ? 'rgba(16, 185, 129, 0.3)'
                : 'rgba(239, 68, 68, 0.3)'
            }`,
            color: feedbackMessage.type === 'success' ? '#6ee7b7' : '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.85rem',
          }}
        >
          {feedbackMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* General Settings */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe size={18} color="var(--accent-primary)" />
          {t('settings.general')}
        </h3>

        {/* Language selector */}
        <div className="form-group">
          <label className="form-label">{t('settings.language')}</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button
              type="button"
              className={`btn ${settings.language === 'de' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 14px' }}
              onClick={() => handleLanguageChange('de')}
            >
              Deutsch (de)
            </button>
            <button
              type="button"
              className={`btn ${settings.language === 'uk' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '10px 14px' }}
              onClick={() => handleLanguageChange('uk')}
            >
              Українська (uk)
            </button>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="form-group">
          <label className="form-label" htmlFor="goal-input" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={15} />
            {t('settings.calorieGoal')}
          </label>
          <input
            key={`goal-${settings.dailyCalorieGoal}`}
            id="goal-input"
            type="number"
            className="form-input"
            min="800"
            max="10000"
            step="50"
            defaultValue={settings.dailyCalorieGoal || 2000}
            onBlur={handleGoalBlur}
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {t('settings.calorieGoalHelp')}
          </span>
        </div>
      </div>

      {/* Calorie Calculator (US-1) */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calculator size={18} color="var(--accent-warning)" />
          {t('settings.calculator.title')}
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {t('settings.calculator.description')}
        </p>

        {/* Biological sex */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label">{t('settings.calculator.sex')}</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {(['male', 'female'] as const).map((sex) => (
              <button
                key={sex}
                type="button"
                className={`btn ${profile.sex === sex ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '10px 14px' }}
                onClick={() => saveProfile({ sex })}
              >
                {t(`settings.calculator.${sex}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Age / Height / Weight */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {NUMBER_FIELDS.map((field) => (
            <div className="form-group" key={field.key} style={{ margin: 0 }}>
              <label className="form-label" htmlFor={`calc-${field.key}`}>
                {t(field.labelKey)}
              </label>
              <input
                key={`${field.key}-${settings[field.key] ?? 'na'}`}
                id={`calc-${field.key}`}
                type="number"
                className="form-input"
                min={field.min}
                max={field.max}
                step={field.step}
                defaultValue={settings[field.key] ?? ''}
                onBlur={handleNumberBlur(field.key, field.min, field.max)}
              />
            </div>
          ))}
        </div>

        {/* Activity level */}
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="calc-activity">
            {t('settings.calculator.activity')}
          </label>
          <select
            id="calc-activity"
            className="form-input"
            value={settings.activityLevel ?? ''}
            onChange={(e) => saveProfile({ activityLevel: e.target.value as ActivityLevel })}
          >
            <option value="" disabled>
              {t('settings.calculator.activityPlaceholder')}
            </option>
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level} value={level}>
                {t(`settings.calculator.levels.${level}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Result */}
        {recommendation ? (
          <div
            style={{
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 14,
              background: 'rgba(16, 185, 129, 0.08)',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('settings.calculator.yourTarget')}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1.2 }}>
              {formatCalories(recommendation.target, i18n.language)}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '8px 0 0' }}>
              {t('settings.calculator.explanation')}
            </p>
            {recommendation.floored && profile.sex && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginTop: 10,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fcd34d',
                  fontSize: '0.78rem',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{t('settings.calculator.safetyNotice', { min: MIN_DAILY_KCAL[profile.sex] })}</span>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            {t('settings.calculator.completeProfile')}
          </p>
        )}
      </div>

      {/* On-Device ML Model Selection */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cpu size={18} color="var(--accent-secondary)" />
          {t('settings.modelSelection')}
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {t('settings.modelHelp')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {models.map((model) => {
            const isSelected = settings.selectedModelId === model.id;
            return (
              <div
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                style={{
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{model.name}</div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.1)',
                      color: isSelected ? '#000' : 'var(--text-muted)',
                    }}
                  >
                    {model.runtime.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {model.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup & Restore (Local JSON) */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={18} color="var(--accent-warning)" />
          {t('settings.backupTitle')}
        </h3>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {t('settings.backupDescription')}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />

        <div className="action-grid">
          <button type="button" className="btn btn-secondary" onClick={handleExportData}>
            <Download size={16} />
            <span>{t('settings.exportButton')}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            <span>{t('settings.importButton')}</span>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={18} color="var(--accent-primary)" />
          {t('settings.privacyTitle')}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {t('settings.privacyDescription')}
        </p>
      </div>

      {/* App Info */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: 'var(--text-secondary)' }}>
          <Info size={14} />
          {t('settings.appInfoTitle')}
        </div>
        <div>
          {t('settings.version')}: 1.0.0
        </div>
        <div>{t('settings.buildType')}</div>
      </div>
    </div>
  );
};
