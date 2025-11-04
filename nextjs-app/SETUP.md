# Next.js Setup Instructions

## Installation Steps

Since the Next.js app is in a separate directory (`nextjs-app/`), you'll need to install dependencies manually.

### 1. Navigate to Next.js directory

```bash
cd nextjs-app
```

### 2. Install dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Firebase (Admin & Client SDKs)
- TanStack Query
- React Leaflet
- Radix UI components
- And more...

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase credentials:

**Server-Side (Admin SDK):**
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Client-Side (Client SDK):**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=1:XXXXX:web:XXXXX
```

### 4. Get Firebase Credentials

**Admin SDK Credentials:**
1. Go to Firebase Console → Project Settings
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. Download JSON file
5. Extract values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep newlines as `\n`)

**Client SDK Credentials:**
1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Select your web app or create one
4. Copy the config values

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 6. Verify Setup

Visit http://localhost:3000 and you should see:
- ✅ Next.js 15 with App Router
- ✅ TypeScript working
- ✅ Tailwind CSS styles applied
- ✅ Fonts loaded (Inter & Manrope)
- ✅ No console errors

## Troubleshooting

### Private Key Issues

If you get Firebase Admin SDK errors, check your private key:

```bash
# In .env.local, ensure newlines are escaped:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"
```

### TypeScript Errors

If you see TypeScript errors, run:

```bash
npm run build
```

This will show all type errors.

### Module Not Found

If you get "module not found" errors:

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

After setup is complete:
- Week 2: Migrate static pages
- Week 3: Migrate city pages with SSG
- Week 4: Migrate launderette detail pages
- Week 5: Migrate admin interface
- Week 6-8: SEO optimization, testing, deployment

See `../docs/nextjs-migration-plan.md` for full migration timeline.
