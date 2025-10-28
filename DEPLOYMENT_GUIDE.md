# LaunderetteNear.me - Deployment Guide

## Overview

LaunderetteNear.me is a UK launderette directory with geolocation search, distance calculation, premium listings, and an admin interface for managing listings.

## Architecture

The application uses a pragmatic Firebase architecture optimized for development on Replit:

- **Firebase Admin SDK**: For verifying authentication tokens (works without service account when verifying tokens from the same Firebase project)
- **Firebase Client SDK on Backend**: For Firestore operations with permissive security rules in development
- **Frontend Authentication**: Token-based authentication flow from client to server

### Development vs Production

**Development (Current Implementation)**:
- Uses Firebase Client SDK on backend for Firestore
- Works without service account credentials
- Requires permissive Firestore security rules
- Trade-off: Convenience over maximum security

**Production (Recommended Upgrade)**:
- Use Firebase Admin SDK with service account credentials
- Strict Firestore security rules with email whitelisting
- Server-side operations bypass security rules securely
- Maximum security for production deployments

## Required Configuration

### 1. Firebase Setup

#### Firebase Project Creation
1. Go to [Firebase Console](https://console.firebase.com/)
2. Create a new project or use an existing one
3. Enable Authentication with Google Sign-In provider
4. Enable Firestore Database

#### Firebase Configuration

**Environment Variables Required:**

```bash
# Firebase (frontend and backend)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# Session Secret
SESSION_SECRET=your_random_secret_string
```

**Getting Firebase Credentials:**
1. In Firebase Console, go to Project Settings
2. Under "Your apps", find your web app configuration
3. Copy the values for:
   - `apiKey` → VITE_FIREBASE_API_KEY
   - `projectId` → VITE_FIREBASE_PROJECT_ID
   - `appId` → VITE_FIREBASE_APP_ID

#### Firestore Security Rules

**CRITICAL**: You must configure Firestore security rules.

1. Go to Firebase Console → Firestore Database → Rules
2. For **development/Replit**, use these permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /launderettes/{launderetteId} {
      allow read: if true;
      allow create, update, delete: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. For **production**, use restrictive rules (see FIRESTORE_RULES.md)
4. Click "Publish"

**WARNING**: Permissive rules allow anyone to modify your database. Only use in development. See FIRESTORE_RULES.md for production rules.

#### Firebase Authentication - Authorized Domains

To enable Google Sign-In:

1. Go to Firebase Console → Authentication → Settings → Authorized Domains
2. Add your deployment domain:
   - For Replit: `your-project.replit.app`
   - For custom domains: `yourdomain.com`

### 2. Running the Application

**Development:**
```bash
npm install
npm run dev
```

The application runs on port 5000.

**Production Deployment:**
1. Set all environment variables
2. Update Firestore security rules to production rules
3. Build: `npm run build`
4. Start: `npm start`

### 3. Initial Setup

1. Navigate to `/admin/login`
2. Sign in with Google
3. Add your first launderette listing
4. Test the public directory at `/`

### 4. Features

**Public Features:**
- Search by postcode or city name
- Real-time geocoding and distance calculation
- Sort by distance from location
- Premium listings highlighted
- Responsive mobile design

**Admin Features:**
- Dashboard with statistics
- Add/edit/delete listings
- Toggle premium status
- Automatic geocoding

### 5. API Endpoints

**Public:**
- `GET /api/launderettes` - List all
- `GET /api/launderettes/:id` - Get single
- `GET /api/geocode?address=...` - Geocode address

**Protected (Require Bearer Token):**
- `POST /api/launderettes` - Create
- `PUT /api/launderettes/:id` - Update
- `DELETE /api/launderettes/:id` - Delete

### 6. Security Checklist

- ✅ Firebase authentication for admin access
- ✅ Server-side token verification
- ✅ Protected API routes with middleware
- ⚠️ Use permissive rules for development only
- ⚠️ Switch to restrictive rules for production
- ⚠️ Add your deployment domain to Firebase authorized domains
- ⚠️ For production, add admin email whitelist in Firestore rules

### 7. Troubleshooting

**"Unauthorized domain" during Google Sign-In:**
- Add domain to Firebase Console → Authentication → Authorized Domains

**"Permission denied" errors:**
- Verify Firestore rules are published in Firebase Console
- For development, ensure you're using permissive rules
- For production, ensure user is authenticated

**Geocoding not working:**
- Nominatim has rate limits (1 req/sec)
- Consider Google Maps Geocoding API for production

**Distance calculation incorrect:**
- Verify lat/lng are correct
- Use "Find Coordinates" button to auto-geocode

### 8. Production Upgrade Path

When ready for production:

1. **Get Service Account Credentials**:
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Add as environment variable: `FIREBASE_SERVICE_ACCOUNT_KEY='...'`

2. **Update Firestore Rules**:
   - Use restrictive rules from FIRESTORE_RULES.md
   - Add admin email whitelist
   - Publish rules

3. **Update Backend** (optional):
   - Modify `server/firestore-backend.ts` to use Admin SDK
   - This allows bypass of security rules with service account

4. **Test Thoroughly**:
   - Verify admin login works
   - Test create/edit/delete operations
   - Confirm non-admin users cannot modify data

### 9. Known Limitations

- **Nominatim Geocoding**: Free but rate-limited
- **No Real-time Updates**: Uses polling instead of listeners
- **Development Security**: Permissive rules for ease of use
- **No Pagination**: All listings loaded at once

### 10. Support

For issues or questions:
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
