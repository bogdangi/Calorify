import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Plus, Camera, Scale, UtensilsCrossed } from 'lucide-react';
import { useMealsByDate } from '../hooks/useMeals';
import { useWeightByDate, useWeights } from '../hooks/useWeights';
import { useSettings } from '../hooks/useSettings';
import { MealItem } from '../components/meals/MealItem';
import { MealFormModal } from '../components/meals/MealFormModal';
import { PhotoCaptureModal } from '../components/vision/PhotoCaptureModal';
import { WeightFormModal } from '../components/weight/WeightFormModal';
import { getLocalDateString, addDaysToDateString } from '../utils/date';
import { formatLocalDateString, formatCalories, formatWeight } from '../utils/formatters';
import { calculateDailyCalories } from '../utils/calculations';
import type { MealEntry, MealType } from '../types/meal';

export const TodayPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();

  const [currentDate, setCurrentDate] = useState<string>(getLocalDateString());
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);

  const { meals, addMeal, updateMeal, deleteMeal } = useMealsByDate(currentDate);
  const { entry: todayWeight } = useWeightByDate(currentDate);
  const { addWeight } = useWeights();

  const isToday = currentDate === getLocalDateString();
  const dailyStats = calculateDailyCalories(meals);
  const goal = settings.dailyCalorieGoal || 2000;
  const remaining = goal - dailyStats.totalCalories;
  const isOverGoal = remaining < 0;
  const progressPercent = Math.min(Math.round((dailyStats.totalCalories / goal) * 100), 100);

  // Group meals by mealType
  const mealTypeOrder: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
  const groupedMeals = mealTypeOrder.map((type) => ({
    type,
    items: meals.filter((m) => m.mealType === type || (!m.mealType && type === 'lunch')),
  }));

  const handlePrevDay = () => setCurrentDate((d) => addDaysToDateString(d, -1));
  const handleNextDay = () => setCurrentDate((d) => addDaysToDateString(d, 1));
  const handleResetToday = () => setCurrentDate(getLocalDateString());

  const handleEditMeal = (meal: MealEntry) => {
    setEditingMeal(meal);
    setIsAddMealOpen(true);
  };

  const handleDeleteMeal = async (id: string) => {
    if (window.confirm(t('mealModal.confirmDelete'))) {
      await deleteMeal(id);
    }
  };

  return (
    <div className="main-content">
      {/* Date Navigation & Calorie Summary Card */}
      <div className="calorie-widget">
        <div className="date-bar">
          <button
            type="button"
            className="date-arrow-btn"
            onClick={handlePrevDay}
            aria-label={t('today.dateNavigation.previousDay')}
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}
            onClick={handleResetToday}
          >
            <div className="date-text">
              {formatLocalDateString(currentDate, i18n.language, {
                weekday: 'short',
                day: 'numeric',
                month: 'long',
              })}
            </div>
            {isToday ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                ● {t('today.title')}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className="date-arrow-btn"
            onClick={handleNextDay}
            aria-label={t('today.dateNavigation.nextDay')}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Calories Main Numbers */}
        <div className="calorie-main-display">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('today.caloriesConsumed')}
            </div>
            <div className="consumed-number">
              {formatCalories(dailyStats.totalCalories, i18n.language)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {t('today.dailyGoal')}
            </div>
            <div className="goal-number">{formatCalories(goal, i18n.language)}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-bg" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`progress-bar-fill ${isOverGoal ? 'over' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Remaining info */}
        <div className="remaining-status">
          <span>{isOverGoal ? t('today.overGoal') : t('today.remaining')}</span>
          <span className={`remaining-highlight ${isOverGoal ? 'over' : ''}`}>
            {formatCalories(Math.abs(remaining), i18n.language)}
          </span>
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="action-grid">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingMeal(null);
            setIsAddMealOpen(true);
          }}
          aria-label={t('today.addFood')}
        >
          <Plus size={18} />
          <span>{t('today.addFood')}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setIsPhotoOpen(true)}
          aria-label={t('today.estimatePhoto')}
          style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
        >
          <Camera size={18} />
          <span>{t('today.estimatePhoto')}</span>
        </button>
      </div>

      {/* Today's Weight Card */}
      <div
        className="card"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Scale size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('today.todayWeight')}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {todayWeight ? formatWeight(todayWeight.weightKg, i18n.language) : t('today.notRecorded')}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.85rem', minHeight: 'auto' }}
          onClick={() => setIsWeightModalOpen(true)}
        >
          {todayWeight ? t('weight.editWeight') : t('today.logWeight')}
        </button>
      </div>

      {/* Meals List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {meals.length === 0 ? (
          <div className="empty-state">
            <UtensilsCrossed className="empty-icon" />
            <p style={{ fontWeight: 600 }}>{t('today.noMeals')}</p>
            <p style={{ fontSize: '0.85rem', maxWidth: 300 }}>{t('today.noMealsPrompt')}</p>
          </div>
        ) : (
          groupedMeals.map((group) => {
            if (group.items.length === 0) return null;
            return (
              <div key={group.type}>
                <div className="meal-group-title">
                  <span>{t(`mealTypes.${group.type}`)}</span>
                  <span>
                    {formatCalories(
                      group.items.reduce((sum, item) => sum + item.calories, 0),
                      i18n.language
                    )}
                  </span>
                </div>
                {group.items.map((meal) => (
                  <MealItem
                    key={meal.id}
                    meal={meal}
                    onEdit={handleEditMeal}
                    onDelete={handleDeleteMeal}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <MealFormModal
        isOpen={isAddMealOpen}
        onClose={() => {
          setIsAddMealOpen(false);
          setEditingMeal(null);
        }}
        onSave={async (data) => {
          if (editingMeal) {
            await updateMeal(editingMeal.id, data);
          } else {
            await addMeal(data);
          }
        }}
        initialMeal={editingMeal}
        defaultDate={currentDate}
      />

      <PhotoCaptureModal
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
        onConfirmMeal={async (mealData) => {
          await addMeal(mealData);
        }}
        targetDate={currentDate}
      />

      <WeightFormModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSave={async (data) => {
          await addWeight(data);
        }}
        initialEntry={todayWeight || null}
        defaultDate={currentDate}
      />
    </div>
  );
};
