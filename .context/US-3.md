📝 User Story: Today Diary & Meal Tracking

Title: Today Diary & Meal Tracking
Feature: Daily calorie diary with manual add/edit/delete of meals
User Story:
• As a calorie-tracking user,
• I want to see today's calories and add, edit, and delete meals manually,
• So that I can reliably log what I eat every day.

Status: ✅ Done — `TodayPage.tsx`, `MealFormModal.tsx`, `MealItem.tsx`, `mealRepository`.

⚙️ Acceptance Criteria

1. Today view
• Shows current date, calories consumed, daily calorie goal, remaining calories.
• Meals grouped by meal type or time (breakfast / lunch / dinner / snack).
• Quick "Add Food" and "Estimate from Photo" buttons; optionally today's weight.

2. Meal data model
• Language-independent IDs, stable UUIDs; fields: date (YYYY-MM-DD), time (HH:mm), name, amount, amountUnit (g/ml/portion/piece), calories, mealType, source (manual/vision), optional visionPrediction, createdAt/updatedAt.
• Every meal supports add, edit, delete.
