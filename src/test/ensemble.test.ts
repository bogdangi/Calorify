import { describe, it, expect } from 'vitest';
import { EnsembleClassifier } from '../ml/classifiers/ensembleClassifier';
import type { HeadStep } from '../ml/classifiers/ensembleClassifier';
import type { FoodClassifier, FoodClassification, ImageSource } from '../types/ml';

const stubHead = (result: FoodClassification[] | Error): FoodClassifier => ({
  classify: () =>
    result instanceof Error ? Promise.reject(result) : Promise.resolve(result),
});

const noImage = null as unknown as ImageSource;

describe('EnsembleClassifier max-score merge', () => {
  it('shows the highest-scoring candidate across heads', async () => {
    const ensemble = new EnsembleClassifier([
      {
        classifier: stubHead([
          { foodId: 'apple', confidence: 0.6, source: 'food101' },
          { foodId: 'pizza', confidence: 0.5, source: 'food101' },
        ]),
        label: 'Food-101',
      },
      {
        classifier: stubHead([
          { foodId: 'orange', confidence: 0.9, source: 'imagenet' },
          { foodId: 'apple', confidence: 0.5, source: 'imagenet' },
        ]),
        label: 'ImageNet',
      },
    ]);

    expect(await ensemble.classify(noImage)).toEqual([
      { foodId: 'orange', confidence: 0.9, source: 'imagenet' },
      { foodId: 'apple', confidence: 0.6, source: 'food101' },
      { foodId: 'pizza', confidence: 0.5, source: 'food101' },
    ]);
  });

  it('keeps the surviving head when one head fails', async () => {
    const ensemble = new EnsembleClassifier([
      { classifier: stubHead(new Error('model failed to load')), label: 'A' },
      { classifier: stubHead([{ foodId: 'broccoli', confidence: 0.7 }]), label: 'B' },
    ]);

    expect(await ensemble.classify(noImage)).toEqual([
      { foodId: 'broccoli', confidence: 0.7 },
    ]);
  });

  it('caps the merged list at three candidates', async () => {
    const ensemble = new EnsembleClassifier([
      {
        classifier: stubHead([
          { foodId: 'a', confidence: 0.4 },
          { foodId: 'b', confidence: 0.3 },
          { foodId: 'c', confidence: 0.2 },
        ]),
        label: 'A',
      },
      {
        classifier: stubHead([
          { foodId: 'd', confidence: 0.9 },
          { foodId: 'e', confidence: 0.8 },
          { foodId: 'f', confidence: 0.1 },
        ]),
        label: 'B',
      },
    ]);

    const result = await ensemble.classify(noImage);
    expect(result).toHaveLength(3);
    expect(result.map((c) => c.foodId)).toEqual(['d', 'e', 'a']);
  });

  it('returns empty only when every head fails or returns nothing', async () => {
    const ensemble = new EnsembleClassifier([
      { classifier: stubHead(new Error('boom')), label: 'A' },
      { classifier: stubHead([]), label: 'B' },
    ]);

    expect(await ensemble.classify(noImage)).toEqual([]);
  });

  it('runs heads strictly one after another (ORT has a single global run lock)', async () => {
    const order: string[] = [];
    const trackingHead = (name: string): FoodClassifier => ({
      classify: async () => {
        order.push(`${name}:start`);
        await new Promise((resolve) => setTimeout(resolve, 5));
        order.push(`${name}:end`);
        return [];
      },
    });

    const ensemble = new EnsembleClassifier([
      { classifier: trackingHead('a'), label: 'A' },
      { classifier: trackingHead('b'), label: 'B' },
    ]);
    await ensemble.classify(noImage);

    expect(order).toEqual(['a:start', 'a:end', 'b:start', 'b:end']);
  });

  it('emits a progress snapshot per step transition', async () => {
    const snapshots: HeadStep[][] = [];
    const ensemble = new EnsembleClassifier(
      [
        { classifier: stubHead([{ foodId: 'x', confidence: 0.5 }]), label: 'One' },
        { classifier: stubHead(new Error('boom')), label: 'Two' },
      ],
      (steps) => snapshots.push(steps)
    );

    await ensemble.classify(noImage);

    expect(snapshots.map((s) => s.map((step) => step.status))).toEqual([
      ['running', 'pending'],
      ['done', 'pending'],
      ['done', 'running'],
      ['done', 'failed'],
    ]);
    expect(snapshots[2][0].ms).toBeGreaterThanOrEqual(0);
    expect(snapshots[2][0].label).toBe('One');
    expect(snapshots[3][1].status).toBe('failed');
  });
});
