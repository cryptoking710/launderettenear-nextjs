# Publishing Options for LaunderetteNear.me

You have **two apps** to publish with different optimal strategies:

## Current Status
- ✅ **Vite Admin App** - Running on port 5000, fully functional
- ⏳ **Next.js Public App** - Code complete, dependencies not installed yet

---

## Option A: Vercel for Next.js (Recommended) ⭐

**Best for:** SEO performance, automatic optimization, free hosting

### Why Vercel?
- Built specifically for Next.js apps
- Automatic dependency installation during deployment
- Edge caching for global performance
- Free tier includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Custom domains
  - Automatic HTTPS

### Setup Steps:

1. **Create Vercel Account**
   - Visit: https://vercel.com/signup
   - Sign up with GitHub, GitLab, or email

2. **Connect Repository**
   - Push `nextjs-app/` to a GitHub repository
   - Import project in Vercel dashboard
   - Select root directory: `nextjs-app`

3. **Configure Environment Variables**
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=...
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get URL: `https://your-project.vercel.app`

5. **Add Custom Domain (Optional)**
   - In Vercel settings: Domains → Add domain
   - Point `launderettenear.me` to Vercel
   - Update DNS with provided records

### Keep Admin on Replit
- Admin app stays on Replit (port 5000)
- Only accessible to you (Firebase Auth)
- No need to migrate admin - architect-approved decision

**Result:** Public site on Vercel (fast, SEO-optimized), Admin on Replit (secure, private)

---

## Option B: Replit Deployment (Both Apps)

**Best for:** Keeping everything on Replit, simpler management

### Challenges:
1. **Subdirectory deployment** - Replit deploys from root by default
2. **Dual apps** - Need separate deployments for admin vs public
3. **Build complexity** - Requires custom build configuration

### Setup Approach:

**Two Separate Deployments:**

**Deployment 1: Next.js Public (Autoscale)**
```
Name: LaunderetteNear Public
Type: Autoscale Deployment
Build: cd nextjs-app && npm install && npm run build
Run: cd nextjs-app && npm start
Port: 3000
Domain: your-public.replit.app
```

**Deployment 2: Admin App (Reserved VM)**
```
Name: LaunderetteNear Admin
Type: Reserved VM (always on for admin access)
Build: npm install && npm run build
Run: npm start
Port: 5000
Domain: your-admin.replit.app (keep private)
```

### Cost Estimate:
- Autoscale: ~$10-20/month (scales with traffic)
- Reserved VM: ~$7/month (1 CPU, 1GB RAM)
- Total: ~$17-27/month

**vs Vercel:** Next.js on Vercel free + Admin on Replit dev workspace (free) = $0/month

---

## Option C: Combined Build (Advanced)

**Best for:** Single deployment, but complex setup

### Approach:
- Combine both apps into single deployment
- Use Express to serve both Next.js (public) and Vite (admin)
- Requires significant refactoring
- Not recommended - adds complexity for no benefit

---

## Recommendation: Option A (Vercel + Replit)

### Advantages:
1. **No local testing required** - Vercel builds and tests automatically
2. **Best SEO performance** - Edge CDN, automatic optimization
3. **Free for public site** - Vercel free tier is generous
4. **Secure admin** - Stays on Replit, private access only
5. **Separation of concerns** - Public vs admin isolated

### Next Steps:

1. **Push Next.js code to GitHub**
   ```bash
   cd nextjs-app
   git init
   git add .
   git commit -m "Next.js migration complete"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Import from GitHub
   - Add environment variables
   - Deploy (takes ~2 minutes)

3. **Test production site**
   - Visit Vercel deployment URL
   - Check all pages load
   - Verify Firebase connection
   - Test search and filters

4. **Add custom domain**
   - Configure `launderettenear.me` in Vercel
   - Update DNS records
   - Wait for propagation (~10 minutes)

5. **Submit to Google**
   - Google Search Console: Add property
   - Submit sitemap: `https://launderettenear.me/sitemap.xml`
   - Request indexing for key pages

---

## Quick Decision Matrix

| Factor | Vercel + Replit | Replit Only |
|--------|----------------|-------------|
| Cost | FREE | $17-27/month |
| SEO Performance | Excellent | Good |
| Setup Complexity | Low | Medium |
| Local Testing Required | No | Yes |
| Global Performance | Edge CDN | Single region |
| Automatic HTTPS | Yes | Yes |
| Custom Domain | Free | Free |

**Winner:** Vercel + Replit for better performance at lower cost
