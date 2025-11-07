# Quick Command Reference

Copy and paste these commands in order. No modifications needed!

---

## Step 1: Initialize Git (in Shell)

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

---

## Step 2: Push to GitHub

⚠️ **First:** Create repo at https://github.com/new
- Name: `launderettenear-nextjs`
- Visibility: Public
- Don't initialize with README

**Then run** (replace YOUR-USERNAME):

```bash
git remote add origin https://github.com/YOUR-USERNAME/launderettenear-nextjs.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

---

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Import `launderettenear-nextjs` project
4. Add environment variables (see DEPLOY-TO-VERCEL.md)
5. Click "Deploy"

---

## Environment Variables for Vercel

Get these from Replit Secrets:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<from VITE_FIREBASE_API_KEY>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<from VITE_FIREBASE_PROJECT_ID>
NEXT_PUBLIC_FIREBASE_APP_ID=<from VITE_FIREBASE_APP_ID>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<PROJECT_ID>.firebaseapp.com
```

Get these from Firebase Console → Service Accounts → Generate New Private Key:

```
FIREBASE_PROJECT_ID=<from service account JSON>
FIREBASE_CLIENT_EMAIL=<from service account JSON>
FIREBASE_PRIVATE_KEY=<from service account JSON - full key with BEGIN/END>
```

---

## Verification Checklist

After deployment, test these URLs:

- [ ] Homepage: `/`
- [ ] City page: `/city/London`
- [ ] Launderette: `/launderette/00yRObrCE2FUNiaVMNBF`
- [ ] Blog: `/blog`
- [ ] Sitemap: `/sitemap.xml`
- [ ] Robots: `/robots.txt`

All should load without errors!
