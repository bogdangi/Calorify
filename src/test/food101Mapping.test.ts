import { describe, it, expect } from 'vitest';
import { FOOD101_CLASSES, FOOD101_TO_FOOD_ID } from '../ml/classifiers/food101Labels';
import { FOOD_DATABASE } from '../ml/nutrition/database';

/**
 * Guards the real-model contract: torchvision Food101 sorts class names
 * alphabetically to get label indices, and every model output must resolve
 * to a nutrition-database entry — otherwise the pipeline falls back or
 * mislabels calories.
 */
describe('Food-101 mapping contract', () => {
  it('has 101 unique classes in Food-101 classes.txt order', () => {
    expect(FOOD101_CLASSES).toHaveLength(101);
    expect(new Set(FOOD101_CLASSES).size).toBe(101);
    // Order contract: indices follow Food-101 meta/classes.txt (verified against
    // a labeled validation photo; the sorted-alphabetical order misclassifies).
    expect(FOOD101_CLASSES[0]).toBe('apple_pie');
    expect(FOOD101_CLASSES).not.toEqual([...FOOD101_CLASSES].sort());
  });

  it('maps every Food-101 class to an existing nutrition entry', () => {
    const ids = new Set(FOOD_DATABASE.map((f) => f.id));
    for (const label of FOOD101_CLASSES) {
      const foodId = FOOD101_TO_FOOD_ID[label];
      expect(foodId, `no foodId for Food-101 class ${label}`).toBeDefined();
      expect(ids.has(foodId), `${label} -> ${foodId} missing in FOOD_DATABASE`).toBe(true);
    }
  });

  it('foodDatabase entries have names, positive calories and servings', () => {
    for (const f of FOOD_DATABASE) {
      expect(f.translations.de.trim(), f.id).not.toBe('');
      expect(f.translations.uk.trim(), f.id).not.toBe('');
      expect(f.caloriesPer100g, f.id).toBeGreaterThan(0);
      expect(f.defaultServingGrams, f.id).toBeGreaterThan(0);
    }
  });
});
