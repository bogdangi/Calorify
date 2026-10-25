import { describe, it, expect } from 'vitest';
import {
  calculateCaloriesFromPortion,
  calculateDailyCalories,
  calculateWeeklyCalories,
  calculateMonthlyCalories,
  calculateWeightStats,
  filterWeightsByRange,
  calculateCalorieRecommendation,
} from '../utils/calculations';
import type { MealEntry } from '../types/meal';
import type { WeightEntry } from '../types/weight';

describe('Calculations: calculateCaloriesFromPortion', () => {
  it('correctly calculates calories for portions based on 100g base', () => {
    // 52 kcal/100g, 150g apple => 78 kcal
    expect(calculateCaloriesFromPortion(52, 150)).toBe(78);
    // 250 kcal/100g, 250g pizza => 625 kcal
    expect(calculateCaloriesFromPortion(250, 250)).toBe(625);
    // 89 kcal/100g, 120g banana => 107 kcal
    expect(calculateCaloriesFromPortion(89, 120)).toBe(107);
  });

  it('handles zero and negative or invalid numbers gracefully', () => {
    expect(calculateCaloriesFromPortion(0, 100)).toBe(0);
    expect(calculateCaloriesFromPortion(100, 0)).toBe(0);
    expect(calculateCaloriesFromPortion(-50, 100)).toBe(0);
    expect(calculateCaloriesFromPortion(NaN, 100)).toBe(0);
  });
});

describe('Calculations: calculateDailyCalories', () => {
  it('handles empty meal list', () => {
    const stats = calculateDailyCalories([]);
    expect(stats.totalCalories).toBe(0);
    expect(stats.mealsCount).toBe(0);
    expect(stats.averageKcalPerMeal).toBe(0);
    expect(stats.highestMeal).toBeNull();
    expect(stats.lowestMeal).toBeNull();
  });

  it('calculates single meal correctly', () => {
    const singleMeal: MealEntry = {
      id: '1',
      date: '2026-10-20',
      time: '08:00',
      name: 'Haferbrei',
      calories: 320,
      source: 'manual',
      createdAt: '2026-10-20T08:00:00Z',
      updatedAt: '2026-10-20T08:00:00Z',
    };
    const stats = calculateDailyCalories([singleMeal]);
    expect(stats.totalCalories).toBe(320);
    expect(stats.mealsCount).toBe(1);
    expect(stats.averageKcalPerMeal).toBe(320);
    expect(stats.highestMeal?.id).toBe('1');
    expect(stats.lowestMeal?.id).toBe('1');
  });

  it('calculates multiple meals, highest, lowest and averages correctly', () => {
    const meals: MealEntry[] = [
      {
        id: '1',
        date: '2026-10-20',
        time: '08:00',
        name: 'Banana',
        calories: 105,
        source: 'manual',
        createdAt: '2026-10-20T08:00:00Z',
        updatedAt: '2026-10-20T08:00:00Z',
      },
      {
        id: '2',
        date: '2026-10-20',
        time: '12:30',
        name: 'Pizza',
        calories: 650,
        source: 'vision',
        createdAt: '2026-10-20T12:30:00Z',
        updatedAt: '2026-10-20T12:30:00Z',
      },
      {
        id: '3',
        date: '2026-10-20',
        time: '19:00',
        name: 'Salad',
        calories: 145,
        source: 'manual',
        createdAt: '2026-10-20T19:00:00Z',
        updatedAt: '2026-10-20T19:00:00Z',
      },
    ];
    const stats = calculateDailyCalories(meals);
    expect(stats.totalCalories).toBe(900);
    expect(stats.mealsCount).toBe(3);
    expect(stats.averageKcalPerMeal).toBe(300);
    expect(stats.highestMeal?.id).toBe('2');
    expect(stats.lowestMeal?.id).toBe('1');
  });
});

describe('Calculations: calculateWeeklyCalories & calculateMonthlyCalories', () => {
  it('does NOT confuse average per tracked day with average per calendar day', () => {
    // 3 days tracked in a 7-day period: 2000, 1500, 2500 kcal = total 6000 kcal
    const meals: MealEntry[] = [
      {
        id: '1',
        date: '2026-10-18',
        time: '12:00',
        name: 'Lunch 1',
        calories: 2000,
        source: 'manual',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        date: '2026-10-19',
        time: '12:00',
        name: 'Lunch 2',
        calories: 1500,
        source: 'manual',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '3',
        date: '2026-10-20',
        time: '12:00',
        name: 'Lunch 3',
        calories: 2500,
        source: 'manual',
        createdAt: '',
        updatedAt: '',
      },
    ];

    const weekly = calculateWeeklyCalories(meals);
    expect(weekly.totalCalories).toBe(6000);
    expect(weekly.trackedDaysCount).toBe(3);
    // Average per tracked day = 6000 / 3 = 2000, NOT 6000 / 7 (~857)!
    expect(weekly.averageCaloriesPerTrackedDay).toBe(2000);
    expect(weekly.highestDay?.date).toBe('2026-10-20');
    expect(weekly.lowestDay?.date).toBe('2026-10-19');

    const monthly = calculateMonthlyCalories(meals);
    expect(monthly.totalCalories).toBe(6000);
    expect(monthly.trackedDaysCount).toBe(3);
    expect(monthly.averageCaloriesPerTrackedDay).toBe(2000);
    expect(monthly.averageMealsPerDay).toBe(1);
  });
});

describe('Calculations: calculateWeightStats', () => {
  it('handles empty weights', () => {
    const stats = calculateWeightStats([]);
    expect(stats.currentWeight).toBeNull();
    expect(stats.startingWeight).toBeNull();
    expect(stats.weightChange).toBeNull();
  });

  it('computes progression, min, max, average, and change correctly', () => {
    const weights: WeightEntry[] = [
      { id: '1', date: '2026-10-01', weightKg: 80.0, createdAt: '', updatedAt: '' },
      { id: '2', date: '2026-10-10', weightKg: 78.5, createdAt: '', updatedAt: '' },
      { id: '3', date: '2026-10-20', weightKg: 77.0, createdAt: '', updatedAt: '' },
    ];
    const stats = calculateWeightStats(weights);
    expect(stats.startingWeight).toBe(80.0);
    expect(stats.currentWeight).toBe(77.0);
    expect(stats.weightChange).toBe(-3.0);
    expect(stats.minWeight).toBe(77.0);
    expect(stats.maxWeight).toBe(80.0);
    expect(stats.averageWeight).toBe(78.5);
  });

  it('filters by range correctly', () => {
    const weights: WeightEntry[] = [
      { id: '1', date: '2026-08-01', weightKg: 82.0, createdAt: '', updatedAt: '' },
      { id: '2', date: '2026-10-01', weightKg: 80.0, createdAt: '', updatedAt: '' },
      { id: '3', date: '2026-10-19', weightKg: 78.0, createdAt: '', updatedAt: '' },
    ];
    const ref = '2026-10-20';
    const last7d = filterWeightsByRange(weights, '7d', ref);
    expect(last7d.length).toBe(1);
    expect(last7d[0].id).toBe('3');

    const last30d = filterWeightsByRange(weights, '30d', ref);
    expect(last30d.length).toBe(2);

    const all = filterWeightsByRange(weights, 'all', ref);
    expect(all.length).toBe(3);
  });
});

describe('Calculations: calculateCalorieRecommendation (US-1)', () => {
  it('computes BMR (Mifflin-St Jeor), TDEE and target for men', () => {
    // Male, 30y, 180cm, 80kg, moderately active (PAL 1.55)
    // BMR = 10*80 + 6.25*180 - 5*30 + 5 = 1780
    const rec = calculateCalorieRecommendation({
      sex: 'male',
      age: 30,
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'moderate',
    });
    expect(rec).not.toBeNull();
    expect(rec!.bmr).toBe(1780);
    expect(rec!.tdee).toBe(2759);
    expect(rec!.target).toBe(2259); // 2759 - 500 deficit
    expect(rec!.floored).toBe(false);
  });

  it('applies the female BMR offset (-161)', () => {
    // Female, 30y, 170cm, 65kg, light activity (PAL 1.375)
    // BMR = 650 + 1062.5 - 150 - 161 = 1401.5
    const rec = calculateCalorieRecommendation({
      sex: 'female',
      age: 30,
      heightCm: 170,
      weightKg: 65,
      activityLevel: 'light',
    });
    expect(rec).not.toBeNull();
    expect(rec!.bmr).toBe(1402);
    expect(rec!.tdee).toBe(1927);
    expect(rec!.target).toBe(1427);
    expect(rec!.floored).toBe(false);
  });

  it('caps women at the 1200 kcal safety floor and flags it', () => {
    // Female, 70y, 150cm, 45kg, sedentary: raw target ~552 kcal
    const rec = calculateCalorieRecommendation({
      sex: 'female',
      age: 70,
      heightCm: 150,
      weightKg: 45,
      activityLevel: 'sedentary',
    });
    expect(rec).not.toBeNull();
    expect(rec!.target).toBe(1200);
    expect(rec!.floored).toBe(true);
  });

  it('caps men at the 1500 kcal safety floor and flags it', () => {
    // Male, 75y, 150cm, 50kg, sedentary: raw target ~781 kcal
    const rec = calculateCalorieRecommendation({
      sex: 'male',
      age: 75,
      heightCm: 150,
      weightKg: 50,
      activityLevel: 'sedentary',
    });
    expect(rec).not.toBeNull();
    expect(rec!.target).toBe(1500);
    expect(rec!.floored).toBe(true);
  });

  it('returns null for incomplete or invalid profiles', () => {
    const base = { age: 30, heightCm: 180, weightKg: 80, activityLevel: 'moderate' } as const;
    expect(calculateCalorieRecommendation({ sex: null, ...base })).toBeNull();
    expect(
      calculateCalorieRecommendation({ sex: 'male', age: null, heightCm: 180, weightKg: 80, activityLevel: 'moderate' })
    ).toBeNull();
    expect(
      calculateCalorieRecommendation({ sex: 'male', age: 30, heightCm: 180, weightKg: null, activityLevel: 'moderate' })
    ).toBeNull();
    expect(
      calculateCalorieRecommendation({ sex: 'male', age: 30, heightCm: 180, weightKg: 80, activityLevel: null })
    ).toBeNull();
    expect(
      calculateCalorieRecommendation({ sex: 'male', age: 30, heightCm: 180, weightKg: 0, activityLevel: 'moderate' })
    ).toBeNull();
    expect(
      calculateCalorieRecommendation({ sex: 'male', age: -5, heightCm: 180, weightKg: 80, activityLevel: 'moderate' })
    ).toBeNull();
  });
});
