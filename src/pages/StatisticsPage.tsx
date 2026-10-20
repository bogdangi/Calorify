import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAllMeals } from '../hooks/useMeals';
import { useWeights } from '../hooks/useWeights';
import { useSettings } from '../hooks/useSettings';
import { CalorieBarChart } from '../components/charts/CalorieBarChart';
import {
  calculateDailyCalories,
  calculateWeeklyCalories,
  calculateMonthlyCalories,
  groupMealsByDate,
} from '../utils/calculations';
import { getLocalDateString, getDateRangeArray } from '../utils/date';
import { formatCalories, formatLocalDateString } from '../utils/formatters';

type StatTab = 'day' | 'week' | 'month';

export const StatisticsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { meals } = useAllMeals();
  const { weights } = useWeights();
  const { settings } = useSettings();

  const [activeTab, setActiveTab] = useState<StatTab>('week');
  const todayStr = getLocalDateString();

  // Filter meals for current day
  const todayMeals = meals.filter((m) => m.date === todayStr);
  const dailyStats = calculateDailyCalories(todayMeals);

  // Past 7 days
  const last7Days = getDateRangeArray(todayStr, 7);
  const past7DaysMeals = meals.filter((m) => last7Days.includes(m.date));
  const weeklyStats = calculateWeeklyCalories(past7DaysMeals);

  // Prepare 7-day chart data (including 0-calorie days so user sees empty days)
  const mealsByDate = groupMealsByDate(past7DaysMeals);
  const weeklyChartData = last7Days.map((date) => {
    const dayMeals = mealsByDate[date] || [];
    return {
      date,
      calories: dayMeals.reduce((sum, item) => sum + item.calories, 0),
    };
  });

  // Past 30 days for month
  const last30Days = getDateRangeArray(todayStr, 30);
  const past30DaysMeals = meals.filter((m) => last30Days.includes(m.date));
  const monthlyStats = calculateMonthlyCalories(past30DaysMeals, weights);

  return (
    <div className="main-content">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('statistics.title')}</h2>

      {/* Tab Switcher */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: 4,
          borderRadius: 'var(--radius-lg)',
          gap: 4,
        }}
        role="tablist"
      >
        {(['day', 'week', 'month'] as StatTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className="btn"
            style={{
              flex: 1,
              padding: '8px 12px',
              minHeight: 'auto',
              borderRadius: 'var(--radius-md)',
              background: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab ? '#ffffff' : 'var(--text-secondary)',
            }}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {t(`statistics.tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* Daily View */}
      {activeTab === 'day' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('statistics.daily.totalCalories')}</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {formatCalories(dailyStats.totalCalories, i18n.language)}
              </span>
            </div>

            <div style={{ height: 1, background: 'var(--border-subtle)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('statistics.daily.mealsCount')}</span>
              <span style={{ fontWeight: 600 }}>{dailyStats.mealsCount}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('statistics.daily.avgKcalPerMeal')}</span>
              <span style={{ fontWeight: 600 }}>
                {formatCalories(dailyStats.averageKcalPerMeal, i18n.language)}
              </span>
            </div>

            {dailyStats.highestMeal && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('statistics.daily.highestMeal')}</span>
                <span style={{ fontWeight: 600 }}>
                  {dailyStats.highestMeal.name} ({formatCalories(dailyStats.highestMeal.calories, i18n.language)})
                </span>
              </div>
            )}

            {dailyStats.lowestMeal && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('statistics.daily.lowestMeal')}</span>
                <span style={{ fontWeight: 600 }}>
                  {dailyStats.lowestMeal.name} ({formatCalories(dailyStats.lowestMeal.calories, i18n.language)})
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {activeTab === 'week' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Weekly Calorie Bar Chart */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>
              {t('statistics.weekly.chartTitle')}
            </h3>
            <CalorieBarChart data={weeklyChartData} dailyGoal={settings.dailyCalorieGoal || 2000} />
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('statistics.weekly.totalCalories')}</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {formatCalories(weeklyStats.totalCalories, i18n.language)}
              </span>
            </div>

            <div style={{ height: 1, background: 'var(--border-subtle)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('statistics.weekly.trackedDays')}</span>
              <span style={{ fontWeight: 600 }}>{weeklyStats.trackedDaysCount} / 7</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('statistics.weekly.avgTrackedDay')}</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {formatCalories(weeklyStats.averageCaloriesPerTrackedDay, i18n.language)}
              </span>
            </div>

            {weeklyStats.highestDay && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('statistics.weekly.highestDay')}</span>
                <span style={{ fontWeight: 600 }}>
                  {formatLocalDateString(weeklyStats.highestDay.date, i18n.language, { weekday: 'short' })}: {formatCalories(weeklyStats.highestDay.calories, i18n.language)}
                </span>
              </div>
            )}

            {weeklyStats.lowestDay && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('statistics.weekly.lowestDay')}</span>
                <span style={{ fontWeight: 600 }}>
                  {formatLocalDateString(weeklyStats.lowestDay.date, i18n.language, { weekday: 'short' })}: {formatCalories(weeklyStats.lowestDay.calories, i18n.language)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly View */}
      {activeTab === 'month' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('statistics.monthly.totalCalories')}</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                {formatCalories(monthlyStats.totalCalories, i18n.language)}
              </span>
            </div>

            <div style={{ height: 1, background: 'var(--border-subtle)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('statistics.monthly.trackedDays')}</span>
              <span style={{ fontWeight: 600 }}>{monthlyStats.trackedDaysCount} / 30</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('statistics.monthly.avgTrackedDay')}</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {formatCalories(monthlyStats.averageCaloriesPerTrackedDay, i18n.language)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('statistics.monthly.avgMealsPerDay')}</span>
              <span style={{ fontWeight: 600 }}>{monthlyStats.averageMealsPerDay}</span>
            </div>

            {monthlyStats.weightChange !== null && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('statistics.monthly.weightChange')}</span>
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      monthlyStats.weightChange < 0
                        ? 'var(--accent-primary)'
                        : monthlyStats.weightChange > 0
                        ? 'var(--accent-warning)'
                        : 'var(--text-primary)',
                  }}
                >
                  {monthlyStats.weightChange > 0 ? `+${monthlyStats.weightChange}` : monthlyStats.weightChange} kg
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
