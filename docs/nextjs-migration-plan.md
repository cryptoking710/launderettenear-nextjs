# Next.js Migration Plan - LaunderetteNear.me
## Phase 2: Server-Side Rendering & Static Site Generation

---

## Executive Summary

This document outlines the comprehensive migration strategy from the current React + Vite + Wouter stack to Next.js 15 with App Router, enabling server-side rendering (SSR) and static site generation (SSG) for improved SEO, performance, and social media sharing.

**Migration Goals**:
1. Enable SSR for all public pages to support social media crawlers
2. Implement SSG for static content (city pages, blog posts)
3. Use ISR (Incremental Static Regeneration) for launderette listings
4. Preserve all existing functionality (maps, admin, auth, AdSense)
5. Improve Core Web Vitals and page load performance
6. Maintain or improve development experience

---

## 1. Architecture Decision: App Router vs Pages Router

### Recommendation: **App Router (Next.js 15)**

**Rationale**:
- Latest Next.js paradigm with better performance
- Native server components support (reduced JavaScript bundle)
- Improved streaming and suspense capabilities
- Better TypeScript support
- Easier data fetching with async server components
- More intuitive file-based routing
- Better suited for our mix of static and dynamic content

**Trade-offs**:
- Slightly steeper learning curve
- Some client-side libraries need `'use client'` directive
- Less Stack Overflow answers (newer)

**Alternative**: Pages Router is more mature but lacks modern features we need for optimal performance.

---

## 2. Rendering Strategy by Route Type

### 2.1 Homepage `/`
**Strategy**: Server-Side Rendering (SSR) with streaming
**Reasoning**: Dynamic search functionality, needs latest data, benefits from SSR for SEO

**Implementation**:
```typescript
// app/page.tsx
export default async function HomePage() {
  const { launderettes, cities } = await fetchInitialData();
  
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema totalLaunderettes={launderettes.length} totalCities={cities.length} />
      <ItemListSchema launderettes={launderettes.slice(0, 100)} />
      <SearchInterface initialData={launderettes} />
    </>
  );
}
```

**Data fetching**: Server-side with Firebase Admin SDK

---

### 2.2 City Pages `/city/[cityName]`
**Strategy**: Static Site Generation (SSG) with ISR
**Reasoning**: 79 cities, content changes infrequently, perfect for static generation

**Implementation**:
```typescript
// app/city/[cityName]/page.tsx
export async function generateStaticParams() {
  const cities = await getAllCities();
  return cities.map(city => ({ cityName: city }));
}

export const revalidate = 3600; // ISR: Revalidate every hour

export default async function CityPage({ params }: { params: { cityName: string } }) {
  const { launderettes, cityInfo } = await getCityData(params.cityName);
  
  return (
    <>
      <SEOTags {...cityMetadata} />
      <FAQPageSchema faqs={cityInfo.faqs} />
      <CityHero city={params.cityName} />
      <LaunderetteList launderettes={launderettes} />
    </>
  );
}
```

**Benefits**:
- Pre-rendered at build time (79 pages)
- Fast page loads
- Perfect for SEO
- ISR keeps content fresh without rebuilds

---

### 2.3 Cities Index `/cities`
**Strategy**: Static Site Generation (SSG)
**Reasoning**: Simple navigation page, rarely changes

**Implementation**:
```typescript
// app/cities/page.tsx
export const revalidate = 86400; // Revalidate daily

export default async function CitiesIndexPage() {
  const citiesByRegion = await getCitiesGroupedByRegion();
  return <CitiesIndex cities={citiesByRegion} />;
}
```

---

### 2.4 Launderette Detail `/launderette/[id]`
**Strategy**: Server-Side Rendering (SSR) or ISR
**Reasoning**: 1,057+ pages, content updates frequently (reviews, ratings), too many for full SSG

**Option A - SSR** (Recommended):
```typescript
// app/launderette/[id]/page.tsx
export default async function LaunderettePage({ params }: { params: { id: string } }) {
  const launderette = await getLaunderetteById(params.id);
  const reviews = await getReviews(params.id);
  const averageRating = calculateAverage(reviews);
  
  return (
    <>
      <SEOTags {...buildMetadata(launderette)} />
      <SchemaMarkup launderette={launderette} averageRating={averageRating} reviewCount={reviews.length} />
      <LaunderetteDetail launderette={launderette} reviews={reviews} />
    </>
  );
}
```

**Option B - ISR with On-Demand Revalidation**:
```typescript
export const revalidate = 3600; // Revalidate hourly

export async function generateStaticParams() {
  const topLaunderettes = await getTopLaunderettes(100); // Pre-render top 100
  return topLaunderettes.map(l => ({ id: l.id }));
}

export const dynamicParams = true; // Allow other IDs to be SSR'd
```

**Recommendation**: Start with SSR, evaluate ISR performance after launch.

---

### 2.5 Blog Pages `/blog` and `/blog/[slug]`
**Strategy**: Static Site Generation (SSG)
**Reasoning**: 12 posts, content rarely changes, perfect for static generation

**Blog Index**:
```typescript
// app/blog/page.tsx
export const revalidate = 86400; // Daily revalidation

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  return <BlogListing posts={posts} />;
}
```

**Blog Post**:
```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  return (
    <>
      <SEOTags type="article" {...post.metadata} />
      <ArticleSchema post={post} />
      <BlogPost content={post} />
    </>
  );
}
```

---

### 2.6 Static Pages (About, Contact, Privacy, Terms, Laundry Symbols)
**Strategy**: Static Site Generation (SSG)
**Reasoning**: Pure static content

**Implementation**:
```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <AboutContent />;
}
```

---

### 2.7 Admin Interface `/admin/*`
**Strategy**: Client-Side Rendering (CSR) with auth
**Reasoning**: Admin features require client-side state, Firebase auth, not for SEO

**Implementation**:
```typescript
// app/admin/layout.tsx
'use client';

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Redirect to="/login" />;
  
  return <AdminShell>{children}</AdminShell>;
}
```

**Key points**:
- Keep existing Firebase client-side auth flow
- All admin pages use `'use client'` directive
- No SSR needed for admin area

---

## 3. Data Fetching Strategy

### 3.1 Server-Side Data Fetching (SSR/SSG)

**Use Firebase Admin SDK** for server components:

```typescript
// lib/firebase-admin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminDb = getFirestore();
```

**Data fetching utilities**:
```typescript
// lib/server-data.ts
import { adminDb } from './firebase-admin';

export async function getAllLaunderettes() {
  const snapshot = await adminDb.collection('launderettes').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getLaunderetteById(id: string) {
  const doc = await adminDb.collection('launderettes').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function getCityLaunderettes(cityName: string) {
  const snapshot = await adminDb
    .collection('launderettes')
    .where('city', '==', cityName)
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

---

### 3.2 Client-Side Data Fetching (Client Components)

**Continue using TanStack Query** for client components:

```typescript
// app/launderette/[id]/reviews-section.tsx
'use client';

import { useQuery } from '@tanstack/react-query';

export function ReviewsSection({ launderetteId }: { launderetteId: string }) {
  const { data: reviews } = useQuery({
    queryKey: ['/api/reviews', launderetteId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?launderetteId=${launderetteId}`);
      return res.json();
    },
  });
  
  return <ReviewsList reviews={reviews} />;
}
```

**Hybrid approach**: Server components for initial data, client components for interactivity.

---

## 4. Component Migration Strategy

### 4.1 Server Components (Default)
- Schema markup components
- SEO tags (migrate to Next.js Metadata API)
- Static content sections
- Data display components

### 4.2 Client Components (Require `'use client'`)
- Interactive maps (React Leaflet)
- Search interface with filters
- Forms (react-hook-form)
- Admin interface
- Auth components
- TanStack Query hooks
- State management (if any)

### 4.3 Migration Pattern

**Before (Vite + React)**:
```typescript
// client/src/pages/city-detail.tsx
export default function CityDetail() {
  const { data } = useQuery({ queryKey: [...] });
  return <CityContent data={data} />;
}
```

**After (Next.js App Router)**:
```typescript
// app/city/[cityName]/page.tsx (Server Component)
export default async function CityPage({ params }) {
  const data = await getCityData(params.cityName);
  return <CityContent data={data} />;
}

// components/city-content.tsx (Client Component if interactive)
'use client';
export function CityContent({ data }) {
  // Interactive features here
}
```

---

## 5. SEO Metadata Migration

### Current Approach (Client-Side)
- SEOTags component sets meta tags via JavaScript
- Open Graph tags added after page load
- Crawlers may not see tags

### Next.js Approach (Server-Side)

**Use Metadata API**:
```typescript
// app/city/[cityName]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const cityData = await getCityData(params.cityName);
  
  return {
    title: `Launderettes in ${params.cityName} | Find ${cityData.count} Laundries Near You`,
    description: `Find ${cityData.count} launderettes in ${params.cityName}. Compare prices, read reviews, check opening hours. ${params.cityName}'s most trusted launderette directory.`,
    openGraph: {
      title: `Launderettes in ${params.cityName}`,
      description: `${cityData.count} launderettes with reviews and ratings`,
      url: `https://launderettenear.me/city/${params.cityName}`,
      images: [
        {
          url: cityData.heroImage,
          width: 1200,
          height: 630,
          alt: `${params.cityName} landmark`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Launderettes in ${params.cityName}`,
      description: `${cityData.count} launderettes with reviews`,
      images: [cityData.heroImage],
    },
  };
}
```

**Benefits**:
- Meta tags in initial HTML (crawlers see them)
- Type-safe with TypeScript
- Automatic deduplication
- Better social media sharing

---

## 6. React Leaflet Maps Migration

### Challenge
React Leaflet depends on browser APIs (window, document), which don't exist in server components.

### Solution: Dynamic Import with `ssr: false`

```typescript
// components/map-wrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('./interactive-map'),
  { 
    ssr: false,
    loading: () => <MapSkeleton />
  }
);

export function MapWrapper({ launderettes }) {
  return <MapComponent launderettes={launderettes} />;
}
```

```typescript
// components/interactive-map.tsx
'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

export default function InteractiveMap({ launderettes }) {
  return (
    <MapContainer center={[51.5074, -0.1278]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup>
        {launderettes.map(l => (
          <Marker key={l.id} position={[l.lat, l.lng]} />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
```

**Import Leaflet CSS in layout**:
```typescript
// app/layout.tsx
import 'leaflet/dist/leaflet.css';
```

---

## 7. Firebase Authentication Migration

### Keep Client-Side Auth Flow

**Auth Context** (client component):
```typescript
// components/auth-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Use in root layout**:
```typescript
// app/layout.tsx
import { AuthProvider } from '@/components/auth-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Protected routes** continue using client-side checks.

---

## 8. TanStack Query Migration

### Root Layout Setup

```typescript
// app/layout.tsx
import { QueryProvider } from '@/components/query-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

```typescript
// components/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Usage in client components** remains the same.

---

## 9. API Routes Migration

### Current Setup
Express routes in `server/routes.ts`

### Next.js Approach
API routes in `app/api/` directory

**Example**:
```typescript
// app/api/launderettes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city');
  
  let query = adminDb.collection('launderettes');
  
  if (city) {
    query = query.where('city', '==', city);
  }
  
  const snapshot = await query.get();
  const launderettes = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  
  return NextResponse.json({ launderettes });
}
```

**Protected routes** (admin operations):
```typescript
// app/api/admin/launderettes/route.ts
import { verifyAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Admin operation
  const body = await request.json();
  // ...
}
```

---

## 10. AdSense Integration

### Current Implementation
Client-side AdSense components

### Next.js Migration

**Same approach** - AdSense is client-side:

```typescript
// components/adsense-ad.tsx
'use client';

import { Adsense } from '@ctrl/react-adsense';

export function AdsenseAd({ slot }: { slot: string }) {
  return (
    <Adsense
      client="ca-pub-9361445858164574"
      slot={slot}
      style={{ display: 'block' }}
      format="auto"
      responsive="true"
    />
  );
}
```

**Add AdSense script** in layout:
```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9361445858164574"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 11. Sitemap & Robots.txt

### Next.js Built-in Support

**Sitemap**:
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllLaunderettes, getAllCities, getAllBlogPosts } from '@/lib/server-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const launderettes = await getAllLaunderettes();
  const cities = await getAllCities();
  const blogPosts = await getAllBlogPosts();
  
  return [
    {
      url: 'https://launderettenear.me',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://launderettenear.me/cities',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...cities.map(city => ({
      url: `https://launderettenear.me/city/${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...launderettes.map(l => ({
      url: `https://launderettenear.me/launderette/${l.id}`,
      lastModified: new Date(l.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...blogPosts.map(post => ({
      url: `https://launderettenear.me/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
```

**Robots.txt**:
```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin',
    },
    sitemap: 'https://launderettenear.me/sitemap.xml',
  };
}
```

---

## 12. Migration Steps (Phased Approach)

### Phase 1: Project Setup (Week 1)
1. ✅ Initialize Next.js 15 project with App Router
2. ✅ Configure TypeScript, ESLint, Prettier
3. ✅ Set up Tailwind CSS
4. ✅ Install and configure dependencies:
   - Firebase (client + admin SDKs)
   - TanStack Query
   - React Leaflet
   - shadcn/ui components
   - Other UI libraries
5. ✅ Set up environment variables
6. ✅ Configure Firebase Admin SDK

### Phase 2: Core Infrastructure (Week 2)
1. ✅ Create root layout with providers
2. ✅ Migrate authentication system
3. ✅ Set up TanStack Query provider
4. ✅ Create server-side data fetching utilities
5. ✅ Set up API routes structure
6. ✅ Configure sitemap and robots.txt

### Phase 3: Static Pages Migration (Week 2-3)
1. ✅ Migrate homepage (SSR)
2. ✅ Migrate static pages (About, Contact, etc.)
3. ✅ Migrate laundry symbols page
4. ✅ Test and verify SEO metadata

### Phase 4: City Pages Migration (Week 3)
1. ✅ Implement city pages with SSG
2. ✅ Set up generateStaticParams for 79 cities
3. ✅ Configure ISR revalidation
4. ✅ Migrate city hero images
5. ✅ Test FAQPage schema

### Phase 5: Launderette Details (Week 4)
1. ✅ Implement launderette detail pages (SSR)
2. ✅ Migrate SchemaMarkup component
3. ✅ Implement reviews section
4. ✅ Test LocalBusiness schema

### Phase 6: Blog Migration (Week 4)
1. ✅ Migrate blog index page (SSG)
2. ✅ Migrate individual blog posts (SSG)
3. ✅ Set up generateStaticParams for posts
4. ✅ Verify Article schema

### Phase 7: Interactive Features (Week 5)
1. ✅ Migrate React Leaflet maps with dynamic import
2. ✅ Migrate search interface (client component)
3. ✅ Migrate filtering components
4. ✅ Test map clustering and markers

### Phase 8: Admin Interface (Week 5-6)
1. ✅ Migrate admin layout
2. ✅ Migrate admin pages (dashboard, listings, reviews)
3. ✅ Migrate forms and CRUD operations
4. ✅ Test authentication flow

### Phase 9: AdSense Integration (Week 6)
1. ✅ Migrate AdSense components
2. ✅ Add AdSense script to layout
3. ✅ Verify ad placement on detail pages
4. ✅ Test policy compliance

### Phase 10: Testing & Optimization (Week 7)
1. ✅ Test all pages for SSR/SSG correctness
2. ✅ Verify Open Graph tags in initial HTML
3. ✅ Test social media sharing
4. ✅ Run Lighthouse audits
5. ✅ Optimize Core Web Vitals
6. ✅ Test Schema.org markup
7. ✅ Verify sitemap generation

### Phase 11: Deployment (Week 8)
1. ✅ Set up production environment
2. ✅ Configure Firebase production credentials
3. ✅ Deploy to Replit (or Vercel)
4. ✅ Test production build
5. ✅ Submit new sitemap to search engines
6. ✅ Monitor for issues

---

## 13. Risk Mitigation

### Risk 1: Firebase Quota Limits
**Issue**: SSG builds query Firestore 1,000+ times
**Mitigation**: 
- Use caching during build
- Implement read batching
- Consider Firestore exports for build-time data

### Risk 2: Build Time Too Long
**Issue**: 1,057 SSG pages = slow builds
**Mitigation**:
- Use ISR instead of full SSG for launderettes
- Pre-render only top 100 launderettes
- Use SSR for less popular listings

### Risk 3: Map Hydration Issues
**Issue**: Leaflet might have SSR/CSR mismatch
**Mitigation**:
- Use dynamic import with ssr: false
- Test thoroughly in development
- Add proper loading states

### Risk 4: Breaking Changes
**Issue**: Existing URLs must continue working
**Mitigation**:
- Maintain same route structure
- Set up redirects if needed
- Test all existing URLs

### Risk 5: Firebase Client SDK Size
**Issue**: Large bundle size for client-side Firebase
**Mitigation**:
- Use modular imports
- Code-split admin features
- Lazy load Firebase client where possible

---

## 14. Performance Targets

### Current Performance (Vite + React CSR)
- First Contentful Paint: ~2.5s
- Time to Interactive: ~3.5s
- Largest Contentful Paint: ~3.0s
- Cumulative Layout Shift: ~0.1

### Target Performance (Next.js SSR/SSG)
- First Contentful Paint: <1.0s
- Time to Interactive: <2.0s
- Largest Contentful Paint: <1.5s
- Cumulative Layout Shift: <0.05
- SEO Score: 100/100

**Optimization strategies**:
- Server-side rendering for instant first paint
- Static generation for city pages
- Image optimization with next/image
- Font optimization
- Bundle size reduction
- Code splitting

---

## 15. Development Environment

### Recommended Setup
- **Node.js**: v20+
- **Package Manager**: npm or pnpm
- **Next.js**: 15.x
- **React**: 18.x
- **TypeScript**: 5.x

### Key Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "firebase": "^10.x",
    "firebase-admin": "^12.x",
    "@tanstack/react-query": "^5.x",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "react-leaflet-cluster": "^2.1.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 16. Testing Strategy

### Unit Tests
- Server-side data fetching functions
- Metadata generation functions
- Schema markup builders

### Integration Tests
- API routes
- SSR page rendering
- SSG builds

### E2E Tests
- Critical user flows
- Admin operations
- Search functionality

### SEO Tests
- Meta tags in initial HTML
- Schema.org validation
- Sitemap accuracy
- Social media previews

---

## 17. Post-Migration Checklist

- [ ] All pages render correctly
- [ ] Meta tags in initial HTML (view source)
- [ ] Social media sharing works (test with debuggers)
- [ ] Schema.org markup passes Rich Results Test
- [ ] Sitemap generates correctly
- [ ] Search functionality works
- [ ] Maps load and cluster correctly
- [ ] Admin interface fully functional
- [ ] Firebase auth working
- [ ] AdSense displaying correctly
- [ ] Core Web Vitals meet targets
- [ ] All 1,057 listings accessible
- [ ] All 79 city pages render
- [ ] All 12 blog posts accessible
- [ ] No broken links
- [ ] No console errors
- [ ] Lighthouse scores 90+ across the board

---

## 18. Rollback Plan

**If issues occur**:
1. Keep current Vite app running during migration
2. Test Next.js app on staging domain
3. Use feature flags for gradual rollout
4. DNS can quickly revert to old app if critical issues

**Backup strategy**:
- Maintain both codebases temporarily
- Gradual traffic shift (10% → 50% → 100%)
- Monitor error rates and performance

---

## 19. Timeline Summary

**Total Estimated Time**: 8 weeks

- Week 1: Project setup
- Week 2-3: Core pages migration
- Week 4: Content pages (launderettes, blog)
- Week 5: Interactive features
- Week 5-6: Admin interface
- Week 7: Testing & optimization
- Week 8: Deployment

**Contingency**: +2 weeks buffer

---

## 20. Success Metrics

### SEO Metrics (3 months post-launch)
- Organic traffic increase: +50%
- Average position improvement: Top 10 for target keywords
- Rich results appearing in search
- Social media shares increase: +30%

### Performance Metrics
- Core Web Vitals: All metrics "Good"
- Lighthouse SEO score: 100/100
- Page load time: <1.5s average

### Technical Metrics
- Build time: <10 minutes
- Zero console errors in production
- Uptime: 99.9%+

---

## Next Steps

1. **Approval**: Review and approve this migration plan
2. **Environment Setup**: Create Next.js project structure
3. **Spike**: Build proof-of-concept for critical features (maps, auth, SSR)
4. **Begin Phase 1**: Initialize Next.js project and dependencies
5. **Weekly Reviews**: Track progress against timeline

---

## Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [React Leaflet Next.js Example](https://react-leaflet.js.org/docs/example-react-leaflet-next/)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [TanStack Query Next.js Guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)

---

**Document Version**: 1.0  
**Last Updated**: November 3, 2025  
**Author**: AI Development Team  
**Status**: Pending Approval
