# Privacy

Source: TODO.md §16

This application is explicitly privacy-friendly. Never:
- upload photos
- send meal data to a backend
- send weight data to a backend
- use Firebase Firestore
- use Firebase Storage
- use Firebase Authentication
- implement cloud synchronization

After installation the application must function without a network connection (core features offline; models may need an initial download, then cached — see US-12).
