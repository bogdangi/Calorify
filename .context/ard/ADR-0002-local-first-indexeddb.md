# ADR-0002: Local-First — IndexedDB (Dexie) as Single Source of Truth

**Status:** Accepted
**Source:** TODO.md §2

## Context
No backend exists (ADR-0001); user data must never leave the device.

## Decision
IndexedDB is the single source of truth for all user-generated data: meals, calories, weight entries, settings, language preference, user preferences, optional locally persisted ML metadata. Dexie is used for access. No user data is sent to a server under any circumstances.

## Consequences
Backup is solved via local JSON export/import (ADR-0008); deletion/loss of the device without journal.
