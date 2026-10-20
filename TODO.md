# Build a Local-First Calorie Tracker PWA with On-Device Computer Vision

You are working on an existing repository. Your task is to build or extend it into a polished, production-quality **mobile-first calorie tracking PWA**.

The app must support **German (`de`) and Ukrainian (`uk`)** and demonstrate **multiple ML models running entirely on-device in the browser** to estimate food and calories from photos.

## 1. First: Inspect the Existing Repository

Before changing anything:

* Inspect the existing project structure.
* Identify the current framework, build system, package manager, PWA setup, tests, Firebase configuration, and GitHub Actions.
* Reuse the existing architecture where reasonable.
* Do not unnecessarily rewrite the project.
* Preserve existing working functionality.
* Make sure `npm ci` and `npm run build` continue to work.

The existing Firebase Hosting deployment must remain compatible with the current GitHub Actions workflows.

Firebase project:

```text
loops-793a8
```

Firebase is used **only for static hosting/deployment**.

There is:

* no backend
* no API
* no Firestore
* no Firebase Authentication
* no Firebase Storage
* no cloud database
* no user-data synchronization

All user-generated data must remain on the user's device.

---

# 2. Core Product Principle

This is a **local-first application**.

The single source of truth for user data is **IndexedDB**.

Use Dexie if appropriate.

Store locally:

* meals
* calories
* weight entries
* settings
* language preference
* user preferences
* optional locally persisted ML metadata
* anything else created by the user

Do **not** send user data to a server.

Food photos must remain local.

Preferred photo flow:

```text
Camera / Gallery
      ↓
Browser memory
      ↓
On-device ML
      ↓
Food prediction
      ↓
Portion estimation
      ↓
Nutrition lookup
      ↓
Calorie estimate
      ↓
User confirmation
      ↓
Meal stored in IndexedDB
      ↓
Original photo can be discarded
```

Do not upload photos.

Do not introduce cloud synchronization.

Because there is no backend, provide:

* Export data
* Import data

as a local JSON backup mechanism.

---

# 3. Main Goal

Build a simple calorie diary where the user can:

1. See today's calories.
2. Add food manually.
3. Take/select a food photo.
4. Run computer vision locally.
5. Get an approximate food prediction.
6. Estimate portion/calories.
7. Confirm or edit the result.
8. Save the meal locally.
9. Track weight.
10. View statistics.
11. Use the entire application offline.
12. Switch between German and Ukrainian.

The computer-vision functionality is intentionally approximate.

Never present calorie estimates as medically accurate.

Always communicate that vision-based calorie estimation is an approximation.

---

# 4. Technology

Prefer:

* React
* TypeScript
* Vite
* PWA
* IndexedDB
* Dexie
* `react-i18next` / `i18next`
* ONNX Runtime Web and/or TensorFlow.js
* WebGPU when available
* WASM fallback

However, first inspect the existing repository and use its existing stack when practical.

Do not introduce unnecessary dependencies.

---

# 5. UI Structure

Use a clean, modern, mobile-first design.

Bottom navigation:

```text
Today
Statistics
Weight
Settings
```

## Today

Display:

* current date
* calories consumed
* daily calorie goal
* remaining calories
* meals grouped by meal type or time
* quick "Add Food"
* "Estimate from Photo"
* optionally today's weight

Example:

```text
Today
20 October

1,240 / 2,000 kcal

760 kcal remaining

Breakfast
  Banana          105 kcal
  Coffee           20 kcal

Lunch
  Chicken         420 kcal

[ + Add Food ]
[ 📷 Estimate from Photo ]
```

Keep the interaction simple.

---

# 6. Meal Data Model

Use language-independent IDs and stable UUIDs.

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

Every meal must support:

* add
* edit
* delete

Use local calendar dates correctly. Avoid timezone bugs.

---

# 7. Weight Tracking

```ts
interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  createdAt: string;
  updatedAt: string;
}
```

Support:

* add
* edit
* delete
* confirmation before deletion

Display:

* current weight
* starting weight
* change
* average
* minimum
* maximum

Chart ranges:

```text
7 days
30 days
3 months
All
```

---

# 8. Statistics

Provide:

```text
Day
Week
Month
```

## Daily

Show:

* total calories
* number of meals
* average kcal per meal
* highest meal
* lowest meal

## Weekly

Show:

* total calories
* average calories per tracked day
* highest day
* lowest day
* tracked days
* simple bar chart

## Monthly

Show:

* total calories
* average calories per tracked day
* tracked days
* average meals/day
* weight change

Important:

Do not confuse:

```text
average per tracked day
```

with:

```text
average per calendar day
```

Use lightweight charts.

---

# 9. Nutrition Database

Create a small local nutrition database.

```ts
interface FoodNutrition {
  id: string;

  translations: {
    de: string;
    uk: string;
  };

  caloriesPer100g: number;
  defaultServingGrams: number;
}
```

Initial examples:

```text
Apple       52 kcal/100g
Banana      89
Pizza       250
Rice        130
Pasta       157
Chicken     165
Salad       20
Hamburger   295
French fries 312
```

Values are approximate.

Use the calculation:

```text
calories =
  caloriesPer100g * portionGrams / 100
```

Do not store translated names as identifiers.

Example:

```ts
{
  id: "apple",
  translations: {
    de: "Apfel",
    uk: "Яблуко"
  }
}
```

---

# 10. On-Device ML Architecture

The ML architecture is a major part of this project.

Do NOT build a single monolithic:

```text
photo → calories
```

model.

Instead build replaceable stages:

```text
Photo
  ↓
Food Detection / Classification
  ↓
Food Identification
  ↓
Portion Estimation
  ↓
Local Nutrition Database
  ↓
Calorie Calculation
  ↓
User Confirmation
  ↓
Meal Diary
```

Create independent interfaces.

```ts
interface FoodDetector {
  detect(image: ImageSource): Promise<Detection[]>;
}

interface FoodClassifier {
  classify(image: ImageSource): Promise<FoodClassification[]>;
}

interface PortionEstimator {
  estimate(
    image: ImageSource,
    food: DetectedFood
  ): Promise<PortionEstimate>;
}

interface NutritionProvider {
  getNutrition(foodId: string): Promise<NutritionInfo>;
}

interface VisionPipeline {
  analyze(image: ImageSource): Promise<FoodAnalysis>;
}
```

Use dependency injection so each model can be replaced independently.

---

# 11. Model Registry

Create a model registry.

```ts
interface ModelDefinition {
  id: string;
  name: string;
  version: string;
  runtime: "onnx" | "tensorflowjs";
  sizeMB?: number;
}
```

Models should be loaded lazily.

Do not load ML models at application startup.

Only load them when the user selects:

```text
Estimate from Photo
```

Cache models locally where practical.

Show:

* Loading model...
* Model ready
* Analysis in progress
* Error state

Do not block the rest of the application if ML fails.

Manual food entry must always work.

---

# 12. MVP ML Strategy

Do not over-engineer the first version.

Implement the architecture so the model can evolve.

Recommended progression:

### V1

```text
Photo
 ↓
Mock classifier
 ↓
Nutrition DB
 ↓
Default portion
 ↓
Calories
```

### V2

```text
Photo
 ↓
Real lightweight food classifier
 ↓
Nutrition DB
 ↓
Default portion
 ↓
Calories
```

### V3

```text
Photo
 ↓
Food detector
 ↓
Food classifier
 ↓
Portion estimator
 ↓
Nutrition DB
 ↓
Calories
```

### V4

```text
Photo
 ↓
Segmentation
 ↓
Multiple foods
 ↓
Per-food portion estimation
 ↓
Nutrition DB
 ↓
Total calories
```

For the first real model, prefer a lightweight browser-compatible model such as:

* MobileNet
* EfficientNet-Lite
* small Food-101-derived classifier
* another compact ONNX/TensorFlow.js model

Choose based on browser compatibility and repository constraints.

Do not download a huge model unnecessarily.

---

# 13. Mock ML Implementation

The mock implementation must use exactly the same interfaces as the real model.

For example:

```text
MockFoodClassifier
MockPortionEstimator
```

This allows the UI and pipeline to be developed before the real model is available.

Clearly label mock results:

```text
Demo prediction
```

The UI must not need to change when the real model is introduced.

---

# 14. Food Labels

Use language-independent food IDs.

```ts
interface FoodLabel {
  id: string;

  translations: {
    de: string;
    uk: string;
  };
}
```

Examples:

```text
apple  → Apfel / Яблуко
banana → Banane / Банан
pizza  → Pizza / Піца
```

ML models should return IDs rather than translated strings.

---

# 15. Photo UX

Provide:

```text
Take photo
Choose from gallery
```

After selecting a photo:

```text
Analyzing locally...
```

Then display:

```text
Detected food:
Pizza

Confidence:
82%

Estimated portion:
250 g

Estimated calories:
625 kcal

Approximate estimate
```

Actions:

```text
Add to diary
Edit
Try again
```

The user MUST confirm the result before the meal is created.

Never automatically add an ML prediction to the diary.

---

# 16. Privacy

This application should be explicitly privacy-friendly.

Never:

* upload photos
* send meal data to a backend
* send weight data to a backend
* use Firebase Firestore
* use Firebase Storage
* use Firebase Authentication
* implement cloud synchronization

The application should be able to function without a network connection after installation.

---

# 17. PWA

Implement:

* Web App Manifest
* Service Worker
* installability
* offline caching
* app icons
* offline application shell
* cached application assets

Core functionality must work offline:

* add meals
* edit meals
* delete meals
* add weight
* edit weight
* delete weight
* statistics
* settings

ML models may require an initial download unless already cached.

Cache models locally after downloading when practical.

---

# 18. Export / Import

Because there is no server, local backup is important.

Settings should contain:

```text
Export data
Import data
```

Export format:

```json
{
  "version": 1,
  "exportedAt": "...",
  "meals": [],
  "weights": [],
  "settings": {}
}
```

Requirements:

* validate imported JSON
* validate schema
* reject malformed data
* do not overwrite existing data accidentally
* provide clear success/error messages
* preserve IDs and timestamps where appropriate

---

# 19. Internationalization

Support:

```text
German: de
Ukrainian: uk
```

Default language:

```text
German
```

First launch:

```text
saved preference
    ↓
browser language
    ↓
German fallback
```

Language selection must be available in Settings.

Changing language should happen immediately and be persisted locally.

Use:

```text
src/i18n/
  index.ts
  locales/
    de.ts
    uk.ts
```

Never hard-code user-facing text inside React components.

Translate:

* navigation
* buttons
* forms
* errors
* validation
* empty states
* statistics
* charts
* dialogs
* settings
* ML messages
* camera UI
* import/export
* accessibility labels
* PWA instructions

Use:

```ts
Intl.DateTimeFormat
Intl.NumberFormat
```

for locale-aware formatting.

Internally use:

```text
kg
g
ml
kcal
```

and localize presentation.

Meal types must remain language-independent:

```text
breakfast
lunch
dinner
snack
```

Translations happen only in the UI.

---

# 20. Settings

Include:

* language
* daily calorie goal
* export data
* import data
* ML/model information
* privacy information
* app version

Do not provide complex medical recommendations.

---

# 21. Accessibility

Implement:

* semantic HTML
* keyboard accessibility
* accessible labels
* sufficient touch target sizes
* screen-reader-friendly controls
* translated accessibility text
* visible focus states
* proper dialog behavior

---

# 22. Testing

Add tests for:

```text
calculateDailyCalories
calculateWeeklyCalories
calculateMonthlyCalories
calculateAverageCalories
calculateWeightChange
calculateCaloriesFromPortion
```

Test:

* no meals
* one meal
* multiple meals
* meal editing
* meal deletion
* weight changes
* missing data
* timezone/date handling
* IndexedDB repositories
* import validation
* i18n switching

For ML:

Do NOT run the real ML model in every unit test.

Use mocked implementations:

```text
MockFoodClassifier
MockFoodDetector
MockPortionEstimator
```

Test the complete pipeline using mocks.

Also test:

```text
npm ci
npm run build
```

---

# 23. Architecture

Adapt this structure to the existing repository rather than blindly replacing it:

```text
src/
  app/

  components/

  pages/

  features/
    meals/
    weight/
    statistics/
    settings/
    vision/

  db/
    indexeddb/
    repositories/

  ml/
    core/
    models/
    classifiers/
    detectors/
    portion/
    nutrition/
    pipeline/

  i18n/
    locales/
      de.ts
      uk.ts

  hooks/

  types/

  utils/
```

Keep business logic outside UI components.

Use repositories/services for IndexedDB access.

Keep ML abstractions independent of React.

---

# 24. Firebase Hosting

Firebase is only the deployment target.

Keep the existing Firebase Hosting configuration and GitHub Actions unless changes are genuinely necessary.

Existing project:

```text
loops-793a8
```

Production workflow:

```yaml
name: Deploy to Firebase Hosting on merge

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - run: npm ci && npm run build

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_LOOPS_793A8 }}
          channelId: live
          projectId: loops-793a8
```

PR workflow should continue to deploy preview channels.

Do not commit service-account credentials.

Do not introduce Firebase runtime SDK unless the existing application genuinely requires it.

---

# 25. Performance

The application should feel fast on mobile devices.

Requirements:

* lazy-load ML code
* lazy-load ML models
* avoid unnecessary React renders
* use IndexedDB efficiently
* keep bundle size reasonable
* avoid blocking the main thread
* prefer WebGPU when available
* fallback to WASM
* show progress during model loading/inference

Where practical, run expensive ML inference in a Web Worker.

Measure inference time in development/debug mode.

Do not clutter normal user experience with technical metrics.

---

# 26. Error Handling

Gracefully handle:

* camera unavailable
* permission denied
* unsupported browser
* ML model loading failure
* ML inference failure
* invalid imported JSON
* IndexedDB errors
* offline state
* insufficient model confidence

Example:

```text
We couldn't recognize the food.
Please try another photo or enter the food manually.
```

Always provide a manual fallback.

---

# 27. Important UX Principle

The vision system is an assistant, not an authority.

The user should always be able to change:

* food
* portion
* calories
* meal type
* time

before saving.

Use language such as:

```text
Approximate estimate
```

rather than:

```text
Exact calories
```

---

# 28. Implementation Order

Implement in this order:

### Phase 1 — Repository inspection

Understand the existing application before modifying it.

### Phase 2 — Foundation

Implement:

* IndexedDB
* repositories
* meal model
* weight model
* settings
* Today page
* manual meal entry

### Phase 3 — Statistics

Implement:

* daily
* weekly
* monthly
* charts
* weight statistics

### Phase 4 — PWA

Implement:

* manifest
* service worker
* offline support
* installability

### Phase 5 — Backup

Implement:

* JSON export
* JSON import
* validation

### Phase 6 — Internationalization

Implement:

* German
* Ukrainian
* language switching
* localized formatting

### Phase 7 — ML architecture

Implement:

* ML interfaces
* model registry
* vision pipeline
* mock classifier
* mock portion estimator
* photo UX

### Phase 8 — Real ML

Integrate a lightweight browser-compatible model.

Prefer:

```text
ONNX Runtime Web
```

or:

```text
TensorFlow.js
```

depending on which fits the existing project better.

### Phase 9 — Advanced ML

Only after the basic pipeline works, consider:

* detection
* segmentation
* dedicated portion estimation
* multiple food recognition

### Phase 10 — Polish

Finish:

* accessibility
* responsive design
* error handling
* loading states
* tests
* performance
* production build

---

# 29. Definition of Done

The project is complete when:

* [ ] Existing repository was inspected before modification.
* [ ] Existing functionality remains intact.
* [ ] `npm ci` works.
* [ ] `npm run build` works.
* [ ] App is installable as a PWA.
* [ ] App works offline.
* [ ] Meals are stored exclusively in IndexedDB.
* [ ] Weight data is stored exclusively in IndexedDB.
* [ ] Settings are stored locally.
* [ ] No backend exists.
* [ ] No Firestore is used.
* [ ] No Firebase Auth is used.
* [ ] No Firebase Storage is used.
* [ ] No user data is uploaded.
* [ ] Firebase is only used for hosting.
* [ ] Manual meal entry works.
* [ ] Meal editing/deletion works.
* [ ] Weight tracking works.
* [ ] Statistics work.
* [ ] Export/import works.
* [ ] German works.
* [ ] Ukrainian works.
* [ ] Language preference persists.
* [ ] Photo selection works.
* [ ] Camera support works where available.
* [ ] ML runs locally in the browser.
* [ ] ML architecture is modular.
* [ ] Mock ML implementation works.
* [ ] Real lightweight model can replace the mock implementation.
* [ ] ML results are clearly marked approximate.
* [ ] User confirms predictions before saving.
* [ ] Manual fallback exists if ML fails.
* [ ] Tests cover core business logic.
* [ ] Tests cover IndexedDB.
* [ ] Tests cover the ML pipeline with mocks.
* [ ] GitHub Actions deployment remains functional.

## Final instruction

Do not merely create a demo UI.

Build a maintainable application with a clean separation between:

```text
UI
↓
Application logic
↓
Local persistence
↓
ML abstraction
↓
ML models
↓
Nutrition database
```

The most important architectural requirement is that **all user data remains on-device**, while the application demonstrates a realistic, modular **on-device computer-vision pipeline** that can evolve from a mock classifier into multiple browser-based ML models without requiring a backend.
