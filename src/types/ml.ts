import type { NutritionInfo } from './nutrition';
export type { NutritionInfo };

export type ImageSource = HTMLImageElement | HTMLCanvasElement | ImageData | Blob | File | string;

export interface Detection {
  bbox: [number, number, number, number]; // [x, y, width, height]
  confidence: number;
  label?: string;
}

export interface FoodClassification {
  foodId: string;
  confidence: number;
  rawLabel?: string;
  /** Which head produced this candidate: 'food101' | 'imagenet' | 'heuristic' */
  source?: string;
}

export interface DetectedFood {
  foodId: string;
  confidence: number;
  bbox?: [number, number, number, number];
}

export interface PortionEstimate {
  estimatedGrams: number;
  confidence: number;
  method: 'volume_heuristic' | 'default_serving' | 'depth_regression';
}

export interface FoodAnalysis {
  foodId: string;
  foodName: string;
  confidence: number;
  portionGrams: number;
  calories: number;
  caloriesPer100g: number;
  isMock: boolean;
  modelId: string;
  modelVersion: string;
  inferenceTimeMs: number;
  /** Head that produced the primary prediction (see FoodClassification.source) */
  source?: string;
  topAlternatives?: Array<{
    foodId: string;
    foodName: string;
    confidence: number;
    calories: number;
    source?: string;
  }>;
}

export interface FoodDetector {
  detect(image: ImageSource): Promise<Detection[]>;
}

export interface FoodClassifier {
  classify(image: ImageSource): Promise<FoodClassification[]>;
}

export interface PortionEstimator {
  estimate(image: ImageSource, food: DetectedFood): Promise<PortionEstimate>;
}

export interface NutritionProvider {
  getNutrition(foodId: string, language?: string): Promise<NutritionInfo | null>;
}

export interface VisionPipeline {
  analyze(image: ImageSource): Promise<FoodAnalysis>;
}

export interface ModelDefinition {
  id: string;
  name: string;
  version: string;
  runtime: 'onnx' | 'tensorflowjs' | 'mock';
  sizeMB?: number;
  description: string;
  isMock?: boolean;
}
