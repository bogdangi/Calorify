# ADR-0005: Model Registry + Lazy Model Loading

**Status:** Accepted
**Source:** TODO.md §11, §12

## Context
ML models are large; loading at startup would harm performance and offline-first UX.

## Decision
A model registry holds `ModelDefinition {id, name, version, runtime ("onnx" | "tensorflowjs"), sizeMB?}`. Models are loaded lazily — never at app startup, only when the user selects "Estimate from Photo" — and cached locally where practical. UI states: Loading model…, Model ready, Analysis in progress, Error. ML failure never blocks the rest of the app; manual food entry must always work.

## Consequences
First estimate has download latency; workbox precache allowance for `models/*` exists in `vite.config.ts`.
