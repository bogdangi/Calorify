import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FoodAnalysis, ImageSource } from '../types/ml';
import { ModularVisionPipeline } from '../ml/pipeline/visionPipeline';
import { MockFoodClassifier } from '../ml/classifiers/mockClassifier';
import { OnnxFoodClassifier } from '../ml/classifiers/onnxClassifier';
import { ImageNetClassifier } from '../ml/classifiers/imageNetClassifier';
import { EnsembleClassifier } from '../ml/classifiers/ensembleClassifier';
import type { HeadStep } from '../ml/classifiers/ensembleClassifier';
import { MockFoodDetector } from '../ml/detectors/mockDetector';
import { MockPortionEstimator } from '../ml/portion/mockPortionEstimator';
import { defaultNutritionProvider } from '../ml/nutrition/provider';
import { modelRegistry } from '../ml/core/registry';
import { useSettings } from './useSettings';

export type VisionStatus = 'idle' | 'loading_model' | 'model_ready' | 'analyzing' | 'success' | 'error';

export function useVisionPipeline() {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const [status, setStatus] = useState<VisionStatus>('idle');
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [headSteps, setHeadSteps] = useState<HeadStep[]>([]);

  // Lazy instantiate classifiers based on user selection in settings
  const pipeline = useMemo(() => {
    const isMock = settings.selectedModelId === 'food-classifier-mock';
    const modelDef = modelRegistry.get(settings.selectedModelId) || modelRegistry.get('food-classifier-mock')!;

    const classifier = isMock
      ? new MockFoodClassifier(undefined, 800)
      : new EnsembleClassifier(
          [
            { classifier: new OnnxFoodClassifier(), label: 'Food-101' },
            { classifier: new ImageNetClassifier(), label: 'ImageNet MobileNetV2' },
          ],
          setHeadSteps
        );

    return new ModularVisionPipeline({
      classifier,
      detector: new MockFoodDetector(),
      portionEstimator: new MockPortionEstimator(),
      nutritionProvider: defaultNutritionProvider,
      modelId: modelDef.id,
      modelVersion: modelDef.version,
      isMock: modelDef.isMock ?? true,
      language: i18n.language,
    });
  }, [settings.selectedModelId, i18n.language]);

  const analyzeImage = useCallback(
    async (image: ImageSource): Promise<FoodAnalysis | null> => {
      setStatus('loading_model');
      setErrorMessage(null);
      setHeadSteps([]);

      try {
        pipeline.setLanguage(i18n.language);
        setStatus('analyzing');

        const result = await pipeline.analyze(image);
        setAnalysis(result);
        setStatus('success');
        return result;
      } catch (err: unknown) {
        console.error('Vision analysis error:', err);
        setStatus('error');
        const message = err instanceof Error ? err.message : 'Analysis failed';
        setErrorMessage(message);
        return null;
      }
    },
    [pipeline, i18n.language]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setAnalysis(null);
    setErrorMessage(null);
    setHeadSteps([]);
  }, []);

  return {
    status,
    analysis,
    errorMessage,
    headSteps,
    analyzeImage,
    reset,
  };
}
