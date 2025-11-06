# Deployment Guide - LaunderetteNear.me

## Dual-App Architecture

LaunderetteNear.me uses a dual-app deployment strategy:

1. **Next.js App** (`nextjs-app/`) - Public-facing pages with SSR/SSG
2. **Vite App** (`client/` + `server/`) - Admin interface

## Why This Approach?

- **Next.js**: Serves all public pages with server-side rendering for optimal SEO
- **Vite Admin**: Existing admin interface remains unchanged (internal-only, no SEO needed)
- **Best of Both**: Leverages Next.js SEO benefits while maintaining proven admin workflow

See `ADMIN.md` for detailed explanation of admin architecture decision.

## Production Deployment Options

### Option 1: Single Server, Different Ports (Recommended)

Deploy both apps on one server with different ports:

```
Public site (Next.js):  https://launderettenear.me  → Port 3000
Admin panel (Vite):     https://admin.launderettenear.me → Port 5000
```

**Setup:**
1. Deploy Next.js app to port 3000
2. Keep existing Vite app running on port 5000
3. Configure reverse proxy (nginx/Caddy) to route domains

**nginx Example:**
```nginx
# Public Next.js site
server {
  listen 80;
  server_name launderettenear.me www.launderettenear.me;
  location / {
    proxy_pass http://localhost:3000;
  }
}

# Admin Vite app
server {
  listen 80;
  server_name admin.launderettenear.me;
  location / {
    proxy_pass http://localhost:5000;
  }
}
```

### Option 2: Separate Deployments

Deploy to different hosting providers:

- **Next.js**: Vercel (optimized for Next.js apps)
- **Vite Admin**: Replit (continue using current setup)

**Benefits:**
- Isolated environments
- Easy rollback per app
- Scales independently

### Option 3: Monorepo Deployment

Package both apps together:

```
/public-app    → Next.js (SSR/SSG)
/admin-app     → Vite (SPA)
```

Deploy to platforms like:
- Railway
- Render
- DigitalOcean App Platform

## Environment Variables

### Next.js App Environment Variables

Create `.env.local` in `nextjs-app/`:

```bash
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (Client-side - use NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=1:XXXXX:web:XXXXX
```

**Important:** In production, use your hosting platform's secret management:
- Vercel: Environment Variables in dashboard
- Railway/Render: Secret management UI
- Self-hosted: System environment variables

### Vite Admin App (Existing)

No changes needed - continues using current environment variables.

## Build Process

### Next.js Production Build

```bash
cd nextjs-app
npm install
npm run build
npm run start
```

**Build Output:**
- `.next/` directory contains optimized build
- Static pages pre-rendered at build time
- ISR pages revalidate hourly in production

### Vite Admin Build (Existing)

```bash
npm run build
npm run start
```

## Performance Targets

The Next.js migration aims for:
- **First Contentful Paint (FCP):** <1.0s
- **Largest Contentful Paint (LCP):** <1.5s
- **Cumulative Layout Shift (CLS):** <0.1
- **Time to Interactive (TTI):** <2.0s
- **SEO Score:** 100/100

## SEO Verification After Deployment

1. **Test Sitemap:**
   - Visit https://launderettenear.me/sitemap.xml
   - Verify all pages listed (79 cities + 1,057+ launderettes + blog posts)

2. **Test robots.txt:**
   - Visit https://launderettenear.me/robots.txt
   - Confirm admin blocked, sitemap referenced

3. **Submit to Search Engines:**
   ```
   Google Search Console: Submit sitemap URL
   Bing Webmaster Tools: Submit sitemap URL
   ```

4. **Verify Schema.org:**
   - Use Google Rich Results Test
   - Test launderette detail pages for LocalBusiness schema
   - Test blog posts for Article schema

5. **Test Social Sharing:**
   - Facebook Sharing Debugger
   - Twitter Card Validator
   - LinkedIn Post Inspector

## Monitoring & Analytics

### Core Web Vitals

Monitor with:
- Google Search Console (Core Web Vitals report)
- PageSpeed Insights
- Lighthouse CI

### Error Tracking

Set up error monitoring:
- Sentry
- LogRocket
- New Relic

### Analytics

- Google Analytics 4
- Track search queries, popular listings
- Monitor conversion from search → launderette view

## Rollback Strategy

If issues occur:

1. **Quick Rollback:** Point domain back to Vite app temporarily
2. **Partial Rollback:** Keep admin on Vite, investigate Next.js issues
3. **Full Forward:** Fix Next.js issues, maintain dual-app architecture

## Post-Deployment Checklist

- [ ] Next.js app builds successfully
- [ ] All environment variables configured
- [ ] Sitemap accessible and complete
- [ ] robots.txt configured correctly
- [ ] Firebase connections working (both Admin and Client SDKs)
- [ ] AdSense ads displaying correctly
- [ ] Schema.org markup validated
- [ ] Core Web Vitals meet targets
- [ ] Admin interface accessible (separate subdomain)
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Monitoring and alerts set up

## Support & Troubleshooting

### Common Issues

**1. Firebase Connection Errors:**
- Verify environment variables are set correctly
- Check private key formatting (newlines as `\n`)
- Ensure Firebase project has Firestore enabled

**2. ISR Not Working:**
- Check revalidate value in page files
- Verify Firestore queries return data
- Check Next.js build logs

**3. AdSense Not Showing:**
- Verify publisher ID correct (ca-pub-9361445858164574)
- Check ad slots configured
- Wait 24-48hrs for ad approval

## Timeline

- **Week 7:** Complete migration, create deployment documentation ✅
- **Week 8:** Production deployment, testing, monitoring setup
- **Week 9+:** Optimization, SEO monitoring, iterative improvements

## Contact

For technical questions about the Next.js architecture, see:
- `nextjs-app/ADMIN.md` - Admin interface architecture
- `nextjs-app/SETUP.md` - Development setup
- `docs/nextjs-migration-plan.md` - Full migration plan
