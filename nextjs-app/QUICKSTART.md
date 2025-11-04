# Quick Start Guide

Get the Next.js app running in 3 simple steps!

## Option 1: Automated Setup (Recommended)

### Step 1: Navigate to Directory
```bash
cd nextjs-app
```

### Step 2: Run Setup Script
```bash
bash setup.sh
```

This script will:
- ✅ Install all dependencies (npm install)
- ✅ Create .env.local from example
- ✅ Open editor to configure Firebase credentials
- ✅ Verify everything is ready

### Step 3: Start Development Server
```bash
bash start.sh
```

Or manually:
```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## Option 2: Manual Setup

### Step 1: Install Dependencies
```bash
cd nextjs-app
npm install
```

### Step 2: Configure Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials (see SETUP.md for details).

### Step 3: Start Server
```bash
npm run dev
```

---

## Getting Firebase Credentials

### Admin SDK (Server-Side)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click gear → Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download JSON and extract:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### Client SDK (Client-Side)
1. Firebase Console → Project Settings
2. Scroll to "Your apps"
3. Click your web app (or create one)
4. Copy config values:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## Troubleshooting

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Dependencies installation failed?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Private key errors?
Make sure your `FIREBASE_PRIVATE_KEY` has escaped newlines (`\n`) and is wrapped in quotes.

---

## What's Next?

After the server starts successfully:
- ✅ Visit http://localhost:3000
- ✅ Check for errors in browser console
- ✅ Verify fonts and styles loaded
- ✅ Check page source for meta tags (should be in initial HTML!)

Then proceed to Week 2: Static Pages Migration

---

## Scripts Available

- `bash setup.sh` - Automated setup (install + configure)
- `bash start.sh` - Start dev server (with checks)
- `npm run dev` - Start dev server (manual)
- `npm run build` - Build for production
- `npm start` - Run production build

---

For detailed information, see:
- **SETUP.md** - Full installation guide
- **README.md** - Project documentation
- **../docs/nextjs-migration-plan.md** - Migration roadmap
