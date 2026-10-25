# ADR-0003: Food Photos Never Uploaded

**Status:** Accepted
**Source:** TODO.md §2, §15

## Context
Photo estimation must remain privacy-friendly; there is no server to receive photos.

## Decision
Preferred photo flow: Camera/Gallery → browser memory → on-device ML → food prediction → portion estimation → nutrition lookup → calorie estimate → user confirmation → meal stored in IndexedDB → original photo can be discarded. Photos are never uploaded and no cloud sync exists.

## Consequences
ML accuracy is bounded by what on-device models can do (modular pipeline, ADR-0004).
