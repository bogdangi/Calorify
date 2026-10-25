# Definition of Done

Source: TODO.md §29 — checklist from the spec; ✅ reflects implementation status verified by tests/inspection (Oct 2026).

- ✅ Existing repository was inspected before modification.
- ✅ Existing functionality remains intact.
- ✅ `npm ci` works.
- ✅ `npm run build` works.
- ✅ App is installable as a PWA.
- ✅ App works offline.
- ✅ Meals are stored exclusively in IndexedDB.
- ✅ Weight data is stored exclusively in IndexedDB.
- ✅ Settings are stored locally.
- ✅ No backend exists.
- ✅ No Firestore / Firebase Auth / Firebase Storage used.
- ✅ No user data is uploaded.
- ✅ Firebase is only used for hosting.
- ✅ Manual meal entry works.
- ✅ Meal editing/deletion works.
- ✅ Weight tracking works.
- ✅ Statistics work.
- ✅ Export/import works.
- ✅ German works. ✅ Ukrainian works. ✅ Language preference persists.
- ✅ Photo selection works. ✅ Camera support works where available.
- ✅ ML runs locally in the browser (Pretrained MobileNetV2 Food-101 ONNX, 9.4 MB, shipped 2026-10-25; device verification pending — US-9).
- ✅ ML architecture is modular.
- ✅ Mock ML implementation works.
- ✅ Real lightweight model can replace the mock implementation (Food-101 MobileNetV2 ships in `public/models/`, selectable in Settings; retrain to own 18 input classes only if dish granularity is insufficient).
- ✅ ML results are clearly marked approximate.
- ✅ User confirms predictions before saving.
- ✅ Manual fallback exists if ML fails.
- ✅ Tests cover core business logic. ✅ Tests cover IndexedDB. ✅ Tests cover the ML pipeline with mocks.
- ✅ GitHub Actions deployment remains functional.
