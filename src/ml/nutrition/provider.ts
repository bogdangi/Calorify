import type { NutritionProvider, NutritionInfo } from '../../types/ml';
import type { FoodNutrition } from '../../types/nutrition';
import { FOOD_DATABASE } from './database';
import { calculateCaloriesFromPortion } from '../../utils/calculations';

export class LocalNutritionProvider implements NutritionProvider {
  private items: Map<string, FoodNutrition>;

  constructor(customDatabase: FoodNutrition[] = FOOD_DATABASE) {
    this.items = new Map();
    for (const item of customDatabase) {
      this.items.set(item.id.toLowerCase(), item);
    }
  }

  async getNutrition(foodId: string, language: string = 'de'): Promise<NutritionInfo | null> {
    const item = this.items.get(foodId.toLowerCase());
    if (!item) {
      return null;
    }

    const langKey = language === 'uk' ? 'uk' : 'de';
    const localizedName = item.translations[langKey] || item.translations.de;
    const defaultServingGrams = item.defaultServingGrams;
    const calculatedCalories = calculateCaloriesFromPortion(item.caloriesPer100g, defaultServingGrams);

    return {
      foodId: item.id,
      name: localizedName,
      caloriesPer100g: item.caloriesPer100g,
      defaultServingGrams,
      calculatedCalories,
    };
  }

  getAllFoods(): FoodNutrition[] {
    return Array.from(this.items.values());
  }

  getFoodById(id: string): FoodNutrition | undefined {
    return this.items.get(id.toLowerCase());
  }
}

export const defaultNutritionProvider = new LocalNutritionProvider();
