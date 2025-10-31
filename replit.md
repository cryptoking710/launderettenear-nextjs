# LaunderetteNear.me

## Overview
LaunderetteNear.me is a comprehensive UK launderette directory service designed to help users find nearby launderettes using geolocation. It features a public-facing directory with advanced search capabilities, distance calculation, premium listings, and an administrative interface for managing launderette data. The project aims to provide a user-friendly experience for finding laundry services across the UK, offering detailed information and user reviews, while also providing robust tools for administrators to maintain the directory. The project currently covers 59 major UK cities with 612 launderette listings, including premium listings, and has ambitions for further expansion.

## User Preferences
- **Design Style**: Hybrid approach inspired by Airbnb (card-based, clean) and Google Maps (functional search)
- **Typography**: Inter for body text, Manrope for headings
- **Color Scheme**: Professional blue primary color with neutral grays
- **Storage**: Firebase Firestore (cloud-based, real-time)
- **Authentication**: Firebase Authentication with Google Sign-In

## System Architecture
The application employs a hybrid client-server model. The **Frontend** is built with React, TypeScript, Vite, Tailwind CSS, Wouter, and TanStack Query, providing a public directory and an admin interface. The public directory primarily uses the backend API for read operations, while the admin interface handles all CRUD operations via the backend API. Firebase Authentication with Google OAuth is used for user login, with client-side Firebase SDK managing authentication tokens.

The **Backend** is a Node.js Express server that utilizes the Firebase Admin SDK. It handles all authenticated operations (CREATE, UPDATE, DELETE), validates Firebase auth tokens, and acts as a secure intermediary between the client and Firestore. It also proxies geocoding requests to Nominatim.

**Security Model**: Firebase Authentication secures user logins. The backend verifies Firebase ID tokens using the Admin SDK, ensuring all protected routes (CREATE/UPDATE/DELETE) require a valid Bearer token. Firestore security rules provide an additional server-side security layer.

**Key Features**:
- **Public Directory**: Geolocation-based search, distance calculation, premium listing prominence, responsive design, advanced filtering (features, price range, opening hours), list/map view toggle with interactive markers and clustering, detailed launderette pages with photos and user reviews/ratings, and analytics tracking for searches and views.
- **Admin Interface**: Firebase Google authentication, dashboard with statistics, full CRUD operations for listings, auto-geocoding from address input, premium listing toggle, feature tags management, analytics dashboard for search trends and popular listings, and review moderation.

**Data Model**: Core data models include:
- **Launderette Schema**: Captures details like name, address, coordinates, features, premium status, description, contact info, opening hours, price range, and timestamps.
- **Review Schema**: Stores launderette ID, rating, comment, reviewer name, and timestamp.
- **Analytics Event Schema**: Records search and view events, including queries, launderette IDs, user location, and timestamps.

**UI/UX Decisions**: The design combines Airbnb's card-based cleanliness with Google Maps' functional search. Typography uses Inter for body and Manrope for headings, with a professional blue and neutral gray color scheme. React Leaflet is used for interactive maps with marker clustering, and shadcn/ui and Radix UI provide robust UI components.

## External Dependencies
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Geocoding**: Nominatim (OpenStreetMap)
- **Mapping**: React Leaflet (version 4.2.1)
- **Backend Services**: Node.js, Express, Firebase Admin SDK
- **Frontend Libraries**: React, TypeScript, Vite, Tailwind CSS, Wouter (routing), TanStack Query
- **UI Libraries**: shadcn/ui, Radix UI