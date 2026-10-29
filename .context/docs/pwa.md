# PWA

Source: TODO.md §17

Implement: Web App Manifest · Service Worker · installability · offline caching · app icons · offline application shell · cached application assets.

Core functionality must work offline:
add meals · edit meals · delete meals · add weight · edit weight · delete weight · statistics · settings.

ML models may require an initial download unless already cached; cache models locally after downloading when practical.

Implementation: `vite-plugin-pwa` v2 (`registerType: 'autoUpdate'`), manifest + icons in `vite.config.ts`, workbox precache incl. `models/*` (up to 35 MB per file); Firebase Hosting sets `no-cache` headers for `sw.js` and immutable caching for assets.
