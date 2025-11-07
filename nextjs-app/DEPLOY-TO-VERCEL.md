# Deploy LaunderetteNear.me to Vercel - Complete Walkthrough

Follow these exact steps to deploy your Next.js app to Vercel (FREE hosting with excellent SEO).

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ GitHub account (create at github.com if needed)
- ✅ Access to your Firebase project credentials
- ✅ 15 minutes of time

---

## Step 1: Push Code to GitHub

### 1.1 Open Shell in Replit

Click the **Shell** tab (bottom of screen)

### 1.2 Navigate and Initialize Git

Copy and paste these commands ONE AT A TIME:

```bash
cd nextjs-app
```

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "Next.js migration - SEO-optimized LaunderetteNear.me"
```

### 1.3 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `launderettenear-nextjs`
3. Description: `SEO-optimized UK launderette directory`
4. Visibility: **Public** (required for Vercel free tier)
5. **DON'T** initialize with README (we have code already)
6. Click **Create repository**

### 1.4 Push to GitHub

GitHub will show you commands. Copy the "push an existing repository" commands:

```bash
git remote add origin https://github.com/YOUR-USERNAME/launderettenear-nextjs.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

**Note:** Replace `YOUR-USERNAME` with your actual GitHub username.

You'll be prompted for credentials. Use a **Personal Access Token** instead of password:
- Create token at: https://github.com/settings/tokens
- Scopes needed: `repo` (full control)
- Copy token and paste when prompted for password

✅ **Checkpoint:** Visit your GitHub repo URL - you should see all the nextjs-app files

---

## Step 2: Deploy to Vercel

### 2.1 Create Vercel Account

1. Go to https://vercel.com/signup
2. Click **Continue with GitHub**
3. Authorize Vercel to access your repositories

### 2.2 Import Project

1. On Vercel dashboard, click **Add New... → Project**
2. Find `launderettenear-nextjs` in the list
3. Click **Import**

### 2.3 Configure Project

**Framework Preset:** Next.js (should auto-detect)

**Root Directory:** Leave as `./` (default)

**Build Settings:** Leave defaults:
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

### 2.4 Add Environment Variables

Click **Environment Variables** and add these **10 variables**:

#### Client-Side Variables (NEXT_PUBLIC_)

Copy these from your Replit Secrets (Tools → Secrets):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Copy from `VITE_FIREBASE_API_KEY` secret |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Copy from `VITE_FIREBASE_PROJECT_ID` secret |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Copy from `VITE_FIREBASE_APP_ID` secret |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `YOUR_PROJECT_ID.firebaseapp.com` |

**How to get values:** In Replit → Tools → Secrets → Click eye icon to reveal

#### Server-Side Variables (Firebase Admin SDK)

You'll need your Firebase service account credentials:

1. **Get Service Account Key:**
   - Go to Firebase Console: https://console.firebase.google.com
   - Select your project
   - Settings (gear icon) → Project Settings
   - Service Accounts tab
   - Click **Generate New Private Key**
   - Save the JSON file

2. **Add to Vercel:**

| Name | Value from JSON |
|------|----------------|
| `FIREBASE_PROJECT_ID` | Copy `project_id` from JSON |
| `FIREBASE_CLIENT_EMAIL` | Copy `client_email` from JSON |
| `FIREBASE_PRIVATE_KEY` | Copy `private_key` from JSON (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`) |

**⚠️ IMPORTANT for FIREBASE_PRIVATE_KEY:**
- Click **Show More Options** when adding this variable
- Paste the ENTIRE private key including the BEGIN/END lines
- Vercel will automatically handle the newlines

### 2.5 Deploy!

1. Click **Deploy**
2. Watch the build logs (takes 2-3 minutes)
3. Wait for "Congratulations!" message

✅ **Checkpoint:** You should see a success screen with your deployment URL

---

## Step 3: Test Your Deployment

### 3.1 Visit Your Site

Click the **Visit** button or copy the URL (format: `https://launderettenear-nextjs-xxx.vercel.app`)

### 3.2 Test These Pages

Open each URL and verify it works:

✅ **Homepage**
- URL: `/`
- Should show: Search bar, featured cities, hero section
- Check: Search functionality works

✅ **City Page**
- URL: `/city/London`
- Should show: List of London launderettes, map with markers
- Check: Data loads from Firebase (not empty)

✅ **Launderette Detail**
- URL: `/launderette/00yRObrCE2FUNiaVMNBF` (use any ID from city page)
- Should show: Business details, reviews, opening hours
- Check: No Firebase connection errors

✅ **Blog**
- URL: `/blog`
- Should show: List of blog posts

✅ **SEO Files**
- URL: `/sitemap.xml` - Should show XML with all pages
- URL: `/robots.txt` - Should show allow rules

### 3.3 Check for Errors

Open browser DevTools (F12) and check Console tab:
- ❌ Red errors = problem (check Firebase env vars)
- ✅ No errors or only warnings = good!

---

## Step 4: Add Custom Domain (Optional)

### 4.1 In Vercel Dashboard

1. Go to your project
2. Settings → Domains
3. Add domain: `launderettenear.me`
4. Also add: `www.launderettenear.me`

### 4.2 Update DNS

Vercel will show you DNS records to add. In your domain registrar:

**For root domain (launderettenear.me):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Wait 10-30 minutes for DNS propagation.

✅ **Checkpoint:** Visit https://launderettenear.me - should show your site with automatic HTTPS

---

## Step 5: Submit to Google Search Console

### 5.1 Add Property

1. Go to https://search.google.com/search-console
2. Click **Add Property**
3. Enter: `launderettenear.me`
4. Verify ownership via DNS TXT record (Vercel can help with this)

### 5.2 Submit Sitemap

1. In Search Console, go to **Sitemaps**
2. Add new sitemap: `https://launderettenear.me/sitemap.xml`
3. Click **Submit**

### 5.3 Request Indexing

1. Go to **URL Inspection**
2. Test these URLs:
   - `https://launderettenear.me/`
   - `https://launderettenear.me/city/London`
   - `https://launderettenear.me/city/Manchester`
3. Click **Request Indexing** for each

---

## 🎉 You're Live!

### Final Architecture

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Public Site | Vercel | launderettenear.me | ✅ Live |
| Admin Panel | Replit | replit.app | ✅ Private |
| Database | Firebase | Cloud | ✅ Shared |

### Performance Benefits

- **SEO:** Server-side rendering for perfect crawler support
- **Speed:** Edge CDN in 100+ locations worldwide
- **Cost:** FREE (Vercel free tier + Replit dev)
- **Reliability:** 99.99% uptime SLA

---

## 🐛 Troubleshooting

### Build Failed in Vercel

**Error:** "Module not found" or similar
- **Fix:** Check that all imports use correct paths
- **Check:** Build logs in Vercel dashboard

**Error:** "Firebase is not defined"
- **Fix:** Verify all 7 environment variables are set correctly
- **Check:** Settings → Environment Variables

### Pages Show No Data

**Symptom:** City pages are empty, no launderettes shown
- **Fix:** Check Firebase environment variables
- **Check:** Browser console for Firebase errors
- **Solution:** Verify `FIREBASE_PRIVATE_KEY` is copied correctly (including newlines)

### "Failed to fetch" Errors

**Symptom:** API calls failing in browser console
- **Fix:** Firebase security rules may be blocking server-side calls
- **Check:** Firebase Console → Firestore → Rules
- **Solution:** Ensure admin SDK can read/write

---

## 📞 Need Help?

If you encounter issues:

1. **Check Vercel build logs** for specific errors
2. **Check browser console** (F12) for runtime errors
3. **Verify environment variables** are all set correctly
4. **Test Firebase connection** by checking if homepage loads featured cities

Common fixes solve 90% of issues:
- Re-check `FIREBASE_PRIVATE_KEY` format
- Ensure all 7 env vars are present
- Wait 1-2 minutes after deployment for changes to propagate
