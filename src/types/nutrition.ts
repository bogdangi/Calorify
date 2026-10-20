export interface FoodNutrition {
  id: string;
  translations: {
    de: string;
    uk: string;
  };
  caloriesPer100g: number;
  defaultServingGrams: number;
  category?: 'fruits' | 'vegetables' | 'proteins' | 'grains' | 'meals' | 'dairy' | 'snacks';
}

export interface NutritionInfo {
  foodId: string;
  name: string;
  caloriesPer100g: number;
  defaultServingGrams: number;
  calculatedCalories: number;
}
