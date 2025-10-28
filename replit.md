# LaunderetteNear.me

A comprehensive UK launderette directory service with geolocation-based search, distance calculation, premium listings, and an admin interface for managing listings.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Geocoding**: Nominatim (OpenStreetMap) - free alternative to Google Maps

## Architecture

### Hybrid Client-Server Model

**Backend API (Express + Firebase Admin SDK):**
- Handles all authenticated operations (CREATE, UPDATE, DELETE)
- Validates Firebase auth tokens using Firebase Admin SDK
- Proxies geocoding requests to Nominatim
- Serves as secure intermediary between client and Firestore

**Frontend (React + Firebase Client SDK):**
- Public directory uses backend API for read operations
- Admin interface uses backend API for all CRUD operations
- Firebase Authentication for user login (Google OAuth)
- Client obtains ID token and passes it to backend in Authorization header

### Security Model

1. **Firebase Authentication**: Admin users sign in with Google
2. **Token Verification**: Backend verifies Firebase ID tokens using Admin SDK
3. **Protected Routes**: All CREATE/UPDATE/DELETE operations require valid Bearer token
4. **Firestore Rules**: Additional server-side security layer (must be configured in Firebase Console)

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── search-bar.tsx
│   │   └── listing-card.tsx
│   ├── pages/             # Route pages
│   │   ├── home.tsx       # Public directory
│   │   ├── admin-login.tsx
│   │   ├── admin-dashboard.tsx
│   │   ├── admin-listings.tsx
│   │   └── admin-listing-form.tsx
│   ├── lib/
│   │   ├── firebase.ts    # Firebase client SDK
│   │   ├── api.ts         # API request helper
│   │   └── distance.ts    # Haversine distance calculation
│   └── App.tsx            # Root with routing

server/
├── firebase-admin.ts      # Firebase Admin SDK initialization
├── middleware/
│   └── auth.ts           # Authentication middleware
├── routes.ts             # API routes
└── index.ts              # Express server

shared/
└── schema.ts             # Shared TypeScript types and Zod schemas
```

## Key Features

### Public Directory
- Search by postcode or city name with real-time geocoding
- Distance calculation from user's location or search location
- Premium listings displayed at top with special badge
- Responsive card-based layout
- Automatic geolocation with fallback

### Admin Interface
- Firebase Google authentication
- Dashboard with statistics (total, premium, standard listings)
- Full CRUD operations for launderette listings
- Auto-geocoding from address input
- Premium listing toggle
- Feature tags management
- Sidebar navigation

## Data Model

**Launderette Schema:**
```typescript
{
  id: string;              // Firestore document ID
  name: string;            // Business name
  address: string;         // Full address
  lat: number;             // Latitude
  lng: number;             // Longitude
  features: string[];      // e.g., ["Free WiFi", "24/7 Access"]
  isPremium: boolean;      // Premium listing flag
  createdAt?: number;      // Timestamp
  createdBy?: string;      // User ID
  updatedAt?: number;      // Timestamp
  updatedBy?: string;      // User ID
}
```

## Environment Variables

Required secrets (configured in Replit):
- `VITE_FIREBASE_API_KEY` - Firebase web API key
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `SESSION_SECRET` - Express session secret

For production deployments, also set:
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase service account JSON (for production token verification)

## API Endpoints

### Public Endpoints
- `GET /api/launderettes` - List all launderettes
- `GET /api/launderettes/:id` - Get single launderette
- `GET /api/geocode?address={address}` - Geocode address to lat/lng

### Protected Endpoints (Require Bearer Token)
- `POST /api/launderettes` - Create new launderette
- `PUT /api/launderettes/:id` - Update launderette
- `DELETE /api/launderettes/:id` - Delete launderette

## Firebase Configuration Required

### 1. Firestore Security Rules

**IMPORTANT**: These rules must be manually applied in Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /launderettes/{launderetteId} {
      allow read: if true;  // Public read
      allow create, update, delete: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2. Authentication Authorized Domains

Add your deployment domain to Firebase Console → Authentication → Settings → Authorized Domains:
- For Replit: `your-project.replit.app`
- For custom domains: add your domain

## Development Notes

### Firebase Admin SDK Token Verification

The current implementation initializes Firebase Admin with only `projectId`. This works for development when:
1. Tokens are issued by the same Firebase project
2. Running in a trusted environment (Replit dev server)

For **production**, proper service account credentials should be configured via `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable.

### Geocoding Service

Uses Nominatim (free OpenStreetMap geocoding):
- No API key required
- Has rate limits (1 request/second)
- For production, consider Google Maps Geocoding API

### Distance Calculation

Uses Haversine formula for accurate distance between coordinates:
- Returns distance in miles
- Accounts for Earth's curvature
- Client-side calculation for performance

## User Preferences

- **Design Style**: Hybrid approach inspired by Airbnb (card-based, clean) and Google Maps (functional search)
- **Typography**: Inter for body text, Manrope for headings
- **Color Scheme**: Professional blue primary color with neutral grays
- **Storage**: Firebase Firestore (cloud-based, real-time)
- **Authentication**: Firebase Authentication with Google Sign-In

## Recent Changes

### October 28, 2025
- ✅ Implemented secure backend API with Firebase Admin SDK
- ✅ Added authentication middleware for protected routes
- ✅ Migrated all admin operations from client-side Firestore to backend API
- ✅ Added individual launderette fetch endpoint (GET /api/launderettes/:id)
- ✅ Improved error handling and logging throughout
- ✅ Created comprehensive deployment documentation
- ✅ Documented Firestore security rules requirements

### Architecture Evolution
- **Initial**: Direct client-side Firestore access (insecure)
- **Current**: Backend API with Firebase Admin SDK and authentication middleware (secure)
- **Benefit**: Server-side validation, token verification, better security control

## Deployment Checklist

Before deploying to production:

1. ✅ Set all required environment variables
2. ✅ Apply Firestore security rules in Firebase Console
3. ✅ Add deployment domain to Firebase authorized domains
4. ⚠️ Configure Firebase Admin service account credentials (production)
5. ⚠️ Add admin email whitelist in Firestore rules (recommended)
6. ⚠️ Consider upgrading to Google Maps Geocoding API (paid)
7. ⚠️ Implement rate limiting on API endpoints
8. ⚠️ Add monitoring and error tracking

## Known Limitations

1. **Nominatim Geocoding**: Free but has rate limits (1 req/sec)
2. **No Pagination**: All listings loaded at once (fine for small datasets)
3. **Client-Side Distance Sort**: Could be optimized with geospatial queries
4. **No Real-Time Updates**: Uses polling instead of Firestore listeners
5. **Firebase Admin Development Mode**: Production needs service account credentials

## Future Enhancements

- Add user reviews and ratings
- Implement search filters (features, open now, etc.)
- Add map view with markers
- SMS/Email notifications for new listings
- Analytics dashboard for admin
- Multi-language support
- Mobile app (React Native)
