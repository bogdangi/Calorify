import { expect } from 'vitest';
import { feature, scenario } from '../bdd';
import {
  calculateCalorieRecommendation,
  type CalorieProfile,
  type CalorieRecommendation,
} from '../../utils/calculations';
import type { ActivityLevel, BiologicalSex } from '../../types/settings';

feature('Science-Based Calorie Calculator (US-1)', () => {
  scenario('Calculating calorie target for a moderate-activity male', async ({ given, when, then, and }) => {
    let profile: CalorieProfile;
    let recommendation: CalorieRecommendation | null = null;

    await given('a 30-year-old male weighing 80kg and 180cm tall with moderate activity', () => {
      profile = {
        sex: 'male',
        age: 30,
        heightCm: 180,
        weightKg: 80,
        activityLevel: 'moderate',
      };
    });

    await when('the calorie target recommendation is calculated', () => {
      recommendation = calculateCalorieRecommendation(profile);
    });

    await then('the Basal Metabolic Rate (BMR) is 1,780 kcal', () => {
      expect(recommendation).not.toBeNull();
      expect(recommendation!.bmr).toBe(1780);
    });

    await and('the Total Daily Energy Expenditure (TDEE) is 2,759 kcal', () => {
      expect(recommendation!.tdee).toBe(2759);
    });

    await and('the recommended target is 2,259 kcal with a 500 kcal deficit', () => {
      expect(recommendation!.target).toBe(2259);
      expect(recommendation!.floored).toBe(false);
    });
  });

  scenario('Calculating calorie target for a light-activity female', async ({ given, when, then, and }) => {
    let profile: CalorieProfile;
    let recommendation: CalorieRecommendation | null = null;

    await given('a 30-year-old female weighing 65kg and 170cm tall with light activity', () => {
      profile = {
        sex: 'female',
        age: 30,
        heightCm: 170,
        weightKg: 65,
        activityLevel: 'light',
      };
    });

    await when('the calorie target recommendation is calculated', () => {
      recommendation = calculateCalorieRecommendation(profile);
    });

    await then('the female BMR offset (-161) is applied giving 1,402 kcal', () => {
      expect(recommendation).not.toBeNull();
      expect(recommendation!.bmr).toBe(1402);
    });

    await and('the recommended target is 1,427 kcal', () => {
      expect(recommendation!.tdee).toBe(1927);
      expect(recommendation!.target).toBe(1427);
      expect(recommendation!.floored).toBe(false);
    });
  });

  scenario.outline(
    'Enforcing mandatory health safety floors when mathematical target is too low',
    [
      { sex: 'female' as BiologicalSex, age: 70, heightCm: 150, weightKg: 45, activity: 'sedentary' as ActivityLevel, expectedFloor: 1200 },
      { sex: 'male' as BiologicalSex, age: 75, heightCm: 150, weightKg: 50, activity: 'sedentary' as ActivityLevel, expectedFloor: 1500 },
    ],
    async ({ given, when, then, and }, example) => {
      let profile: CalorieProfile;
      let recommendation: CalorieRecommendation | null = null;

      await given(`a ${example.sex} profile that would mathematically produce an unsafe calorie target`, () => {
        profile = {
          sex: example.sex,
          age: example.age,
          heightCm: example.heightCm,
          weightKg: example.weightKg,
          activityLevel: example.activity,
        };
      });

      await when('the calorie target recommendation is calculated', () => {
        recommendation = calculateCalorieRecommendation(profile);
      });

      await then(`the target is automatically capped at the ${example.expectedFloor} kcal safety floor`, () => {
        expect(recommendation).not.toBeNull();
        expect(recommendation!.target).toBe(example.expectedFloor);
      });

      await and('the recommendation indicates the floor was triggered', () => {
        expect(recommendation!.floored).toBe(true);
      });
    }
  );

  scenario('Incomplete or invalid profiles return null without throwing', async ({ given, when, then }) => {
    let incompleteProfiles: CalorieProfile[];
    let results: (CalorieRecommendation | null)[] = [];

    await given('various incomplete or invalid user profiles', () => {
      incompleteProfiles = [
        { sex: null, age: 30, heightCm: 180, weightKg: 80, activityLevel: 'moderate' },
        { sex: 'male', age: null, heightCm: 180, weightKg: 80, activityLevel: 'moderate' },
        { sex: 'male', age: 30, heightCm: null, weightKg: 80, activityLevel: 'moderate' },
        { sex: 'male', age: 30, heightCm: 180, weightKg: null, activityLevel: 'moderate' },
        { sex: 'male', age: 30, heightCm: 180, weightKg: 80, activityLevel: null },
        { sex: 'male', age: -5, heightCm: 180, weightKg: 80, activityLevel: 'moderate' },
        { sex: 'male', age: 30, heightCm: 180, weightKg: 0, activityLevel: 'moderate' },
      ];
    });

    await when('each profile is evaluated', () => {
      results = incompleteProfiles.map(calculateCalorieRecommendation);
    });

    await then('every invalid profile safely returns null', () => {
      for (const result of results) {
        expect(result).toBeNull();
      }
    });
  });
});

