# LaunderetteNear.me - Next.js 15 Migration

This is the Next.js 15 migration of LaunderetteNear.me, implementing server-side rendering (SSR) and static site generation (SSG) for improved SEO and performance.

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Data Fetching:** TanStack Query (client) + Server Components (server)
- **Maps:** React Leaflet (dynamic import)
- **UI Components:** Radix UI + shadcn/ui
- **Monetization:** Google AdSense

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. Firebase project with Firestore database
3. Firebase Admin SDK credentials
4. Environment variables configured

### Installation

```bash
npm install
```

### Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase credentials:
   - Admin SDK credentials (server-side)
   - Client SDK credentials (client-side)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
nextjs-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Homepage (SSR)
│   ├── city/              # City pages (SSG + ISR)
│   ├── launderette/       # Detail pages (SSR/ISR)
│   └── blog/              # Blog posts (SSG)
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── firebase-admin.ts # Firebase Admin SDK (server)
│   ├── firebase-client.ts# Firebase Client SDK (client)
│   ├── server-data.ts    # Server-side data fetching
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── next.config.ts        # Next.js configuration
```

## Key Features

### Server-Side Rendering (SSR)
- Homepage with dynamic search
- Launderette detail pages
- Blog posts (if using dynamic content)

### Static Site Generation (SSG)
- 79 city pages (with ISR)
- Static pages (About, Contact, etc.)
- Blog posts (if static)

### Incremental Static Regeneration (ISR)
- City pages revalidate hourly
- On-demand revalidation via API

### SEO Optimization
- Server-rendered meta tags (OG, Twitter)
- Canonical URLs
- Schema.org structured data
- Dynamic sitemap generation

## Environment Variables

### Server-Side (Admin SDK)
```bash
FIREBASE_PROJECT_ID        # Firebase project ID
FIREBASE_CLIENT_EMAIL      # Service account email
FIREBASE_PRIVATE_KEY       # Service account private key
```

### Client-Side (Client SDK)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY       # Firebase API key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN   # Auth domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID    # Project ID
NEXT_PUBLIC_FIREBASE_APP_ID        # App ID
```

## Migration Status

- [x] Week 1: Project Setup & Core Infrastructure
- [ ] Week 2: Static Pages Migration
- [ ] Week 3: Dynamic Pages - Cities
- [ ] Week 4: Dynamic Pages - Launderettes & Blog
- [ ] Week 5: Admin Interface
- [ ] Week 6: SEO & Performance Optimization
- [ ] Week 7: Testing & QA
- [ ] Week 8: Deployment & Rollout

## Documentation

- **Migration Plan:** `../docs/nextjs-migration-plan.md`
- **SEO Testing Guide:** `../docs/seo-testing-guide.md`
- **Phase 1 Testing Report:** `../docs/phase1-testing-report.md`

## Performance Targets

- First Contentful Paint (FCP): < 1.0s
- Largest Contentful Paint (LCP): < 1.5s
- SEO Score: 100/100
- Accessibility Score: 100/100

## License

Private - LaunderetteNear.me
