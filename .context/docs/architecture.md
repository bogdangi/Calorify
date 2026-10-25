# Architecture & Technology Stack

Source: TODO.md §23, §4

## Stack
React · TypeScript · Vite · PWA · IndexedDB (Dexie) · react-i18next/i18next · ONNX Runtime Web and/or TensorFlow.js · WebGPU when available with WASM fallback.
Rule: inspect the existing repository first and reuse its stack when practical; introduce no unnecessary dependencies.

## Target src/ layout
```
src/
  app/            components/      pages/
  features/       meals/  weight/  statistics/  settings/  vision/
  db/             indexeddb/       repositories/
  ml/             core/            models/     classifiers/  detectors/
                  portion/         nutrition/  pipeline/
  i18n/           locales/         de.ts  uk.ts
  hooks/          types/           utils/
```

## Rules
- Keep business logic outside UI components.
- Use repositories/services for IndexedDB access.
- Keep ML abstractions independent of React.
