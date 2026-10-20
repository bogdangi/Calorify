import type { MealEntry } from '../types/meal';
import type { WeightEntry, WeightStats } from '../types/weight';

/**
 * Calculates calories for a specific portion in grams based on kcal/100g.
 * Formula: calories = caloriesPer100g * portionGrams / 100
 */
export function calculateCaloriesFromPortion(caloriesPer100g: number, portionGrams: number): number {
  if (caloriesPer100g <= 0 || portionGrams <= 0 || isNaN(caloriesPer100g) || isNaN(portionGrams)) {
    return 0;
  }
  return Math.round((caloriesPer100g * portionGrams) / 100);
}

/**
 * Calculates total calories for a collection of meals.
 */
export function calculateTotalCalories(meals: MealEntry[]): number {
  return meals.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
}

/**
 * Calculates daily statistics for a set of meals belonging to a single day.
 */
export function calculateDailyCalories(meals: MealEntry[]): {
  totalCalories: number;
  mealsCount: number;
  averageKcalPerMeal: number;
  highestMeal: MealEntry | null;
  lowestMeal: MealEntry | null;
} {
  if (!meals || meals.length === 0) {
    return {
      totalCalories: 0,
      mealsCount: 0,
      averageKcalPerMeal: 0,
      highestMeal: null,
      lowestMeal: null,
    };
  }

  const totalCalories = calculateTotalCalories(meals);
  const mealsCount = meals.length;
  const averageKcalPerMeal = Math.round(totalCalories / mealsCount);

  let highestMeal: MealEntry = meals[0];
  let lowestMeal: MealEntry = meals[0];

  for (let i = 1; i < meals.length; i++) {
    const meal = meals[i];
    if (meal.calories > highestMeal.calories) {
      highestMeal = meal;
    }
    if (meal.calories < lowestMeal.calories) {
      lowestMeal = meal;
    }
  }

  return {
    totalCalories,
    mealsCount,
    averageKcalPerMeal,
    highestMeal,
    lowestMeal,
  };
}

/**
 * Groups meals by date (YYYY-MM-DD).
 */
export function groupMealsByDate(meals: MealEntry[]): Record<string, MealEntry[]> {
  const groups: Record<string, MealEntry[]> = {};
  for (const meal of meals) {
    if (!groups[meal.date]) {
      groups[meal.date] = [];
    }
    groups[meal.date].push(meal);
  }
  return groups;
}

/**
 * Calculates weekly statistics.
 * "average calories per tracked day" - does NOT divide by 7 if only 3 days were tracked!
 */
export function calculateWeeklyCalories(meals: MealEntry[]): {
  totalCalories: number;
  trackedDaysCount: number;
  averageCaloriesPerTrackedDay: number;
  highestDay: { date: string; calories: number } | null;
  lowestDay: { date: string; calories: number } | null;
  dailyBreakdown: Array<{ date: string; calories: number; mealsCount: number }>;
} {
  if (!meals || meals.length === 0) {
    return {
      totalCalories: 0,
      trackedDaysCount: 0,
      averageCaloriesPerTrackedDay: 0,
      highestDay: null,
      lowestDay: null,
      dailyBreakdown: [],
    };
  }

  const groups = groupMealsByDate(meals);
  const trackedDates = Object.keys(groups);
  const trackedDaysCount = trackedDates.length;

  let totalCalories = 0;
  let highestDay: { date: string; calories: number } | null = null;
  let lowestDay: { date: string; calories: number } | null = null;

  const dailyBreakdown = trackedDates.map((date) => {
    const dayMeals = groups[date];
    const dayCalories = calculateTotalCalories(dayMeals);
    totalCalories += dayCalories;

    if (!highestDay || dayCalories > highestDay.calories) {
      highestDay = { date, calories: dayCalories };
    }
    if (!lowestDay || dayCalories < lowestDay.calories) {
      lowestDay = { date, calories: dayCalories };
    }

    return {
      date,
      calories: dayCalories,
      mealsCount: dayMeals.length,
    };
  });

  const averageCaloriesPerTrackedDay =
    trackedDaysCount > 0 ? Math.round(totalCalories / trackedDaysCount) : 0;

  return {
    totalCalories,
    trackedDaysCount,
    averageCaloriesPerTrackedDay,
    highestDay,
    lowestDay,
    dailyBreakdown,
  };
}

/**
 * Calculates monthly statistics.
 */
export function calculateMonthlyCalories(
  meals: MealEntry[],
  weights: WeightEntry[] = []
): {
  totalCalories: number;
  trackedDaysCount: number;
  averageCaloriesPerTrackedDay: number;
  averageMealsPerDay: number;
  weightChange: number | null;
} {
  if (!meals || meals.length === 0) {
    const weightStats = calculateWeightStats(weights);
    return {
      totalCalories: 0,
      trackedDaysCount: 0,
      averageCaloriesPerTrackedDay: 0,
      averageMealsPerDay: 0,
      weightChange: weightStats.weightChange,
    };
  }

  const groups = groupMealsByDate(meals);
  const trackedDaysCount = Object.keys(groups).length;
  const totalCalories = calculateTotalCalories(meals);
  const averageCaloriesPerTrackedDay =
    trackedDaysCount > 0 ? Math.round(totalCalories / trackedDaysCount) : 0;
  const averageMealsPerDay =
    trackedDaysCount > 0 ? Number((meals.length / trackedDaysCount).toFixed(1)) : 0;

  const weightStats = calculateWeightStats(weights);

  return {
    totalCalories,
    trackedDaysCount,
    averageCaloriesPerTrackedDay,
    averageMealsPerDay,
    weightChange: weightStats.weightChange,
  };
}

/**
 * Calculates weight tracking stats: current, starting, change, average, min, max.
 */
export function calculateWeightStats(weights: WeightEntry[]): WeightStats {
  if (!weights || weights.length === 0) {
    return {
      currentWeight: null,
      startingWeight: null,
      weightChange: null,
      averageWeight: null,
      minWeight: null,
      maxWeight: null,
    };
  }

  // Sort chronological by date
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));

  const startingWeight = sorted[0].weightKg;
  const currentWeight = sorted[sorted.length - 1].weightKg;
  const weightChange = Number((currentWeight - startingWeight).toFixed(2));

  let sum = 0;
  let minWeight = sorted[0].weightKg;
  let maxWeight = sorted[0].weightKg;

  for (const entry of sorted) {
    sum += entry.weightKg;
    if (entry.weightKg < minWeight) minWeight = entry.weightKg;
    if (entry.weightKg > maxWeight) maxWeight = entry.weightKg;
  }

  const averageWeight = Number((sum / sorted.length).toFixed(2));

  return {
    currentWeight,
    startingWeight,
    weightChange,
    averageWeight,
    minWeight,
    maxWeight,
  };
}

/**
 * Filter weights by time range (7d, 30d, 3m, all) relative to a reference date.
 */
export function filterWeightsByRange(
  weights: WeightEntry[],
  range: '7d' | '30d' | '3m' | 'all',
  referenceDateStr?: string
): WeightEntry[] {
  if (range === 'all' || weights.length === 0) {
    return [...weights].sort((a, b) => a.date.localeCompare(b.date));
  }

  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  let daysCutoff = 7;
  if (range === '30d') daysCutoff = 30;
  else if (range === '3m') daysCutoff = 90;

  const cutoff = new Date(refDate);
  cutoff.setDate(cutoff.getDate() - daysCutoff);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return weights
    .filter((w) => w.date >= cutoffStr)
    .sort((a, b) => a.date.localeCompare(b.date));
}
