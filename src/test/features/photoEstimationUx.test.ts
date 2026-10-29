import { feature, scenario } from '../bdd';
import { createVisionSteps } from '../steps/visionSteps';

feature('Photo Estimation UX & User Confirmation (US-8, ADR-0011)', () => {
  scenario('Photos are analyzed but require explicit user confirmation before saving to the diary', async ({
    given,
    when,
    then,
    and,
  }) => {
    const steps = createVisionSteps();

    await given('the vision pipeline is initialized for "pizza"', () => {
      steps.givenVisionPipelineFor('pizza', 'de');
    });

    await and('the user captures a photo of their meal', () => {
      steps.givenPhotoOfMeal('delicious_pizza');
    });

    await when('the photo is processed by the vision pipeline', async () => {
      await steps.whenPhotoIsAnalyzed();
    });

    await then('the system identifies the food as "Pizza"', () => {
      steps.thenSuggestedFoodIs('Pizza');
      steps.thenSuggestedCaloriesAreGreaterThan(500);
    });

    await and('no meal entry is written to IndexedDB yet', async () => {
      await steps.thenDiaryDoesNotContain('Pizza');
    });

    await when('the user reviews and confirms the suggested meal with 250g', async () => {
      await steps.whenUserConfirmsEstimate({ portionGrams: 250 });
    });

    await then('the confirmed meal is saved into the user diary', async () => {
      await steps.thenMealIsPersistedInDiary('Pizza', 625);
    });
  });

  scenario('User can adjust the portion size before confirming', async ({
    given,
    when,
    then,
  }) => {
    const steps = createVisionSteps();

    await given('a vision analysis that suggests an apple (52 kcal / 100g)', () => {
      steps.givenVisionPipelineFor('apple', 'de');
      steps.givenPhotoOfMeal('apple_on_table');
    });

    await when('the photo is analyzed', async () => {
      await steps.whenPhotoIsAnalyzed();
    });

    await then('the default prediction is "Apfel"', () => {
      steps.thenSuggestedFoodIs('Apfel');
    });

    await when('the user adjusts the portion down to 100g instead of the default', async () => {
      await steps.whenUserConfirmsEstimate({ portionGrams: 100 });
    });

    await then('the diary stores the meal with the adjusted portion calories (52 kcal)', async () => {
      await steps.thenMealIsPersistedInDiary('Apfel', 52);
    });
  });

  scenario('Internationalization translates food suggestions according to current language', async ({
    given,
    when,
    then,
  }) => {
    const steps = createVisionSteps();

    await given('the user interface is set to Ukrainian (uk)', () => {
      steps.givenVisionPipelineFor('pizza', 'uk');
      steps.givenPhotoOfMeal('pizza');
    });

    await when('the user analyzes a meal photo', async () => {
      await steps.whenPhotoIsAnalyzed();
    });

    await then('the suggested food name is translated into Ukrainian ("Піца")', () => {
      steps.thenSuggestedFoodIs('Піца');
    });
  });
});
