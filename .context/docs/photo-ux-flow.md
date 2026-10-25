# Photo UX Flow

Source: TODO.md §15, §27, §26 (photo/ML scope only — import validation errors → US-13, IndexedDB/offline errors → US-12/US-16)

## Flow
```
Take photo | Choose from gallery
      ↓ Analyzing locally...
Detected food: <name>
Confidence: <n>%
Estimated portion: <n> g
Estimated calories: <n> kcal
Approximate estimate
      ↓
[ Add to diary ] [ Edit ] [ Try again ]
```

## Invariants
- The user MUST confirm the result before the meal is created; never auto-add ML predictions (ADR-0011).
- Wording: "Approximate estimate", never "Exact calories"; never present as medically accurate.
- The vision system is an assistant, not an authority; the user can change food, portion, calories, meal type, time before saving.

## Error handling (photo/ML)
Camera unavailable · permission denied · unsupported browser · ML model loading failure · ML inference failure · insufficient model confidence. Always provide a manual fallback ("We couldn't recognize the food. Please try another photo or enter the food manually.").
