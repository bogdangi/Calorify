# Nutrition Database

Source: TODO.md §9, §14

## Shape
```ts
interface FoodNutrition {
  id: string;
  translations: { de: string; uk: string };
  caloriesPer100g: number;
  defaultServingGrams: number;
}
```

## Initial foods (kcal/100g, approximate)
Apple 52 · Banana 89 · Pizza 250 · Rice 130 · Pasta 157 · Chicken 165 · Salad 20 · Hamburger 295 · French fries 312

## Rules
- calories = caloriesPer100g × portionGrams / 100
- Translated names are never identifiers; translated names are never stored as IDs (example: `{ id: "apple", translations: { de: "Apfel", uk: "Яблуко" } }`).
- ML models return IDs, never translated strings (see ADR-0007).
