# Deployment & Firebase

Source: TODO.md §1, §24

Firebase is **only** the deployment target — project `loops-793a8` (`.firebaserc`). Hosting config `firebase.json`: public `dist`, SPA rewrites, immutable cache for assets, no-cache for `sw.js`.

- Production: GitHub Actions `deploy.yml` — on push to `main`: checkout → `npm ci && npm run build` → FirebaseExtended/action-hosting-deploy (`channelId: live`, `projectId: loops-793a8`).
- PRs continue to deploy preview channels (`preview.yml`, which also runs `npm test`; deploy.yml does not).
- Do not commit service-account credentials (secret `FIREBASE_SERVICE_ACCOUNT_LOOPS_793A8`).
- Do not introduce the Firebase runtime SDK unless genuinely required.
- Existing deployment workflows must remain compatible; keep `npm ci && npm run build` working.
