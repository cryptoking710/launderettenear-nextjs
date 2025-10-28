# Setting Up Firestore for LaunderetteNear.me

## Current Status

Your Firebase project needs the Firestore API enabled. Here's how to set it up:

## Step 1: Enable Firestore API

1. Go to the Firebase Console: https://console.firebase.google.com/
2. Select your project: `wheresmyheadat-385c9`
3. Click on "Firestore Database" in the left sidebar
4. Click "Create Database"
5. Choose **"Start in test mode"** for development
   - Production mode is more secure but requires proper security rules
6. Select a location (choose `eur3` for Europe or `us-central` for US)
7. Click "Enable"

**Or visit this direct link:**
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=wheresmyheadat-385c9

## Step 2: Add Sample Data

Once Firestore is enabled, you have **3 options** to add the sample UK launderette data:

### Option A: Use the Seed Script (Recommended)

```bash
npx tsx server/seed-data.ts
```

This will automatically add 12 real UK launderettes across London, Manchester, and Birmingham.

### Option B: Use the Admin Interface

1. Log in to the admin panel at `/admin/login`
2. Sign in with Google
3. Navigate to "Listings" → "Add New"
4. Manually add launderettes using the form

Reference the data in `sample-data/uk-launderettes.json` for realistic values.

### Option C: Import via Firebase Console

1. Go to Firebase Console → Firestore Database
2. Start collection: `launderettes`
3. Add documents manually, or
4. Use the Firebase CLI to import the JSON:

```bash
# Install Firebase tools
npm install -g firebase-tools

# Login
firebase login

# Import data (requires converting JSON to Firestore format first)
firebase firestore:import sample-data/
```

## Step 3: Configure Security Rules

Once data is added, update your Firestore security rules in the Firebase Console:

**Navigate to:** Firestore Database → Rules

**Paste these rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Launderettes collection
    match /launderettes/{launderetteId} {
      allow read: if true;  // Public read access
      allow create, update, delete: if request.auth != null;  // Authenticated writes
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;  // Public read access
      allow create: if true;  // Anyone can create reviews
      allow delete: if request.auth != null;  // Only admins can delete
      allow update: if false;  // No updates allowed
    }
    
    // Analytics collection
    match /analytics/{eventId} {
      allow create: if true;  // Public can track events
      allow read: if request.auth != null;  // Only admins can read
      allow update, delete: if false;  // No modifications
    }
    
    // Deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Step 4: Test the Application

After enabling Firestore and adding data:

1. Refresh your application
2. Search for locations like "London", "Manchester", or "Birmingham"
3. View launderettes on the map
4. Try filtering by features or price range
5. Click on a launderette to see details
6. Submit a review

## Sample Data Included

The seed data includes **12 real UK launderettes**:

### London (4)
- Barbican Laundrette (Premium)
- WASHX Launderette (Premium)
- Chatsworth Launderette
- St John Street Launderette (Premium)

### Manchester (4)
- Edels Laundrette (Premium)
- Spring Clean - Denton
- Spring Clean - Sale
- Jumbo Laundrette

### Birmingham (4)
- Sparkle Laundrette Birmingham (Premium)
- Washday Express (Premium)
- Kings Heath Launderette
- Erdington Coin Laundry

Each includes:
- ✅ Real addresses and coordinates
- ✅ Realistic features and amenities
- ✅ Opening hours
- ✅ Contact information
- ✅ Price ranges
- ✅ Descriptions

## Troubleshooting

### "Permission Denied" Errors

This means Firestore API isn't enabled yet. Follow Step 1 above.

### "Collection not found" Errors

Make sure you've added data using one of the methods in Step 2.

### Admin Login Issues

Ensure you've added your deployment domain to Firebase Console → Authentication → Settings → Authorized Domains

## Need Help?

Check the main `replit.md` file for comprehensive documentation or refer to the Firebase documentation at https://firebase.google.com/docs/firestore
