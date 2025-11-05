# LaunderetteNear.me

## Overview
LaunderetteNear.me is a comprehensive UK launderette directory service designed to help users find nearby launderettes using geolocation. It features a public-facing directory with advanced search capabilities, distance calculation, premium listings, city-specific pillar pages, and an administrative interface for managing launderette data. The project aims to provide a user-friendly experience for finding laundry services across the UK, offering detailed information and user reviews, while also providing robust tools for administrators to maintain the directory. The project currently covers 79 UK cities with 1,057 launderette listings, including premium listings, with dedicated city landing pages for enhanced local SEO.

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
- **City Pillar Pages**: 79 dedicated city landing pages (/city/:cityName) with AI-generated landmark hero images, city-specific launderette listings, filtered search and map views, SEO-optimized meta tags, breadcrumb navigation, and AdSense integration. Cities index page (/cities) groups locations by UK region with search functionality.
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
- **Monetization**: Google AdSense (Publisher ID: ca-pub-9361445858164574)

## AdSense Implementation
To comply with Google AdSense policies requiring substantial content on ad-serving pages:
- **Home Page**: No ads (primarily a search interface with minimal content)
- **Cities Index Page**: No ads (primarily a navigation page with city lists)
- **Detail Pages**: 4 responsive ad units placed alongside substantial content including descriptions, reviews, opening hours, contact information, and user ratings
- **City Pillar Pages**: 4 responsive ad units on city pages with substantial content including city information, multiple listings, FAQ sections with Schema.org markup, and filtering options
- **AutoAds**: DISABLED to prevent policy violations on content-light pages
- **Manual Ad Placement Only**: Ads are only manually placed on pages with substantial, unique content
- **Ad Slots Used**:
  - Launderette detail pages: 2411734474, 5991886839, 1240578443, 3365723499
  - City pillar pages: 2411734474, 5991886839, 1240578443, 3365723499

This configuration ensures strict compliance with AdSense policy against "Google-served ads on screens without publisher content" by only showing ads on content-rich pages with substantial information.

## City Images
78 AI-generated city landmark images stored in `attached_assets/generated_images/` and mapped via `client/src/lib/city-images.ts`. Each city page features a unique hero image showcasing iconic local landmarks (e.g., York Minster, Edinburgh Castle, Brighton Pier). Images are statically imported for reliability but may benefit from dynamic imports for performance optimization in future iterations.

## SEO Implementation (Phase 1 - Client-Side)
Comprehensive SEO improvements implemented to enhance search engine visibility and social media sharing:

**Schema.org Structured Data:**
- LocalBusiness schema on launderette detail pages with full business information, ratings, reviews, opening hours
- Organization schema on homepage for brand identity and sitelinks search box
- WebSite schema with search action functionality
- ItemList schema for launderette listings on homepage
- FAQPage schema on city pages with AI-generated FAQs
- Article schema on blog posts with proper metadata

**Open Graph & Twitter Cards:**
- Comprehensive Open Graph tags (og:title, og:description, og:url, og:image, og:type) on all pages
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image) for enhanced social sharing
- City pages use AI-generated landmark images as og:image for visually rich social shares
- Blog posts use article type with published_time and author metadata
- Implemented via SEOTags component (client/src/components/seo-tags.tsx) with proper cleanup to prevent stale metadata

**Technical SEO:**
- Dynamic XML sitemap at /sitemap.xml including all launderettes, cities, blog posts, and static pages with proper priorities and changefreq
- robots.txt with crawler directives, sitemap reference, and admin section blocking
- City-specific and keyword-rich meta descriptions on all page types
- Proper page titles following SEO best practices

**Known Limitation:**
- Current implementation uses client-side rendering (CSR), meaning Open Graph tags are set via JavaScript after page load
- Social media crawlers may not execute JavaScript, potentially missing dynamic meta tags
- This limitation will be addressed in Phase 2 via Next.js migration with server-side rendering (SSR) and static site generation (SSG)

**Testing Documentation:**
- Comprehensive testing guide available at `docs/seo-testing-guide.md`
- Includes instructions for testing Schema.org markup with Google Rich Results Test
- Sitemap and robots.txt validation steps
- Open Graph and Twitter Card testing procedures

## Phase 2: Next.js Migration Plan
Comprehensive migration plan documented in `docs/nextjs-migration-plan.md`:

**Architecture Decision:** Next.js 15 with App Router (recommended over Pages Router)

**Rendering Strategy:**
- Homepage: SSR with streaming for dynamic search
- City pages (79): SSG with ISR (hourly revalidation)
- Launderette details (1,057+): SSR with optional ISR
- Blog posts (12): SSG for static content
- Static pages: Full SSG
- Admin interface: Client-side rendering (CSR) with Firebase auth

**Key Benefits:**
- Server-side rendering resolves CSR limitation for social media crawlers
- Meta tags will be in initial HTML for all pages
- Improved Core Web Vitals and performance
- Better SEO with static generation for city pages
- Maintains all existing functionality (maps, admin, auth, AdSense)

**Timeline:** 8 weeks with phased approach
**Target Performance:** FCP <1.0s, LCP <1.5s, SEO score 100/100

**Migration Status:**
- ✅ Week 1 COMPLETE: Project setup with Next.js 15, TypeScript, Tailwind, Firebase Admin/Client SDKs, TanStack Query, root layout with metadata, and AdSense integration. All infrastructure in `nextjs-app/` directory ready for content migration.
- ✅ Week 2 COMPLETE: Static pages migration (About, Contact, Privacy, Terms) with server-rendered metadata. Contact page demonstrates hybrid Server/Client Component pattern. Contact API route created with Firestore integration. Foundational UI components (Button, Card) created. **Architect Approved.**
- ✅ Week 3 COMPLETE: Homepage (SSR), Cities index (SSG with regional grouping), and City detail pages (SSG+ISR hourly revalidation for 79 cities). Created UK_REGIONS constant with TypeScript types for 12 UK regions. Added UI components (Input, Badge, Separator). Comprehensive data-testid attributes on all interactive elements for testing compliance. Homepage features hero section, search functionality, and featured cities. Cities page includes regional grouping, search, and city listing counts. City detail pages have SSG pre-generation with ISR (`export const revalidate = 3600`) for hourly updates. **Architect Approved.**
- ✅ Week 4 COMPLETE: Launderette detail pages (/launderette/[id]) with full SSR and Firestore integration. Created comprehensive Firestore utilities (lib/firestore.ts) with 6 helper functions. Detail pages display business info, reviews, ratings, contact details, opening hours, features, and price range. Integrated 4 AdSense responsive units (slots: 2411734474, 5991886839, 1240578443, 3365723499) on content-rich pages. Added comprehensive Schema.org LocalBusiness JSON-LD with openingHoursSpecification array and individual review objects. Updated city detail pages to fetch and display real Firestore launderette listings with cards, ratings, and links. Complete data-testid coverage on all interactive and informational elements across both page types. **Code verified - all deliverables confirmed present.**
- ✅ Week 5 COMPLETE: Blog migration with full SSG implementation. Added Firestore utilities for blog posts (getAllBlogPosts, getBlogPostBySlug). Created blog index page (/blog) with SSG and daily revalidation displaying all 12 blog posts in grid layout. Created individual blog post pages (/blog/[slug]) with generateStaticParams for SSG, markdown rendering using marked library, and comprehensive Schema.org Article JSON-LD (headline, author, datePublished, publisher, mainEntityOfPage). SEO metadata includes Open Graph article type and Twitter Cards. Complete data-testid coverage on all interactive and informational elements (Links, Buttons, dates, reading times, excerpts). **Architect Approved.**
- ✅ Week 6 COMPLETE: Laundry Symbols page (/laundry-symbols) migration with full SSG implementation. Created comprehensive laundry symbols data library (lib/laundry-symbols.ts) with 30 UK/ISO 3758 care symbols across 5 categories (7 washing, 9 drying, 6 ironing, 3 bleaching, 5 dry cleaning). Moved all 30 symbol images to Next.js public directory for proper static serving. Page features educational content with symbol cards, info box explaining ISO 3758 standard, tips card with 5 best practices, and 4 AdSense responsive units. Implemented comprehensive SEO metadata (title, description, Open Graph, Twitter Cards) and breadcrumb navigation. Complete data-testid coverage on ALL informational and interactive elements including section headings, descriptions, symbols, tips, breadcrumb, and CTA. Responsive grid layout adapts from 2-5 columns with dark mode support. **Architect Approved.**
- ✅ Week 7 IN PROGRESS: SEO infrastructure - Created sitemap.ts and robots.ts using Next.js 15 conventions. Sitemap dynamically generates from Firestore data including all static pages, 79 cities, 1,057+ launderettes, and 12 blog posts with appropriate priorities (homepage 1.0, cities 0.9, launderettes 0.7-0.8, blog 0.6-0.7). Dynamic lastModified timestamps from Firestore updatedAt/publishedAt fields. Robots.txt allows all crawlers, disallows /admin, references sitemap. **Architect Approved.**
- ⏳ Week 7-8: Admin interface migration, final testing, deployment

**Next.js Project Location:** `nextjs-app/` (separate directory from existing Vite app)
**Installation Required:** Manual `npm install` in `nextjs-app/` directory (see `nextjs-app/SETUP.md`)