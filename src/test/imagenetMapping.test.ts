import { describe, it, expect } from 'vitest';
import { IMAGENET_TO_FOOD } from '../ml/classifiers/imagenetLabels';
import { FOOD_DATABASE } from '../ml/nutrition/database';

/**
 * Guards the ImageNet head contract: output indices come from
 * onnx-community/mobilenet_v2_1.0_224 config.id2label (0 = background,
 * then ImageNet-1k order) and every mapped index must resolve to a
 * nutrition-database entry or the pipeline shows a raw id as the name.
 */
describe('ImageNet label mapping contract', () => {
  it('maps every index to an existing nutrition entry', () => {
    const ids = new Set(FOOD_DATABASE.map((f) => f.id));
    for (const [idx, entry] of Object.entries(IMAGENET_TO_FOOD)) {
      expect(ids.has(entry.foodId), `${idx} -> ${entry.foodId} missing in FOOD_DATABASE`).toBe(
        true
      );
      expect(entry.label.trim()).not.toBe('');
    }
  });

  it('covers the produce test set and shared dish classes', () => {
    expect(IMAGENET_TO_FOOD[938]?.foodId).toBe('broccoli');
    expect(IMAGENET_TO_FOOD[949]?.foodId).toBe('apple');
    expect(IMAGENET_TO_FOOD[951]?.foodId).toBe('orange');
    expect(IMAGENET_TO_FOOD[955]?.foodId).toBe('banana');
    expect(IMAGENET_TO_FOOD[964]?.foodId).toBe('pizza');
  });

  it('keeps indices inside the model output range (0..1000)', () => {
    for (const idx of Object.keys(IMAGENET_TO_FOOD)) {
      const n = Number(idx);
      expect(Number.isInteger(n) && n >= 0 && n <= 1000).toBe(true);
    }
    expect(Object.keys(IMAGENET_TO_FOOD).length).toBeGreaterThanOrEqual(15);
  });
});
