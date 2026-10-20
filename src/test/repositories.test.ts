import { describe, it, expect, beforeEach } from 'vitest';
import { CalorifyDatabase } from '../db/indexeddb/db';
import { MealRepository } from '../db/repositories/mealRepository';
import { WeightRepository } from '../db/repositories/weightRepository';
import { SettingsRepository } from '../db/repositories/settingsRepository';

describe('IndexedDB Repositories (fake-indexeddb)', () => {
  let testDb: CalorifyDatabase;
  let mealRepo: MealRepository;
  let weightRepo: WeightRepository;
  let settingsRepo: SettingsRepository;

  beforeEach(async () => {
    // Unique db name for each test run to ensure clean isolation
    const dbName = `calorify_test_${Math.random()}`;
    testDb = new CalorifyDatabase(dbName);
    mealRepo = new MealRepository(testDb);
    weightRepo = new WeightRepository(testDb);
    settingsRepo = new SettingsRepository(testDb);
  });

  it('performs CRUD operations on meals', async () => {
    // 1. Create
    const meal = await mealRepo.create({
      date: '2026-10-20',
      time: '12:00',
      name: 'Salad with Chicken',
      calories: 350,
      mealType: 'lunch',
      source: 'manual',
    });
    expect(meal.id).toBeDefined();
    expect(meal.name).toBe('Salad with Chicken');

    // 2. Read by date
    const dayMeals = await mealRepo.getByDate('2026-10-20');
    expect(dayMeals.length).toBe(1);
    expect(dayMeals[0].id).toBe(meal.id);

    // 3. Update
    const updated = await mealRepo.update(meal.id, { calories: 400 });
    expect(updated.calories).toBe(400);

    const retrieved = await mealRepo.getById(meal.id);
    expect(retrieved?.calories).toBe(400);

    // 4. Delete
    await mealRepo.delete(meal.id);
    const afterDelete = await mealRepo.getById(meal.id);
    expect(afterDelete).toBeUndefined();
  });

  it('performs CRUD operations on weight entries', async () => {
    // Create
    const entry1 = await weightRepo.create({ date: '2026-10-18', weightKg: 75.0 });
    const entry2 = await weightRepo.create({ date: '2026-10-20', weightKg: 74.2 });

    // Read all
    const all = await weightRepo.getAll();
    expect(all.length).toBe(2);

    // Get latest
    const latest = await weightRepo.getLatest();
    expect(latest?.date).toBe('2026-10-20');
    expect(latest?.weightKg).toBe(74.2);

    // Update
    await weightRepo.update(entry2.id, { weightKg: 74.0 });
    const updated = await weightRepo.getByDate('2026-10-20');
    expect(updated?.weightKg).toBe(74.0);

    // Delete
    await weightRepo.delete(entry1.id);
    const afterDelete = await weightRepo.getAll();
    expect(afterDelete.length).toBe(1);
  });

  it('persists and retrieves user settings with language and goal', async () => {
    const initial = await settingsRepo.getSettings();
    expect(initial.id).toBe('current_settings');
    expect(initial.dailyCalorieGoal).toBe(2000);

    const updated = await settingsRepo.saveSettings({
      language: 'uk',
      dailyCalorieGoal: 2300,
    });
    expect(updated.language).toBe('uk');
    expect(updated.dailyCalorieGoal).toBe(2300);

    const refetched = await settingsRepo.getSettings();
    expect(refetched.language).toBe('uk');
    expect(refetched.dailyCalorieGoal).toBe(2300);
  });
});
