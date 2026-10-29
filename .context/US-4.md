📝 User Story: Weight Tracking

Title: Weight Tracking
Feature: Weight diary with history chart and statistics
User Story:
• As a user managing my weight,
• I want to record, edit, and delete weight entries and see my progress over time,
• So that I can follow whether my calorie plan is working.

Status: ✅ Done — `WeightPage.tsx`, `WeightLineChart.tsx`, `weightRepository`.

⚙️ Acceptance Criteria

1. Entries
• Add, edit, and delete weight entries; deletion requires confirmation.
• Fields: id, date, weightKg, createdAt, updatedAt.

2. Display
• Shows current weight, starting weight, change, average, minimum, maximum.
• Chart ranges: 7 days, 30 days, 3 months, All.
