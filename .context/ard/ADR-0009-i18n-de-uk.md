# ADR-0009: i18n — German & Ukrainian, German Fallback

**Status:** Accepted
**Source:** TODO.md §19

## Context
The product targets German and Ukrainian users; only two languages are in scope.

## Decision
Support `de` (default/fallback) and `uk` via `react-i18next`/`i18next` under `src/i18n/` (`index.ts`, `locales/de.ts`, `locales/uk.ts`). First-launch resolution: saved preference → browser language → German fallback. Change language immediately and persist locally. Locale-aware formatting via `Intl.DateTimeFormat`/`Intl.NumberFormat`; internal units kg/g/ml/kcal with localized presentation only. Never hard-code user-facing text in components; meal types stay language-independent enums.

## Consequences
All user-facing strings must be routed through translation resources.
