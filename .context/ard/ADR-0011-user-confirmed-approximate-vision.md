# ADR-0011: Vision Is an Assistant, Not an Authority

**Status:** Accepted
**Source:** TODO.md §15, §27

## Context
Vision-based calorie estimation is inherently approximate and must never mislead users medically.

## Decision
The user MUST confirm every prediction before the meal is created; predictions are never automatically added to the diary. Users can change food, portion, calories, meal type, and time before saving. Language uses "Approximate estimate" rather than "Exact calories"; estimates are never presented as medically accurate.

## Consequences
The confirm/edit flow is a hard product invariant, not a UX nicety.
