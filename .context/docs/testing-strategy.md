# Testing Strategy

Source: TODO.md §22

## Unit-test these functions
calculateDailyCalories · calculateWeeklyCalories · calculateMonthlyCalories · weight change · calories-from-portion.
(§22 also names `calculateAverageCalories`; in the implementation it is embedded inside daily/weekly statistics rather than a standalone export.)

## Scenarios
no meals · one meal · multiple meals · meal editing · meal deletion · weight changes · missing data · timezone/date handling · IndexedDB repositories · import validation · i18n switching.

## ML
Do NOT run real ML models in unit tests. Test the complete pipeline with `MockFoodClassifier` / `MockFoodDetector` / `MockPortionEstimator` (ADR-0010).

## Tooling
`npm ci`, `npm run build`, `npm test` (vitest; fake-indexeddb for repositories).
