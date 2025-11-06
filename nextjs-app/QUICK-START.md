# Quick Start Guide - Next.js App

## Step 1: Install Dependencies

Open the Shell and run:

```bash
cd nextjs-app
npm install
```

This will install all Next.js 15 dependencies (~5 minutes first time).

## Step 2: Start the Development Server

**Option A: Using the startup script (Recommended)**

```bash
cd nextjs-app
bash install-and-run.sh
```

This script checks if dependencies are installed and starts the dev server.

**Option B: Direct npm command**

```bash
cd nextjs-app
npm run dev
```

## Step 3: Access the App

Once started, visit: **http://localhost:3000**

You should see:
- ✅ Homepage with search functionality
- ✅ City pages with listings
- ✅ Launderette detail pages
- ✅ Blog posts with markdown rendering
- ✅ Laundry symbols educational page
- ✅ Static pages (About, Contact, Privacy, Terms)

## Creating a Replit Workflow (Optional)

To add the Next.js app as a workflow button:

1. Click the three dots (...) next to "Run" button
2. Select "Configure Run Button"
3. Add a new workflow:
   - **Name:** Start Next.js App
   - **Command:** `cd nextjs-app && bash install-and-run.sh`
   - **Wait for port:** 3000

This creates a clickable button to start the Next.js app alongside the existing Vite admin app.

## Running Both Apps Simultaneously

To run both the Vite admin and Next.js public site:

**Terminal 1 (Vite Admin):**
```bash
npm run dev
```
This runs on port 5000 → http://localhost:5000

**Terminal 2 (Next.js Public):**
```bash
cd nextjs-app
npm run dev
```
This runs on port 3000 → http://localhost:3000

## Testing the Migration

### Homepage (SSR)
Visit: http://localhost:3000
- Search bar should work
- Featured cities should display
- Hero section with call-to-action

### Cities Index (SSG)
Visit: http://localhost:3000/cities
- All 79 cities grouped by region
- Search and filter functionality
- Listing counts per city

### City Detail Pages (SSG + ISR)
Visit: http://localhost:3000/city/London
- City-specific listings from Firestore
- Map view with markers
- AdSense ads on content-rich page

### Launderette Detail Pages (SSR)
Visit: http://localhost:3000/launderette/[any-id]
- Full business details
- Reviews and ratings
- Opening hours, features, contact info
- Schema.org LocalBusiness JSON-LD
- 4 AdSense units

### Blog Posts (SSG)
Visit: http://localhost:3000/blog
Visit: http://localhost:3000/blog/[any-slug]
- Blog index with all posts
- Individual posts with markdown rendering
- Schema.org Article JSON-LD

### Laundry Symbols (SSG)
Visit: http://localhost:3000/laundry-symbols
- 30 care symbols with descriptions
- Educational content
- AdSense integration

### SEO Files
- Sitemap: http://localhost:3000/sitemap.xml
- Robots: http://localhost:3000/robots.txt

## Troubleshooting

### "Module not found" errors
```bash
cd nextjs-app
rm -rf node_modules package-lock.json
npm install
```

### Firebase connection errors

The Next.js app requires Firebase environment variables with `NEXT_PUBLIC_` prefix (not `VITE_`):

**Server-side (Firebase Admin SDK):**
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

**Client-side (Firebase Client SDK):**
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

See `SETUP.md` for detailed Firebase configuration instructions.

Note: The existing Replit secrets use `VITE_` prefix for the Vite admin app. You'll need to either:
1. Create new secrets with `NEXT_PUBLIC_` prefix, or
2. Create `.env.local` file in nextjs-app/ directory with the correct variables

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

Then restart the dev server.

### TypeScript errors
```bash
cd nextjs-app
npm run build
```

This shows all type errors. The migration should have no TypeScript errors.

## Next Steps

After verifying the Next.js app works locally:

1. Review `DEPLOYMENT.md` for production deployment options
2. Review `ADMIN.md` to understand the dual-app architecture
3. Set up monitoring and analytics (see DEPLOYMENT.md)
4. Submit sitemap to Google Search Console
5. Monitor Core Web Vitals and SEO performance

## File Structure

```
nextjs-app/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Homepage (SSR)
│   ├── cities/page.tsx    # Cities index (SSG)
│   ├── city/[cityName]/   # City detail (SSG + ISR)
│   ├── launderette/[id]/  # Launderette detail (SSR)
│   ├── blog/              # Blog pages (SSG)
│   ├── laundry-symbols/   # Symbols page (SSG)
│   ├── about/             # Static pages (SSG)
│   ├── contact/           # Contact with API route
│   ├── privacy/           # Privacy policy (SSG)
│   ├── terms/             # Terms of service (SSG)
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── robots.ts          # Robots.txt
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and data access
│   ├── firestore.ts      # Firestore server queries
│   ├── firebase-admin.ts # Firebase Admin SDK
│   ├── firebase-client.ts# Firebase Client SDK
│   ├── regions.ts        # UK regions and cities
│   └── laundry-symbols.ts# Symbols data
├── public/               # Static assets
└── package.json          # Dependencies
```

## Support

For questions or issues:
- See SETUP.md for detailed setup instructions
- See DEPLOYMENT.md for production deployment
- See ADMIN.md for admin interface architecture
- Check replit.md for full project documentation
