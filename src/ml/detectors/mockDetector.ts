import type { FoodDetector, Detection, ImageSource } from '../../types/ml';

export class MockFoodDetector implements FoodDetector {
  async detect(_image: ImageSource): Promise<Detection[]> {
    // Simulated bounding box around center of plate
    return [
      {
        bbox: [0.15, 0.15, 0.7, 0.7],
        confidence: 0.91,
        label: 'food_dish',
      },
    ];
  }
}
