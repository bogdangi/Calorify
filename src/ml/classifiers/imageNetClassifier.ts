import type { FoodClassifier, FoodClassification, ImageSource } from '../../types/ml';
import { IMAGENET_TO_FOOD } from './imagenetLabels';
import { decodeImage } from '../core/imageDecode';

/**
 * ImageNet-1k MobileNetV2 produce head for the ensemble.
 *
 * Preprocessing per google/mobilenet_v2_1.0_224 preprocessor_config.json:
 * resize shortest edge to 256, center-crop 224, then (px/255 - 0.5) / 0.5
 * (Keras-style [-1, 1] scaling — NOT the ImageNet mean/std the Food-101
 * head uses).
 *
 * Fails soft: returns [] on any load/inference problem so the ensemble's
 * other head carries the result.
 */
export class ImageNetClassifier implements FoodClassifier {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private session: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ort: any = null;
  private modelUrl: string;
  private isInitializing = false;

  constructor(modelUrl = '/models/mobilenetv2_imagenet.onnx') {
    this.modelUrl = modelUrl;
  }

  async initialize(): Promise<boolean> {
    if (this.session) return true;
    if (this.isInitializing) return false;

    this.isInitializing = true;
    try {
      this.ort = await import('onnxruntime-web');
      // ponytail: single-threaded wasm — ORT's worker chunk statically imports
      // the app entry (rollup shares the CJS require helper), so every spawned
      // pthread worker dies on `document`. Re-enable once the ort chunk is
      // self-contained (manualChunks separating the shared helper).
      this.ort.env.wasm.numThreads = 1;
      const options = {
        executionProviders: ['webgpu', 'wasm'],
        graphOptimizationLevel: 'all',
      };
      this.session = await this.ort.InferenceSession.create(this.modelUrl, options);
      return true;
    } catch (err) {
      console.warn('Could not load ImageNet MobileNetV2 model:', err);
      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  async classify(image: ImageSource): Promise<FoodClassification[]> {
    const initialized = await this.initialize();
    if (!initialized || !this.session || !this.ort) return [];

    try {
      const tensor = await this.preprocessImage(image);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feeds: Record<string, any> = {};
      feeds[this.session.inputNames[0]] = tensor;

      const results = await this.session.run(feeds);
      const outputTensor = results[this.session.outputNames[0]];
      const data = outputTensor.data as Float32Array;

      // Renormalize over the classes we can serve: the raw 1001-way softmax
      // under-scores genuine produce (measured: Granny Smith 0.12 lost to
      // Food-101's forced-choice samosa 0.21 on the same photo), so compare
      // heads on "confidence given it's a food we track".
      const maxVal = Math.max(...data);
      let mappedMass = 0;
      const mapped: Array<{ entry: (typeof IMAGENET_TO_FOOD)[number]; exp: number }> = [];
      for (let i = 0; i < data.length; i++) {
        const entry = IMAGENET_TO_FOOD[i];
        if (!entry) continue;
        const exp = Math.exp(data[i] - maxVal);
        mappedMass += exp;
        mapped.push({ entry, exp });
      }
      if (mappedMass < 0.01) return []; // nothing recognizable as a tracked food
      mapped.sort((a, b) => b.exp - a.exp);

      return mapped.slice(0, 3).map(({ entry, exp }) => ({
        foodId: entry.foodId,
        confidence: Number((exp / mappedMass).toFixed(2)),
        rawLabel: `imagenet:${entry.label}`,
        source: 'imagenet',
      }));
    } catch (err) {
      console.warn('ImageNet head inference failed, skipping head:', err);
      return [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async preprocessImage(image: ImageSource): Promise<any> {
    if (!(image instanceof Blob)) throw new Error('Unsupported image source');
    const { source: src, width, height } = await decodeImage(image);

    const scale = 256 / Math.min(width, height);
    const cropSide = 224 / scale;
    const sx = (width - cropSide) / 2;
    const sy = (height - cropSide) / 2;

    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }
    ctx.drawImage(src, sx, sy, cropSide, cropSide, 0, 0, 224, 224);

    const { data } = ctx.getImageData(0, 0, 224, 224);
    const plane = 224 * 224;
    const float32Data = new Float32Array(3 * plane);

    for (let i = 0; i < plane; i++) {
      float32Data[i] = data[i * 4] / 127.5 - 1;
      float32Data[plane + i] = data[i * 4 + 1] / 127.5 - 1;
      float32Data[2 * plane + i] = data[i * 4 + 2] / 127.5 - 1;
    }

    return new this.ort.Tensor('float32', float32Data, [1, 3, 224, 224]);
  }
}
