import { expect } from 'vitest';
import { CalorifyDatabase } from '../../db/indexeddb/db';
import { MealRepository } from '../../db/repositories/mealRepository';
import { ModularVisionPipeline } from '../../ml/pipeline/visionPipeline';
import { MockFoodClassifier } from '../../ml/classifiers/mockClassifier';
import { MockFoodDetector } from '../../ml/detectors/mockDetector';
import { MockPortionEstimator } from '../../ml/portion/mockPortionEstimator';
import { LocalNutritionProvider } from '../../ml/nutrition/provider';
import type { FoodAnalysis } from '../../types/ml';
import type { FoodNutrition } from '../../types/nutrition';

const defaultFoodDb: FoodNutrition[] = [
  {
    id: 'pizza',
    translations: { de: 'Pizza', uk: 'Піца' },
    caloriesPer100g: 250,
    defaultServingGrams: 250,
  },
  {
    id: 'apple',
    translations: { de: 'Apfel', uk: 'Яблуко' },
    caloriesPer100g: 52,
    defaultServingGrams: 150,
  },
  {
    id: 'salad',
    translations: { de: 'Salat', uk: 'Салат' },
    caloriesPer100g: 35,
    defaultServingGrams: 200,
  },
];

export function createVisionSteps() {
  const db = new CalorifyDatabase(`test_vision_bdd_${Math.random().toString(36).slice(2)}`);
  const mealRepo = new MealRepository(db);

  let pipeline: ModularVisionPipeline;
  let photoBlob: Blob;
  let analysisResult: FoodAnalysis | null = null;

  return {
    givenVisionPipelineFor: (foodId: string, language: 'de' | 'uk' = 'de') => {
      pipeline = new ModularVisionPipeline({
        classifier: new MockFoodClassifier(foodId, 0),
        detector: new MockFoodDetector(),
        portionEstimator: new MockPortionEstimator(),
        nutritionProvider: new LocalNutritionProvider(defaultFoodDb),
        language,
      });
    },

    givenPhotoOfMeal: (label = 'test_meal') => {
      photoBlob = new Blob([`mock_image_bytes_for_${label}`], { type: 'image/jpeg' });
    },

    whenPhotoIsAnalyzed: async () => {
      analysisResult = await pipeline.analyze(photoBlob);
    },

    thenSuggestedFoodIs: (expectedName: string) => {
      expect(analysisResult).not.toBeNull();
      expect(analysisResult!.foodName).toBe(expectedName);
    },

    thenSuggestedCaloriesAreGreaterThan: (minCalories: number) => {
      expect(analysisResult!.calories).toBeGreaterThan(minCalories);
    },

    thenDiaryDoesNotContain: async (foodName: string) => {
      const meals = await mealRepo.getAll();
      expect(meals.find((m) => m.name === foodName)).toBeUndefined();
    },

    whenUserConfirmsEstimate: async (overrides?: { portionGrams?: number; name?: string }) => {
      if (!analysisResult) throw new Error('Cannot confirm without analysis');
      const portion = overrides?.portionGrams ?? analysisResult.portionGrams;
      const name = overrides?.name ?? analysisResult.foodName;
      const baseFood = defaultFoodDb.find((f) => f.id === analysisResult!.foodId);
      const calories = baseFood
        ? Math.round((baseFood.caloriesPer100g * portion) / 100)
        : analysisResult.calories;

      await mealRepo.create({
        date: '2026-10-28',
        time: '12:30',
        name,
        calories,
        amount: portion,
        amountUnit: 'g',
        source: 'vision',
      });
    },

    thenMealIsPersistedInDiary: async (foodName: string, expectedCalories?: number) => {
      const meals = await mealRepo.getAll();
      const saved = meals.find((m) => m.name === foodName);
      expect(saved).toBeDefined();
      if (expectedCalories !== undefined) {
        expect(saved!.calories).toBe(expectedCalories);
      }
    },

    getAnalysisResult: () => analysisResult,
    getMealRepo: () => mealRepo,
  };
}
