📝 User Story: Real Lightweight Food Classifier (V2)

Title: Real Lightweight Food Classifier
Feature: Ship a real lightweight browser-compatible food classifier (ONNX Runtime Web) replacing the mock
User Story:
• As a photo-logging user,
• I want predictions from a real trained food model running on-device,
• So that estimates are meaningful instead of demo values.

Status: 🚧 Implemented 2026-10-25 — ships a working pretrained **Food-101 ONNX classifier** (16.5 MB `public/models/food_classifier.onnx`, Apache-2.0 trained Food-101 head verified non-degenerate). All 101 Food-101 labels are mapped: dedicated dish entries added to the nutrition DB (total 100 foodIds, de/uk names), 17 classes collapse to existing ids (e.g. `filet_mignon→steak`). **Label order = Food-101 meta/classes.txt line order, NOT alphabetical** — verified with a ground-truth beignets validation photo (top-1 beignets 5.31 under classes.txt order vs mislabeled under sorted order). First candidate model (AlexKoff88 mobilenet_v2_food101) was discarded: graph inspection showed its classifier head weights/bias are fresh untrained `nn.Linear` initializations (degnerate export → constant logits → 'always boiled egg' bug). Contract test guards order + mapping. Remaining: real-device WebGPU/WASM smoke test + more diverse real-photo spot checks.

⚙️ Acceptance Criteria

1. Model
• Lightweight browser-compatible model: MobileNet, EfficientNet-Lite, small Food-101-derived classifier, or compact ONNX/TensorFlow.js model.
• Runs entirely on-device; ONNX Runtime Web preferred (WebGPU when available, WASM fallback).
• Lazy-loaded and cached locally after first download; no huge model.

2. Integration
• Reuses the existing mock interfaces — no UI change required.
• Predictions map to existing language-independent food IDs.
• Loading states shown: "Loading model…", "Model ready", "Analysis in progress", error state.
