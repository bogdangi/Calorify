# Implementation Order (Phases 1–10)

Source: TODO.md §28 — kept as historical plan record; actual status per user story index (README.md).

1. Repository inspection — understand the existing application before modifying it.
2. Foundation — IndexedDB, repositories, meal model, weight model, settings, Today page, manual meal entry.
3. Statistics — daily, weekly, monthly, charts, weight statistics.
4. PWA — manifest, service worker, offline support, installability.
5. Backup — JSON export, import, validation.
6. Internationalization — German, Ukrainian, switching, localized formatting.
7. ML architecture — interfaces, model registry, vision pipeline, mock classifier, mock portion estimator, photo UX.
8. Real ML — integrate a lightweight browser-compatible model (ONNX Runtime Web or TensorFlow.js, whichever fits best).
9. Advanced ML — only after basic pipeline works: detection, segmentation, dedicated portion estimation, multiple food recognition.
10. Polish — accessibility, responsive design, error handling, loading states, tests, performance, production build.
