# LaunderetteNear.me

## Overview
A UK launderette directory web application with geolocation-based search, distance calculation, premium listings, and admin management interface. Users can find nearby launderettes by entering a postcode or city name, or by using their current location.

## Project Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript, Vite for bundling
- **Styling**: Tailwind CSS with custom design system (Inter + Manrope fonts)
- **UI Components**: Shadcn/ui component library
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Authentication**: Firebase Authentication with Google sign-in
- **Real-time Data**: Firebase Firestore with real-time listeners

### Backend (Express)
- **Framework**: Express.js (TypeScript)
- **API Endpoints**: 
  - `/api/geocode` - Converts postcodes/addresses to coordinates using Nominatim (OpenStreetMap)
- **Database**: Firebase Firestore (NoSQL cloud database)

### Key Features
1. **Public Directory**
   - Search by postcode or city name with geocoding
   - Automatic geolocation detection with fallback
   - Distance calculation using Haversine formula
   - Premium listing highlighting (yellow border, priority placement)
   - Real-time updates from Firestore
   - Responsive design for mobile/tablet/desktop

2. **Admin Interface**
   - Google authentication for admin access
   - Dashboard with listing statistics
   - CRUD operations for launderette listings
   - Geocoding integration for address-to-coordinates conversion
   - Feature tags management
   - Premium listing toggle
   - Sidebar navigation with responsive design

## Data Model

### Launderette Schema (Firestore)
```typescript
{
  id: string;           // Auto-generated document ID
  name: string;         // Launderette name
  address: string;      // Full address
  lat: number;          // Latitude
  lng: number;          // Longitude
  features: string[];   // Array of features (e.g., "Free WiFi", "24/7 Access")
  isPremium: boolean;   // Premium listing flag
  createdAt: number;    // Timestamp
  updatedAt?: number;   // Optional timestamp
}
```

## Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   ├── app-sidebar.tsx  # Admin sidebar navigation
│   │   ├── listing-card.tsx # Launderette listing card
│   │   └── search-bar.tsx   # Hero search component
│   ├── lib/
│   │   ├── firebase.ts      # Firebase configuration
│   │   ├── distance.ts      # Haversine distance calculation
│   │   └── queryClient.ts   # TanStack Query setup
│   ├── pages/
│   │   ├── home.tsx                # Public directory page
│   │   ├── admin-login.tsx         # Admin authentication
│   │   ├── admin-layout.tsx        # Admin layout wrapper
│   │   ├── admin-dashboard.tsx     # Admin dashboard
│   │   ├── admin-listings.tsx      # Listings management
│   │   └── admin-listing-form.tsx  # Add/edit form
│   └── App.tsx              # Main app with routing
server/
├── routes.ts                # API routes (geocoding)
└── index.ts                 # Express server setup
shared/
└── schema.ts                # Shared TypeScript schemas
```

## Recent Changes
- **2025-01-28**: Initial implementation with full MVP features
  - Created complete frontend with public directory and admin interface
  - Implemented Firebase Firestore integration with real-time listeners
  - Added geocoding API using Nominatim (free OpenStreetMap service)
  - Configured design system with Inter and Manrope fonts
  - Built admin authentication with Google sign-in
  - Implemented distance-based search with Haversine formula
  - Added CRUD operations for launderette listings

## Environment Variables
Required secrets (configured in Replit Secrets):
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `VITE_FIREBASE_API_KEY` - Firebase API key

## Firebase Setup
The application uses Firebase for:
1. **Authentication**: Google OAuth for admin users
2. **Firestore Database**: Real-time NoSQL database for launderette listings
3. **Collection**: `launderettes` - stores all listing data

## Geocoding Service
Using **Nominatim** (OpenStreetMap's geocoding service) as a free alternative to Google Maps:
- No API key required
- Good coverage for UK postcodes and addresses
- Rate-limited but sufficient for typical usage
- Fallback: If geocoding fails, users can manually enter coordinates or use their current location

## User Preferences
- Design follows Material Design principles with Airbnb-inspired search UX
- Focus on clarity, scan-ability, and trust
- Premium listings get visual priority (border highlight, top placement)
- Mobile-first responsive design
- Clean, professional aesthetic suitable for a utility service

## Running the Project
The workflow "Start application" runs `npm run dev` which:
1. Starts Express server on backend
2. Starts Vite dev server for frontend
3. Both run on the same port (Express serves Vite)

Access:
- Public directory: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`
- Manage listings: `/admin/listings`
