import type { ModelDefinition } from '../../types/ml';

export const AVAILABLE_MODELS: ModelDefinition[] = [
  {
    id: 'food-classifier-mock',
    name: 'Demo Vision Classifier (Mock)',
    version: '1.0.0',
    runtime: 'mock',
    sizeMB: 0.1,
    description: 'Instant local on-device demonstration model for simulated food recognition.',
    isMock: true,
  },
  {
    id: 'food-classifier-onnx',
    name: 'MobileNetV2 Vision Classifier (ONNX)',
    version: '2.1.0',
    runtime: 'onnx',
    sizeMB: 3.4,
    description: 'Quantized MobileNetV2 food-mapped classifier running locally via WebGPU/WASM.',
    isMock: false,
  },
];

export class ModelRegistry {
  private models: Map<string, ModelDefinition> = new Map();

  constructor(initialModels: ModelDefinition[] = AVAILABLE_MODELS) {
    for (const m of initialModels) {
      this.models.set(m.id, m);
    }
  }

  getAll(): ModelDefinition[] {
    return Array.from(this.models.values());
  }

  get(id: string): ModelDefinition | undefined {
    return this.models.get(id);
  }

  register(model: ModelDefinition): void {
    this.models.set(model.id, model);
  }
}

export const modelRegistry = new ModelRegistry();
