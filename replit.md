# LaunderetteNear.me

## Overview
LaunderetteNear.me is a UK launderette directory service that helps users find nearby launderettes using geolocation. It offers a public directory with advanced search, distance calculation, premium listings, city-specific pages, and an administrative interface for data management. The project aims to provide a user-friendly experience for finding laundry services across the UK, offering detailed information and user reviews, while enabling administrators to maintain the directory efficiently. It currently covers 79 UK cities with 1,057 launderette listings, including premium options, and features dedicated city landing pages for improved local SEO.

## User Preferences
- **Design Style**: Hybrid approach inspired by Airbnb (card-based, clean) and Google Maps (functional search)
- **Typography**: Inter for body text, Manrope for headings
- **Color Scheme**: Professional blue primary color with neutral grays
- **Storage**: Firebase Firestore (cloud-based, real-time)
- **Authentication**: Firebase Authentication with Google Sign-In

## System Architecture
The application uses a hybrid client-server model. The **Frontend** is built with React, TypeScript, Vite, Tailwind CSS, Wouter, and TanStack Query, offering both a public directory and an admin interface. The public directory primarily reads data from the backend API, while the admin interface handles all CRUD operations via the backend. Firebase Authentication with Google OAuth manages user logins.

The **Backend** is a Node.js Express server using the Firebase Admin SDK. It handles authenticated operations (CREATE, UPDATE, DELETE), validates Firebase auth tokens, and acts as a secure intermediary for Firestore interactions. It also proxies geocoding requests to Nominatim.

**Security Model**: Firebase Authentication secures user logins, and the backend verifies Firebase ID tokens for protected routes. Firestore security rules provide additional server-side protection.

**Key Features**:
- **Public Directory**: Geolocation-based search, distance calculation, premium listing prominence, advanced filtering, list/map views, detailed launderette pages with photos and reviews, and analytics.
- **City Pillar Pages**: Dedicated landing pages for 79 cities with AI-generated images, city-specific listings, filtered search, SEO-optimized meta tags, and AdSense integration. An index page groups cities by region.
- **Admin Interface**: Firebase Google authentication, dashboard with statistics, full CRUD for listings, auto-geocoding, premium listing toggle, feature tags management, and review moderation.

**Data Model**:
- **Launderette Schema**: Details such as name, address, coordinates, features, premium status, description, contact info, opening hours, price range, and timestamps.
- **Review Schema**: Launderette ID, rating, comment, reviewer name, and timestamp.
- **Analytics Event Schema**: Search and view events, queries, launderette IDs, user location, and timestamps.

**UI/UX Decisions**: The design combines Airbnb's cleanliness with Google Maps' functionality. Typography uses Inter and Manrope with a blue and gray color scheme. React Leaflet is used for interactive maps, and shadcn/ui and Radix UI provide UI components.

**Next.js Migration**: A comprehensive migration to Next.js 15 with App Router is complete for public-facing pages, aiming to improve SEO, performance, and Core Web Vitals through SSR, SSG, and ISR strategies. The admin interface remains a separate Vite application.

## External Dependencies
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Geocoding**: Nominatim (OpenStreetMap)
- **Mapping**: React Leaflet
- **Backend Services**: Node.js, Express, Firebase Admin SDK
- **Frontend Libraries**: React, TypeScript, Vite, Tailwind CSS, Wouter, TanStack Query
- **UI Libraries**: shadcn/ui, Radix UI
- **Monetization**: Google AdSense (Publisher ID: ca-pub-9361445858164574)