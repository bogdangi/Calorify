# ADR-0004: Modular Replaceable ML Pipeline with Dependency Injection

**Status:** Accepted
**Source:** TODO.md §10

## Context
A single monolithic photo→calories model cannot evolve through increasing capability levels.

## Decision
The vision functionality is built from independent replaceable stages — Detection/Classification → Identification → Portion Estimation → Nutrition DB → Calorie Calculation → User Confirmation → Diary — behind independent interfaces (`FoodDetector`, `FoodClassifier`, `PortionEstimator`, `NutritionProvider`, `VisionPipeline`), each stage replaceable via dependency injection, independent of React.

## Consequences
Mock implementations (ADR-0010) let UI/pipeline ship before real models; new stages integrate without UI changes.
