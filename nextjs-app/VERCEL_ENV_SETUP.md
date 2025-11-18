# Vercel Environment Variables Setup

## Required Environment Variables

Add these environment variables in Vercel Dashboard → Settings → Environment Variables:

### Firebase Client SDK (Public - safe to expose)
- `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyDACus_3YH0HYkmtQFh6McuEYTN6VVNwdQ`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `wheresmyheadat-385c9`
- `NEXT_PUBLIC_FIREBASE_APP_ID` = `1:307212832302:web:54ef236c2b9c377e1619bf`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `wheresmyheadat-385c9.firebaseapp.com`

## Important Notes

1. **NO Admin SDK credentials needed** - We switched to client SDK to avoid private key format issues
2. These are PUBLIC API keys (NEXT_PUBLIC_ prefix) - safe to expose in browser
3. Security is enforced by Firestore security rules on the server
4. Apply to: Production, Preview, Development (all environments)

## Firestore Security Rules Required

Make sure these collections allow public read access:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /launderettes/{document} {
      allow read: if true;  // Public read
      allow write: if false; // Only admin via Admin SDK
    }
    match /reviews/{document} {
      allow read: if true;
      allow write: if false;
    }
    match /blog_posts/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Architecture Change Summary

**Before:** 
- Used Firebase Admin SDK
- Required private key (FIREBASE_PRIVATE_KEY) → kept failing due to format issues
- Build-time SSG failed repeatedly

**After:**
- Uses Firebase Client SDK (browser-compatible)
- Uses public API keys (no private keys needed!)
- ISR (Incremental Static Regeneration) with 1-hour revalidation
- Data fetches at request time, caches for 1 hour
- No build-time failures ✅
