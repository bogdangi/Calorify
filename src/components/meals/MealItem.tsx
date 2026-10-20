import React from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Edit2, Trash2 } from 'lucide-react';
import type { MealEntry } from '../../types/meal';
import { formatCalories } from '../../utils/formatters';

interface MealItemProps {
  meal: MealEntry;
  onEdit: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
}

export const MealItem: React.FC<MealItemProps> = ({ meal, onEdit, onDelete }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="meal-item">
      <div className="meal-info">
        <span className="meal-name">{meal.name}</span>
        <div className="meal-meta">
          <span>{meal.time}</span>
          {meal.amount ? (
            <span>
              • {meal.amount} {meal.amountUnit ? t(`units.${meal.amountUnit}`) : 'g'}
            </span>
          ) : null}
          {meal.source === 'vision' ? (
            <span className="badge-source" title={t('sources.vision')}>
              <Camera size={11} style={{ display: 'inline', marginRight: 3 }} />
              {t('sources.vision')}
            </span>
          ) : null}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span className="meal-calories">{formatCalories(meal.calories, i18n.language)}</span>
        <div className="meal-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => onEdit(meal)}
            title={t('mealModal.editTitle')}
            aria-label={`${t('mealModal.editTitle')}: ${meal.name}`}
          >
            <Edit2 size={16} />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onDelete(meal.id)}
            title={t('mealModal.delete')}
            aria-label={`${t('mealModal.delete')}: ${meal.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
