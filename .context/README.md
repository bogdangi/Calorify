# Calorify — Project Context Index

Extracted from `TODO.md` (product spec, 29 sections). User stories to continue development, architecture decision records (ADRs), and reference documentation.

Status legend: ✅ Done · 🚧 Partial · 🔜 Todo · 🔵 Future (deliberately deferred)

## User Stories (`US-*.md`)

| ID  | Story | Status |
|-----|-------|--------|
| [US-1](US-1.md) | Science-Based Calorie Calculator | 🔜 Roadmap story (pre-existing; feature **not implemented** and not part of original spec) |
| [US-2](US-2.md) | Local-First Data Persistence (IndexedDB/Dexie, no backend) | ✅ |
| [US-3](US-3.md) | Today Diary & Meal Tracking (manual add/edit/delete) | ✅ |
| [US-4](US-4.md) | Weight Tracking (entries + chart) | ✅ |
| [US-5](US-5.md) | Calorie Statistics (day/week/month) | ✅ |
| [US-6](US-6.md) | Nutrition Database & Food Labels | ✅ |
| [US-7](US-7.md) | Modular On-Device ML Pipeline (mock first) | ✅ |
| [US-8](US-8.md) | Photo Estimation UX (confirm before save) | ✅ |
| [US-9](US-9.md) | Real Lightweight Food Classifier V2 (ONNX) | 🚧 Food-101 model shipped, on-device verify pending |
| [US-10](US-10.md) | Real Detector & Portion Estimator V3 | 🔵 |
| [US-11](US-11.md) | Segmentation & Multi-Food V4 | 🔵 |
| [US-12](US-12.md) | PWA with Offline Support | ✅ |
| [US-13](US-13.md) | Export / Import Backup | ✅ |
| [US-14](US-14.md) | Internationalization (de/uk) | ✅ |
| [US-15](US-15.md) | Settings | ✅ |
| [US-16](US-16.md) | Accessibility, Error Handling & Performance Polish | 🚧 |
| [US-17](US-17.md) | Test Coverage | ✅ (mostly) |
| [US-18](US-18.md) | Over-Engineering Cleanup (2026-10-25 audit findings) | 🔜 |

## Architecture Decision Records (`ard/`)

| ADR | Decision |
|-----|----------|
| [ADR-0001](ard/ADR-0001-firebase-hosting-only.md) | Firebase Hosting only — no backend/API/Firestore/Auth/Storage |
| [ADR-0002](ard/ADR-0002-local-first-indexeddb.md) | Local-first: IndexedDB (Dexie) as single source of truth |
| [ADR-0003](ard/ADR-0003-photos-never-uploaded.md) | Food photos never uploaded |
| [ADR-0004](ard/ADR-0004-modular-ml-pipeline-di.md) | Modular replaceable ML pipeline with DI |
| [ADR-0005](ard/ADR-0005-model-registry-lazy-loading.md) | Model registry + lazy model loading |
| [ADR-0006](ard/ADR-0006-onnx-runtime-web.md) | Runtime: ONNX Runtime Web (WebGPU → WASM fallback) |
| [ADR-0007](ard/ADR-0007-language-independent-food-ids.md) | Language-independent food IDs |
| [ADR-0008](ard/ADR-0008-json-export-import-backup.md) | Local JSON export/import as only backup |
| [ADR-0009](ard/ADR-0009-i18n-de-uk.md) | i18n de/uk with German fallback |
| [ADR-0010](ard/ADR-0010-mock-first-ml-interfaces.md) | Mock-first ML with shared interfaces; tests never run real ML |
| [ADR-0011](ard/ADR-0011-user-confirmed-approximate-vision.md) | Vision is an assistant, not an authority (user confirms always) |

## Reference Documentation (`docs/`)

| Doc | Topic |
|-----|-------|
| [architecture](docs/architecture.md) | Stack + target src/ layout |
| [data-model](docs/data-model.md) | MealEntry, WeightEntry, export schema |
| [nutrition-database](docs/nutrition-database.md) | FoodNutrition, initial foods, formula |
| [ml-architecture](docs/ml-architecture.md) | Pipeline, interfaces, registry, V1→V4, performance |
| [photo-ux-flow](docs/photo-ux-flow.md) | Photo flow + photo/ML error handling |
| [privacy](docs/privacy.md) | Privacy guarantees |
| [pwa](docs/pwa.md) | Manifest, SW, offline scope |
| [i18n](docs/i18n.md) | Language resolution, translation rules |
| [testing-strategy](docs/testing-strategy.md) | Test matrix, mocks |
| [deployment](docs/deployment.md) | Firebase config, GitHub Actions |
| [implementation-order](docs/implementation-order.md) | Phase 1–10 plan (historical) |
| [definition-of-done](docs/definition-of-done.md) | DoD checklist with verification status |

## Working here?

Active work first: **US-9** (ship the real ONNX model — code is done, the `.onnx` file is missing). Then **US-18** (over-engineering cleanup from the 2026-10-25 audit) and **US-16** (a11y/polish). Don't break ADR-0001/0002/0011 — they are product invariants.
