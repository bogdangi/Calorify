import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import type { MealEntry, MealType, AmountUnit } from '../../types/meal';
import { getLocalDateString, getLocalTimeString } from '../../utils/date';
import { defaultNutritionProvider } from '../../ml/nutrition/provider';
import { calculateCaloriesFromPortion } from '../../utils/calculations';

interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meal: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Promise<void>;
  initialMeal?: MealEntry | null;
  defaultDate?: string;
}

const MealFormInner: React.FC<Omit<MealFormModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  initialMeal,
  defaultDate,
}) => {
  const { t, i18n } = useTranslation();

  const [name, setName] = useState(initialMeal?.name || '');
  const [calories, setCalories] = useState<number | ''>(
    initialMeal?.calories !== undefined ? initialMeal.calories : ''
  );
  const [amount, setAmount] = useState<number | ''>(
    initialMeal?.amount !== undefined ? initialMeal.amount : 150
  );
  const [amountUnit, setAmountUnit] = useState<AmountUnit>(initialMeal?.amountUnit || 'g');
  const [mealType, setMealType] = useState<MealType>(initialMeal?.mealType || 'lunch');
  const [date, setDate] = useState(initialMeal?.date || defaultDate || getLocalDateString());
  const [time, setTime] = useState(initialMeal?.time || getLocalTimeString());
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(
    initialMeal?.visionPrediction?.foodId || null
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // If user enters amount and has a selected food item, auto calculate calories
  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    if (selectedFoodId) {
      const food = defaultNutritionProvider.getFoodById(selectedFoodId);
      if (food) {
        const cal = calculateCaloriesFromPortion(food.caloriesPer100g, newAmount);
        setCalories(cal);
      }
    }
  };

  const handleFoodSelect = (foodId: string) => {
    const food = defaultNutritionProvider.getFoodById(foodId);
    if (food) {
      const localizedName = food.translations[i18n.language === 'uk' ? 'uk' : 'de'] || food.translations.de;
      setName(localizedName);
      setSelectedFoodId(food.id);
      const serving = food.defaultServingGrams;
      setAmount(serving);
      setAmountUnit('g');
      const cal = calculateCaloriesFromPortion(food.caloriesPer100g, serving);
      setCalories(cal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError(t('mealModal.validation.nameRequired'));
      return;
    }
    const numericCalories = Number(calories);
    if (calories === '' || isNaN(numericCalories) || numericCalories < 0) {
      setValidationError(t('mealModal.validation.caloriesPositive'));
      return;
    }

    try {
      await onSave({
        id: initialMeal?.id,
        name: name.trim(),
        calories: numericCalories,
        amount: amount !== '' ? Number(amount) : undefined,
        amountUnit,
        mealType,
        date,
        time,
        source: initialMeal?.source || 'manual',
        visionPrediction: initialMeal?.visionPrediction,
      });
      onClose();
    } catch (err) {
      console.error('Error saving meal:', err);
    }
  };

  const quickFoods = defaultNutritionProvider.getAllFoods().slice(0, 8);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={initialMeal ? t('mealModal.editTitle') : t('mealModal.addTitle')}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {validationError ? (
          <div style={{ color: 'var(--accent-danger)', fontSize: '0.85rem' }}>
            {validationError}
          </div>
        ) : null}

        {/* Quick Food Suggestions */}
        {!initialMeal ? (
          <div>
            <div className="meal-group-title">{t('today.quickAdd')}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {quickFoods.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: 'auto' }}
                  onClick={() => handleFoodSelect(f.id)}
                >
                  {f.translations[i18n.language === 'uk' ? 'uk' : 'de'] || f.translations.de}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="form-group">
          <label className="form-label" htmlFor="meal-name">
            {t('mealModal.foodName')}
          </label>
          <input
            id="meal-name"
            className="form-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSelectedFoodId(null);
            }}
            placeholder={t('mealModal.foodNamePlaceholder')}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="meal-calories">
              {t('mealModal.calories')}
            </label>
            <input
              id="meal-calories"
              className="form-input"
              type="number"
              min="0"
              step="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meal-type">
              {t('mealModal.mealType')}
            </label>
            <select
              id="meal-type"
              className="form-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
            >
              <option value="breakfast">{t('mealTypes.breakfast')}</option>
              <option value="lunch">{t('mealTypes.lunch')}</option>
              <option value="dinner">{t('mealTypes.dinner')}</option>
              <option value="snack">{t('mealTypes.snack')}</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="meal-amount">
              {t('mealModal.portion')}
            </label>
            <input
              id="meal-amount"
              className="form-input"
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meal-unit">
              {t('mealModal.unit')}
            </label>
            <select
              id="meal-unit"
              className="form-select"
              value={amountUnit}
              onChange={(e) => setAmountUnit(e.target.value as AmountUnit)}
            >
              <option value="g">{t('units.g')}</option>
              <option value="ml">{t('units.ml')}</option>
              <option value="portion">{t('units.portion')}</option>
              <option value="piece">{t('units.piece')}</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="meal-date">
              {t('mealModal.date')}
            </label>
            <input
              id="meal-date"
              className="form-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="meal-time">
              {t('mealModal.time')}
            </label>
            <input
              id="meal-time"
              className="form-input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            {t('mealModal.cancel')}
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
            {t('mealModal.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const MealFormModal: React.FC<MealFormModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <MealFormInner key={props.initialMeal?.id || 'new_meal'} {...props} />;
};
