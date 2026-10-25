📝 User Story: Modular On-Device ML Pipeline (Mock First)

Title: Modular On-Device ML Pipeline
Feature: Replaceable ML stages (detection → classification → portion → nutrition → calories) with model registry and fully functional mock
User Story:
• As an app user with any capable browser,
• I want photo-based food estimation built from independent, replaceable ML stages,
• So that the pipeline can evolve from a mock classifier to real browser models without UI changes.

Status: ✅ Done — `src/ml/` (pipeline, registry, mocks), `ModularVisionPipeline`, `modelRegistry`.

⚙️ Acceptance Criteria

1. Architecture
• No monolithic photo→calories model; independent interfaces: FoodDetector, FoodClassifier, PortionEstimator, NutritionProvider, VisionPipeline.
• Dependency injection so each stage can be replaced independently.
• Model registry: ModelDefinition {id, name, version, runtime (onnx/tensorflowjs), sizeMB?}.
• Models are loaded lazily — never at app startup; only when the user selects "Estimate from Photo"; cached locally where practical.

2. Mock implementation
• MockFoodClassifier / MockPortionEstimator / MockFoodDetector use exactly the same interfaces as real models.
• Mock results are clearly labelled "Demo prediction".
• ML failure never blocks the app; manual food entry always works.
