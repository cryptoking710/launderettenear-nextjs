# Next.js App Testing Instructions

## Current Status

✅ **Project Structure:** Complete  
✅ **Configuration Files:** Ready  
✅ **Environment Template:** Created with your existing Firebase credentials  
⏳ **Dependencies:** Need to be installed manually  
⏳ **Admin SDK Key:** Needs to be added to `.env.local`

---

## ⚠️ Important: Manual Testing Required

Due to the subdirectory structure, you'll need to test the Next.js app manually:

### Step 1: Install Dependencies

Open a **new terminal window** and run:

```bash
cd nextjs-app
npm install
```

**Expected:** This will install ~350MB of dependencies (Next.js, React, Firebase, etc.)  
**Time:** 1-2 minutes

---

### Step 2: Get Firebase Admin SDK Private Key

The `.env.local` file is already created with your existing credentials, but you need to add the **Admin SDK private key**.

**Option A: From Firebase Console (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click gear icon → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Open it and find the `private_key` field
8. Copy the entire key (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
9. Edit `nextjs-app/.env.local` and replace `REPLACE_WITH_YOUR_PRIVATE_KEY` with the actual key

**Option B: From Replit Secrets (If Already Configured)**

If you have a `FIREBASE_PRIVATE_KEY` secret configured in Replit:
1. Open Replit Secrets panel
2. Copy the value of `FIREBASE_PRIVATE_KEY`
3. Paste it into `nextjs-app/.env.local`

**Your `.env.local` should look like:**

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
...your actual private key here...
-----END PRIVATE KEY-----"

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=1:XXXXX:web:XXXXX
```

---

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected Output:**

```
  ▲ Next.js 15.0.3
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Starting...
 ✓ Ready in 1.5s
```

---

### Step 4: Test the Application

Open **http://localhost:3000** in your browser.

#### ✅ Success Checklist:

- [ ] Page loads without errors
- [ ] You see "Find Your Nearest Launderette" heading
- [ ] Fonts look correct (Inter for body, Manrope for heading)
- [ ] Tailwind CSS styles are applied (blue colors, proper spacing)
- [ ] No errors in browser console
- [ ] No errors in terminal

#### 🔍 Advanced Verification:

1. **View Page Source** (Right-click → View Page Source)
   - Search for `<meta property="og:title"`
   - **Important:** Meta tags should be in the HTML source (not added by JavaScript)
   - This proves server-side rendering is working!

2. **Check Network Tab** (F12 → Network)
   - Initial page load should show HTML with meta tags
   - No hydration errors in console

3. **Test Navigation**
   - Click around (once we add more pages in Week 2)

---

## 📊 Expected vs Actual

### What You Should See:

**Homepage:**
```
┌─────────────────────────────────────────┐
│  Find Your Nearest Launderette          │
│                                         │
│  [Search interface will be added]       │
└─────────────────────────────────────────┘
```

**Browser Console:**
```
(no errors)
```

**Terminal:**
```
✓ Compiled in XXXms
```

---

## ❌ Troubleshooting

### Issue: "Cannot find module 'next'"
**Solution:** Run `npm install` in the `nextjs-app/` directory

### Issue: Firebase Admin initialization error
**Solution:** Check your `FIREBASE_PRIVATE_KEY` in `.env.local`
- Must be wrapped in quotes
- Must include `\n` for newlines
- Must start with `-----BEGIN PRIVATE KEY-----`

### Issue: Port 3000 already in use
**Solution:** Run on different port: `npm run dev -- -p 3001`

### Issue: TypeScript errors
**Solution:** Run `npm run build` to see all type errors

---

## 🎯 What This Test Proves

If successful, this confirms:

✅ Next.js 15 App Router works  
✅ TypeScript compilation successful  
✅ Tailwind CSS integrated  
✅ Firebase Admin SDK connected  
✅ Firebase Client SDK configured  
✅ Server-side rendering working  
✅ Meta tags in initial HTML (fixes CSR limitation!)  
✅ Environment variables properly segregated  
✅ Ready for Week 2 migration  

---

## 📝 Report Back

After testing, please report:

1. ✅ **Success:** "It works! Screenshot: [url]"
2. ⚠️ **Partial:** "Loads but has errors: [error messages]"
3. ❌ **Failed:** "Doesn't start: [error output]"

This will help determine next steps!

---

## 🚀 After Successful Test

Once confirmed working, we proceed to **Week 2: Static Pages Migration**:
- Migrate About, Contact, Privacy, Terms pages
- Add proper metadata for each
- Test all pages
- Verify SEO improvements

---

**Ready to test? Run:**

```bash
cd nextjs-app
npm install
# Edit .env.local with your Firebase Admin key
npm run dev
```

Then visit http://localhost:3000
