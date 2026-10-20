import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import type { WeightEntry } from '../../types/weight';
import { getLocalDateString } from '../../utils/date';

interface WeightFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  initialEntry?: WeightEntry | null;
  defaultDate?: string;
}

const WeightFormInner: React.FC<Omit<WeightFormModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  initialEntry,
  defaultDate,
}) => {
  const { t } = useTranslation();

  const [date, setDate] = useState(initialEntry?.date || defaultDate || getLocalDateString());
  const [weightKg, setWeightKg] = useState<number | ''>(
    initialEntry?.weightKg !== undefined ? initialEntry.weightKg : ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericWeight = Number(weightKg);
    if (weightKg === '' || isNaN(numericWeight) || numericWeight <= 0 || numericWeight > 500) {
      setError('Bitte gib ein realistisches Gewicht ein (z.B. 72.5 kg).');
      return;
    }

    try {
      await onSave({
        id: initialEntry?.id,
        date,
        weightKg: Number(numericWeight.toFixed(2)),
      });
      onClose();
    } catch (err) {
      console.error('Error saving weight entry:', err);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={initialEntry ? t('weight.editWeight') : t('weight.addWeight')}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {error ? (
          <div style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}>{error}</div>
        ) : null}

        <div className="form-group">
          <label className="form-label" htmlFor="weight-input">
            {t('weight.weightInput')}
          </label>
          <input
            id="weight-input"
            className="form-input"
            type="number"
            step="0.1"
            min="20"
            max="400"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="72.5"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="weight-date">
            {t('weight.dateInput')}
          </label>
          <input
            id="weight-date"
            className="form-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            {t('weight.cancel')}
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
            {t('weight.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const WeightFormModal: React.FC<WeightFormModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <WeightFormInner key={props.initialEntry?.id || 'new_weight'} {...props} />;
};
