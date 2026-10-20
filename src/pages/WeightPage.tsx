import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Scale, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useWeights } from '../hooks/useWeights';
import { WeightFormModal } from '../components/weight/WeightFormModal';
import { WeightLineChart } from '../components/charts/WeightLineChart';
import type { WeightEntry, WeightChartRange } from '../types/weight';
import { calculateWeightStats, filterWeightsByRange } from '../utils/calculations';
import { formatLocalDateString, formatWeight } from '../utils/formatters';

export const WeightPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { weights, addWeight, updateWeight, deleteWeight } = useWeights();

  const [range, setRange] = useState<WeightChartRange>('30d');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);

  const stats = calculateWeightStats(weights);
  const filteredWeights = filterWeightsByRange(weights, range);

  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = async (entry: WeightEntry) => {
    const formattedDate = formatLocalDateString(entry.date, i18n.language);
    const message = t('weight.deleteConfirmMessage', {
      date: formattedDate,
      weight: entry.weightKg,
    });

    if (window.confirm(message)) {
      await deleteWeight(entry.id);
    }
  };

  const renderTrendIcon = (change: number | null) => {
    if (change === null || change === 0) return <Minus size={16} color="var(--text-muted)" />;
    if (change < 0) return <TrendingDown size={16} color="var(--accent-primary)" />;
    return <TrendingUp size={16} color="var(--accent-warning)" />;
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('weight.title')}</h2>
        <button
          type="button"
          className="btn btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.85rem', minHeight: 'auto' }}
          onClick={() => {
            setEditingEntry(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          <span>{t('weight.addWeight')}</span>
        </button>
      </div>

      {/* Weight Summary Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {t('weight.currentWeight')}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
            {stats.currentWeight !== null ? formatWeight(stats.currentWeight, i18n.language) : '—'}
          </div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{t('weight.weightChange')}</span>
            {renderTrendIcon(stats.weightChange)}
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              marginTop: 2,
              color:
                stats.weightChange === null || stats.weightChange === 0
                  ? 'var(--text-primary)'
                  : stats.weightChange < 0
                  ? 'var(--accent-primary)'
                  : 'var(--accent-warning)',
            }}
          >
            {stats.weightChange !== null
              ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange} kg`
              : '—'}
          </div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {t('weight.startingWeight')}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 2 }}>
            {stats.startingWeight !== null ? formatWeight(stats.startingWeight, i18n.language) : '—'}
          </div>
        </div>

        <div className="card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {t('weight.averageWeight')}
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 2 }}>
            {stats.averageWeight !== null ? formatWeight(stats.averageWeight, i18n.language) : '—'}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {weights.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {t('weight.title')}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['7d', '30d', '3m', 'all'] as WeightChartRange[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: range === r ? 'var(--accent-secondary)' : 'rgba(255, 255, 255, 0.06)',
                    color: range === r ? '#000' : 'var(--text-secondary)',
                    fontWeight: range === r ? 700 : 500,
                    cursor: 'pointer',
                  }}
                  onClick={() => setRange(r)}
                >
                  {t(`weight.chartRanges.${r}`)}
                </button>
              ))}
            </div>
          </div>

          <WeightLineChart entries={filteredWeights} />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 8,
              marginTop: 4,
            }}
          >
            <span>
              {t('weight.minWeight')}: {stats.minWeight !== null ? formatWeight(stats.minWeight, i18n.language) : '—'}
            </span>
            <span>
              {t('weight.maxWeight')}: {stats.maxWeight !== null ? formatWeight(stats.maxWeight, i18n.language) : '—'}
            </span>
          </div>
        </div>
      )}

      {/* Weight History List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="meal-group-title">
          <span>{t('weight.title')}</span>
          <span>{weights.length}</span>
        </div>

        {weights.length === 0 ? (
          <div className="empty-state">
            <Scale className="empty-icon" />
            <p style={{ fontWeight: 600 }}>{t('weight.noEntries')}</p>
            <p style={{ fontSize: '0.85rem', maxWidth: 300 }}>{t('weight.noEntriesPrompt')}</p>
          </div>
        ) : (
          [...weights].reverse().map((entry) => (
            <div key={entry.id} className="meal-item">
              <div className="meal-info">
                <span className="meal-name">
                  {formatLocalDateString(entry.date, i18n.language, {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="meal-meta">{entry.date}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="meal-calories" style={{ color: 'var(--accent-secondary)' }}>
                  {formatWeight(entry.weightKg, i18n.language)}
                </span>
                <div className="meal-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => handleEdit(entry)}
                    title={t('weight.editWeight')}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => handleDelete(entry)}
                    title={t('weight.delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <WeightFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={async (data) => {
          if (editingEntry) {
            await updateWeight(editingEntry.id, data);
          } else {
            await addWeight(data);
          }
        }}
        initialEntry={editingEntry}
      />
    </div>
  );
};
