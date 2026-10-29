# ML Architecture

Source: TODO.md §10–13, §25

## Pipeline (replaceable stages, DI — ADR-0004)
```
Photo → Detection/Classification → Identification → Portion Estimation
      → Nutrition DB → Calorie Calculation → User Confirmation → Meal Diary
```

## Interfaces
```ts
interface FoodDetector     { detect(image: ImageSource): Promise<Detection[]>; }
interface FoodClassifier   { classify(image: ImageSource): Promise<FoodClassification[]>; }
interface PortionEstimator { estimate(image: ImageSource, food: DetectedFood): Promise<PortionEstimate>; }
interface NutritionProvider{ getNutrition(foodId: string): Promise<NutritionInfo>; }
interface VisionPipeline   { analyze(image: ImageSource): Promise<FoodAnalysis>; }
```

## Model registry
`ModelDefinition { id, name, version, runtime: "onnx" | "tensorflowjs", sizeMB? }`. Lazy loading, never at startup; only on "Estimate from Photo"; cache locally where practical (ADR-0005).

## Progression (ADR-0010)
V1 mock classifier → V2 real lightweight classifier (ONNX Runtime Web, WebGPU→WASM; see US-9: scaffold exists, model file not shipped yet) → V3 detector + classifier + portion → V4 segmentation/multi-food/per-food portions.

## Mocks
Mocks use exactly the same interfaces as real models ("Demo prediction"); ML failure never blocks manual entry.

## Performance (§25)
- Lazy-load ML code and models; avoid unnecessary React renders; efficient IndexedDB usage; reasonable bundle size; avoid blocking the main thread.
- WebGPU preferred, WASM fallback; progress indicators during model load/inference.
- Run expensive ML inference in a Web Worker where practical; measure inference time only in dev/debug mode.
