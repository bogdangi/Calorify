📝 User Story: Calorie Statistics

Title: Statistics
Feature: Daily, weekly, and monthly calorie statistics with lightweight charts
User Story:
• As a calorie-tracking user,
• I want summarized statistics for day, week, and month,
• So that I can understand my eating patterns at a glance.

Status: ✅ Done — `StatisticsPage.tsx`, `CalorieBarChart.tsx`, `utils/calculations.ts`.

⚙️ Acceptance Criteria

1. Daily: total calories, number of meals, average kcal per meal, highest meal, lowest meal.
2. Weekly: total calories, average calories per tracked day, highest day, lowest day, tracked days, simple bar chart.
3. Monthly: total calories, average calories per tracked day, tracked days, average meals/day, weight change.
4. "Average per tracked day" is never confused with "average per calendar day".
5. Charts remain lightweight.
