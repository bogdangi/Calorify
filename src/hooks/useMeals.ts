import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/indexeddb/db';
import { mealRepository } from '../db/repositories/mealRepository';
import type { MealEntry } from '../types/meal';

export function useMealsByDate(date: string) {
  const meals = useLiveQuery(
    () => db.meals.where('date').equals(date).sortBy('time'),
    [date]
  );

  const addMeal = async (mealData: Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    return mealRepository.create(mealData);
  };

  const updateMeal = async (id: string, updates: Partial<MealEntry>) => {
    return mealRepository.update(id, updates);
  };

  const deleteMeal = async (id: string) => {
    return mealRepository.delete(id);
  };

  return {
    meals: meals ?? [],
    isLoading: meals === undefined,
    addMeal,
    updateMeal,
    deleteMeal,
  };
}

export function useAllMeals() {
  const meals = useLiveQuery(() => db.meals.toArray());

  return {
    meals: meals ?? [],
    isLoading: meals === undefined,
  };
}
