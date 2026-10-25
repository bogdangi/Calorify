📝 User Story: Local-First Data Persistence

Title: Local-First Data Persistence
Feature: All user data (meals, weights, settings) stored exclusively on-device in IndexedDB
User Story:
• As a privacy-conscious user,
• I want my meals, weight entries, and settings stored only on my device,
• So that nothing is ever sent to a server and the app works fully offline.

Status: ✅ Done — `src/db/` (Dexie) with meal/weight/settings repositories.

⚙️ Acceptance Criteria

1. Storage
• IndexedDB is the single source of truth for all user-generated data; Dexie is used.
• Stored locally: meals, calories, weight entries, settings, language preference, user preferences, and optional locally persisted ML metadata.
• Meals, weight entries and settings all support add, edit, and delete.
• Local calendar dates are used correctly (no timezone bugs).

2. No backend
• No backend, no API, no Firestore, no Firebase Authentication, no Firebase Storage, no cloud synchronization.
• The application functions entirely offline after installation.
