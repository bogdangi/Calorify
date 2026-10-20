import type { FoodClassifier, FoodClassification, ImageSource } from '../../types/ml';

const CANDIDATE_FOODS = [
  'pizza',
  'banana',
  'apple',
  'salad',
  'chicken',
  'rice',
  'pasta',
  'hamburger',
  'french_fries',
  'oatmeal',
  'egg',
  'yogurt',
];

export class MockFoodClassifier implements FoodClassifier {
  private predefinedFoodId?: string;
  private delayMs: number;

  constructor(predefinedFoodId?: string, delayMs = 600) {
    this.predefinedFoodId = predefinedFoodId;
    this.delayMs = delayMs;
  }

  setNextPrediction(foodId: string): void {
    this.predefinedFoodId = foodId;
  }

  async classify(_image: ImageSource): Promise<FoodClassification[]> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }

    const primaryFoodId =
      this.predefinedFoodId ||
      CANDIDATE_FOODS[Math.floor(Math.random() * CANDIDATE_FOODS.length)];

    // Generate high confidence for top result and lower for alternatives
    const topConfidence = 0.82 + Math.random() * 0.12;

    const remaining = CANDIDATE_FOODS.filter((id) => id !== primaryFoodId);
    const alt1 = remaining[Math.floor(Math.random() * remaining.length)];
    const alt2 = remaining.filter((id) => id !== alt1)[0];

    return [
      {
        foodId: primaryFoodId,
        confidence: Number(topConfidence.toFixed(2)),
        rawLabel: `demo:${primaryFoodId}`,
      },
      {
        foodId: alt1,
        confidence: Number(((1 - topConfidence) * 0.65).toFixed(2)),
        rawLabel: `demo:${alt1}`,
      },
      {
        foodId: alt2,
        confidence: Number(((1 - topConfidence) * 0.35).toFixed(2)),
        rawLabel: `demo:${alt2}`,
      },
    ];
  }
}
