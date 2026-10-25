# ADR-0008: Local JSON Export/Import as the Only Backup Mechanism

**Status:** Accepted
**Source:** TODO.md §18

## Context
No server exists (ADR-0001/0002) yet data loss protection is required.

## Decision
Settings offer Export data / Import data producing versioned JSON (`{version: 1, exportedAt, meals, weights, settings}`). Import validates JSON/schema, rejects malformed data, avoids accidental overwriting, shows clear success/error messages, and preserves IDs/timestamps where appropriate.

## Consequences
Backups are manual and per-device; restore depends on schema-version handling.
