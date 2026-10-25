# Data Model

Source: TODO.md §6, §7, §18

## MealEntry
```ts
interface MealEntry {
  id: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  name: string;
  amount?: number;
  amountUnit?: "g" | "ml" | "portion" | "piece";
  calories: number;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  source: "manual" | "vision";
  visionPrediction?: VisionPrediction;
  createdAt: string;
  updatedAt: string;
}
```
Language-independent IDs and stable UUIDs. Every meal supports add/edit/delete. Use local calendar dates correctly; avoid timezone bugs.

## WeightEntry
```ts
interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  createdAt: string;
  updatedAt: string;
}
```
Add/edit/delete with confirmation before deletion.

## Export schema (v1)
```json
{ "version": 1, "exportedAt": "...", "meals": [], "weights": [], "settings": {} }
```
