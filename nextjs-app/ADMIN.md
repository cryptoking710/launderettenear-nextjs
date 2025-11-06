# Admin Interface

## Current Architecture

The LaunderetteNear.me admin interface remains on the **original Vite application** (`client/` directory) and is **not migrated** to Next.js.

## Why This Approach?

1. **Internal-Only Feature**: The admin interface is not public-facing and doesn't benefit from SSR/SSG
2. **Already Works Perfectly**: The Vite admin is fully functional with all CRUD operations
3. **No SEO Impact**: Admin pages are blocked by robots.txt and require authentication
4. **Faster Deployment**: Focus migration effort on the 90% of user-facing content
5. **Proven Stability**: Existing admin has been tested and refined over time

## Current Admin Features (Vite App)

- **Dashboard**: Statistics on listings (total, premium, standard)
- **Listings Management**: Full CRUD operations with geocoding
- **Analytics**: Search trends and view tracking
- **Corrections**: User-submitted correction review workflow
- **Firebase Authentication**: Google Sign-In with secure token verification

## Accessing the Admin

1. Start the Vite application: `npm run dev` (from project root)
2. Navigate to: `http://localhost:5000/admin/login`
3. Sign in with authorized Google account
4. Manage listings, view analytics, review corrections

## Future Migration (Optional)

If you decide to migrate the admin to Next.js in the future, you'll need:
- Client components for all admin pages (Firebase auth requirement)
- API routes for authenticated operations
- Form components (coordinate picker, geocoding integration)
- Analytics charts and tables
- Corrections workflow UI

Estimated effort: 6-8 hours for complete feature parity.

## Deployment Strategy

**Production Setup:**
- Deploy Next.js app for public-facing site (launderettenear.me)
- Keep Vite app running for admin interface (admin.launderettenear.me or separate subdomain)
- Or run both on same server with different ports/paths

This dual-app approach is common and recommended for applications where admin functionality is distinct from public content.
