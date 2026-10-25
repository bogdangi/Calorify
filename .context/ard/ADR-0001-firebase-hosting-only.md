# ADR-0001: Firebase Hosting Only — No Backend

**Status:** Accepted
**Source:** TODO.md §1, §24, §16

## Context
The app is deployed to Firebase project `loops-793a8` via GitHub Actions (merge → live, PR → preview channels).

## Decision
Firebase is used **only for static hosting/deployment**. There is no backend, no API, no Firestore, no Firebase Authentication, no Firebase Storage, no cloud database, and no user-data synchronization. Existing Firebase Hosting configuration and GitHub Actions workflows must remain compatible; production workflow (`deploy.yml`): `npm ci && npm run build` → FirebaseExtended/action-hosting-deploy. Do not commit service-account credentials. Do not introduce the Firebase runtime SDK unless genuinely required.

## Consequences
All persistence must be solved on-device (see ADR-0002) and backups via export/import (ADR-0008).
