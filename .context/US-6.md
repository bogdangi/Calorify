📝 User Story: Nutrition Database & Food Labels

Title: Nutrition Database & Food Labels
Feature: Small local nutrition DB keyed by language-independent food IDs with de/uk translations
User Story:
• As a food-logging user (German or Ukrainian speaking),
• I want calorie values per 100 g with default portions and names in my language,
• So that calorie math stays language-independent and localized only in the UI.

Status: ✅ Done — `src/ml/nutrition/database.ts` (18 foods) + `provider.ts`.

⚙️ Acceptance Criteria

1. Data
• `FoodNutrition`: id, translations {de, uk}, caloriesPer100g, defaultServingGrams.
• Initial foods include: Apple 52, Banana 89, Pizza 250, Rice 130, Pasta 157, Chicken 165, Salad 20, Hamburger 295, French fries 312 (kcal/100g, approximate).
• Calories = caloriesPer100g × portionGrams / 100.

2. Labels
• ML models return food IDs, never translated strings.
• Translated names are never used as identifiers (e.g. `apple` → Apfel / Яблуко).
