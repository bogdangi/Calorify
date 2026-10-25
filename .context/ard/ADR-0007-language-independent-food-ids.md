# ADR-0007: Language-Independent Food IDs

**Status:** Accepted
**Source:** TODO.md §9, §14

## Context
de/uk translations must not leak into data records; models return plain model outputs.

## Decision
ML models and the nutrition DB operate on stable, language-independent food IDs (e.g. `apple`); translated names live only in translation objects (`translations: {de, uk}`) and are never used as identifiers.

## Consequences
`calories = caloriesPer100g × portionGrams / 100` works regardless of locale; names resolved only in the UI.
