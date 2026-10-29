import type {
  VisionPipeline,
  FoodClassifier,
  FoodDetector,
  PortionEstimator,
  NutritionProvider,
  FoodAnalysis,
  ImageSource,
} from '../../types/ml';
import { MockFoodClassifier } from '../classifiers/mockClassifier';
import { MockFoodDetector } from '../detectors/mockDetector';
import { MockPortionEstimator } from '../portion/mockPortionEstimator';
import { defaultNutritionProvider } from '../nutrition/provider';
import { calculateCaloriesFromPortion } from '../../utils/calculations';

export interface VisionPipelineOptions {
  classifier?: FoodClassifier;
  detector?: FoodDetector;
  portionEstimator?: PortionEstimator;
  nutritionProvider?: NutritionProvider;
  modelId?: string;
  modelVersion?: string;
  isMock?: boolean;
  language?: string;
}

export class ModularVisionPipeline implements VisionPipeline {
  private classifier: FoodClassifier;
  private detector: FoodDetector;
  private portionEstimator: PortionEstimator;
  private nutritionProvider: NutritionProvider;
  private modelId: string;
  private modelVersion: string;
  private isMock: boolean;
  private language: string;

  constructor(options: VisionPipelineOptions = {}) {
    this.classifier = options.classifier || new MockFoodClassifier();
    this.detector = options.detector || new MockFoodDetector();
    this.portionEstimator = options.portionEstimator || new MockPortionEstimator();
    this.nutritionProvider = options.nutritionProvider || defaultNutritionProvider;
    this.modelId = options.modelId || 'food-classifier-mock';
    this.modelVersion = options.modelVersion || '1.0.0';
    this.isMock = options.isMock !== undefined ? options.isMock : true;
    this.language = options.language || 'de';
  }

  setLanguage(language: string): void {
    this.language = language;
  }

  setClassifier(classifier: FoodClassifier, modelId: string, modelVersion: string, isMock: boolean): void {
    this.classifier = classifier;
    this.modelId = modelId;
    this.modelVersion = modelVersion;
    this.isMock = isMock;
  }

  async analyze(image: ImageSource): Promise<FoodAnalysis> {
    const startTime = performance.now();

    // 1. Stage: Food Detection (Optional / Plate localization)
    const detections = await this.detector.detect(image);
    const primaryDetectionBbox = detections.length > 0 ? detections[0].bbox : undefined;

    // 2. Stage: Food Classification
    const classifications = await this.classifier.classify(image);
    if (!classifications || classifications.length === 0) {
      throw new Error('No food detected in image');
    }

    const primaryPrediction = classifications[0];
    const foodId = primaryPrediction.foodId;

    // 3. Stage: Portion Estimation
    const portion = await this.portionEstimator.estimate(image, {
      foodId,
      confidence: primaryPrediction.confidence,
      bbox: primaryDetectionBbox,
    });

    // 4. Stage: Nutrition lookup & Calorie calculation
    const nutrition = await this.nutritionProvider.getNutrition(foodId, this.language);
    const caloriesPer100g = nutrition?.caloriesPer100g || 100;
    const foodName = nutrition?.name || foodId;
    const portionGrams = portion.estimatedGrams;
    const calories = calculateCaloriesFromPortion(caloriesPer100g, portionGrams);

    // 5. Gather top alternative suggestions
    const topAlternatives: FoodAnalysis['topAlternatives'] = [];
    for (let i = 1; i < classifications.length; i++) {
      const alt = classifications[i];
      const altNutrition = await this.nutritionProvider.getNutrition(alt.foodId, this.language);
      if (altNutrition) {
        topAlternatives.push({
          foodId: alt.foodId,
          foodName: altNutrition.name,
          confidence: alt.confidence,
          calories: calculateCaloriesFromPortion(altNutrition.caloriesPer100g, portionGrams),
          source: alt.source,
        });
      }
    }

    const inferenceTimeMs = Math.round(performance.now() - startTime);

    return {
      foodId,
      foodName,
      confidence: primaryPrediction.confidence,
      portionGrams,
      calories,
      caloriesPer100g,
      isMock: this.isMock,
      modelId: this.modelId,
      modelVersion: this.modelVersion,
      inferenceTimeMs,
      source: primaryPrediction.source,
      topAlternatives,
    };
  }
}

export const defaultVisionPipeline = new ModularVisionPipeline();
