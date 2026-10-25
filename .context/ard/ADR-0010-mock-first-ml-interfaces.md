# ADR-0010: Mock-First ML with Shared Interfaces; Tests Never Run Real ML

**Status:** Accepted
**Source:** TODO.md §13, §22

## Context
UI/pipeline must be developable before real models exist; real models must not run in unit tests.

## Decision
Mock implementations (`MockFoodClassifier`, `MockPortionEstimator`, `MockFoodDetector`) use exactly the same interfaces as the real models so the UI needs no change when models arrive; mock results are explicitly labelled "Demo prediction". Unit tests use mocks for the complete pipeline and never execute real ML. Preferred V1→V4 progression: mock classifier → real lightweight classifier → detector + classifier + portion → segmentation/multi-food.

## Consequences
See US-9 caveat: the ONNX classifier currently falls back to a color heuristic while the registry reports `isMock: false` — labeling honesty must be restored when the real model ships.
