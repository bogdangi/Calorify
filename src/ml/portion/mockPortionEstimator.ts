import type { PortionEstimator, PortionEstimate, DetectedFood, ImageSource } from '../../types/ml';
import { defaultNutritionProvider } from '../nutrition/provider';

export class MockPortionEstimator implements PortionEstimator {
  async estimate(_image: ImageSource, food: DetectedFood): Promise<PortionEstimate> {
    const nutrition = await defaultNutritionProvider.getNutrition(food.foodId);
    const baseServing = nutrition?.defaultServingGrams || 150;

    // Provide realistic slight variation (+/- 10%)
    const varianceFactor = 0.95 + (Math.sin(food.foodId.length) * 0.1);
    const estimatedGrams = Math.round(baseServing * varianceFactor);

    return {
      estimatedGrams,
      confidence: 0.84,
      method: 'volume_heuristic',
    };
  }
}
