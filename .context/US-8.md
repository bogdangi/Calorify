📝 User Story: Photo Estimation UX

Title: Photo Estimation UX
Feature: Camera/gallery photo → on-device analysis → user-confirmed calorie estimate
User Story:
• As a photo-logging user,
• I want to take or select a food photo, see an approximate prediction, and confirm or edit it before saving,
• So that the vision system assists me but never overrides my judgment.

Status: ✅ Done — `PhotoCaptureModal.tsx` (camera + gallery, analysis status, edit, confirm).

⚙️ Acceptance Criteria

1. Flow
• Take photo / choose from gallery → "Analyzing locally..." → result (food, confidence %, estimated portion g, estimated calories) → user confirms before the meal is created.
• Actions: Add to diary, Edit, Try again.
• ML predictions are NEVER automatically added to the diary.

2. Framing & fallback
• Estimates are always presented as approximate, not medically accurate ("Approximate estimate", not "Exact calories").
• Always dismissible; a manual entry fallback exists (camera unavailable, permission denied, low confidence, ML failure).
