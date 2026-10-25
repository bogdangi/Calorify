import { describe, it, expect } from 'vitest';
import { ModularVisionPipeline } from '../ml/pipeline/visionPipeline';
import { MockFoodClassifier } from '../ml/classifiers/mockClassifier';
import { MockFoodDetector } from '../ml/detectors/mockDetector';
import { MockPortionEstimator } from '../ml/portion/mockPortionEstimator';
import { LocalNutritionProvider } from '../ml/nutrition/provider';
import type { FoodClassifier } from '../types/ml';
import type { FoodNutrition } from '../types/nutrition';

describe('Modular Vision Pipeline (Mock ML Testing)', () => {
  const customDatabase: FoodNutrition[] = [
    {
      id: 'pizza',
      translations: { de: 'Pizza', uk: 'Піца' },
      caloriesPer100g: 250,
      defaultServingGrams: 250,
    },
    {
      id: 'banana',
      translations: { de: 'Banane', uk: 'Банан' },
      caloriesPer100g: 89,
      defaultServingGrams: 120,
    },
    {
      id: 'salad',
      translations: { de: 'Salat', uk: 'Салат' },
      caloriesPer100g: 20,
      defaultServingGrams: 150,
    },
  ];

  it('runs complete pipeline and estimates calories accurately', async () => {
    const classifier = new MockFoodClassifier('pizza', 0); // 0ms delay for unit tests
    const detector = new MockFoodDetector();
    const portionEstimator = new MockPortionEstimator();
    const nutritionProvider = new LocalNutritionProvider(customDatabase);

    const pipeline = new ModularVisionPipeline({
      classifier,
      detector,
      portionEstimator,
      nutritionProvider,
      language: 'de',
    });

    // Mock image blob
    const dummyBlob = new Blob(['fake_image_bytes'], { type: 'image/jpeg' });
    const analysis = await pipeline.analyze(dummyBlob);

    expect(analysis.foodId).toBe('pizza');
    expect(analysis.foodName).toBe('Pizza');
    expect(analysis.confidence).toBeGreaterThan(0.7);
    expect(analysis.isMock).toBe(true);
    expect(analysis.portionGrams).toBeGreaterThan(200);
    expect(analysis.calories).toBeGreaterThan(500); // 250 kcal/100g * ~250g
    expect(analysis.inferenceTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('translates food name based on pipeline language', async () => {
    const classifier = new MockFoodClassifier('banana', 0);
    const nutritionProvider = new LocalNutritionProvider(customDatabase);

    const pipeline = new ModularVisionPipeline({
      classifier,
      nutritionProvider,
      language: 'uk',
    });

    const dummyBlob = new Blob(['fake_bytes'], { type: 'image/jpeg' });
    const analysis = await pipeline.analyze(dummyBlob);

    expect(analysis.foodId).toBe('banana');
    expect(analysis.foodName).toBe('Банан'); // Ukrainian translation
  });

  it('provides alternative food suggestions', async () => {
    const classifier = new MockFoodClassifier('salad', 0);
    const nutritionProvider = new LocalNutritionProvider(customDatabase);

    const pipeline = new ModularVisionPipeline({
      classifier,
      nutritionProvider,
      language: 'de',
    });

    const dummyBlob = new Blob(['fake_bytes'], { type: 'image/jpeg' });
    const analysis = await pipeline.analyze(dummyBlob);

    expect(analysis.topAlternatives).toBeDefined();
    expect(Array.isArray(analysis.topAlternatives)).toBe(true);
  });

  it('passes the predicting head source through to the analysis', async () => {
    const classifier: FoodClassifier = {
      classify: async () => [
        { foodId: 'pizza', confidence: 0.9, source: 'food101' },
        { foodId: 'banana', confidence: 0.4, source: 'imagenet' },
      ],
    };
    const nutritionProvider = new LocalNutritionProvider(customDatabase);

    const pipeline = new ModularVisionPipeline({
      classifier,
      nutritionProvider,
      language: 'de',
    });

    const analysis = await pipeline.analyze(new Blob(['fake_bytes'], { type: 'image/jpeg' }));

    expect(analysis.source).toBe('food101');
    expect(analysis.topAlternatives?.[0]?.source).toBe('imagenet');
  });
});
