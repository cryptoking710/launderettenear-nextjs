# Firestore Security Rules

## Important: Required Security Configuration

To secure your LaunderetteNear.me application, you **must** configure Firebase Firestore security rules. Without these rules, your database may be vulnerable.

### How to Set Up Security Rules

1. Go to the [Firebase Console](https://console.firebase.com/)
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click on "Rules" tab
5. Replace the default rules with the rules below
6. Click "Publish"

### Development/Replit Rules (Permissive)

For development on Replit or similar environments where Firebase Admin SDK service account credentials are not available, use these permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Launderettes collection - Permissive for development
    match /launderettes/{launderetteId} {
      // Anyone can read launderettes (public directory)
      allow read: if true;
      
      // Allow writes from server (no auth context) or authenticated users
      // This enables backend API operations without service account credentials
      allow create, update, delete: if true;
    }
    
    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**WARNING**: These permissive rules allow anyone to modify your database. Only use them in development/testing environments. Never use these rules in production.

### Production Rules (Recommended)

For production deployments, use these restrictive rules that require authentication:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Launderettes collection
    match /launderettes/{launderetteId} {
      // Anyone can read launderettes (public directory)
      allow read: if true;
      
      // Only authenticated users can create, update, or delete
      allow create, update, delete: if request.auth != null;
      
      // RECOMMENDED: Restrict to specific admin emails
      // allow create, update, delete: if request.auth != null && 
      //   request.auth.token.email in ['admin@yourdomain.com', 'manager@yourdomain.com'];
    }
    
    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**For maximum production security**: Uncomment and modify the admin email restriction to whitelist specific admin users.

### Testing the Rules

After publishing the rules:

**Development (Permissive Rules):**
1. Access the public directory at `/` - should work
2. Log in as admin at `/admin/login` - should work
3. Create/edit/delete listings - should work

**Production (Restrictive Rules):**
1. Access the public directory at `/` - should work
2. Try accessing admin features without logging in - should fail
3. Log in as admin at `/admin/login` - should work
4. Create/edit/delete listings when logged in - should work
5. Try admin operations from non-whitelisted emails - should fail (if email restriction enabled)

## Architecture Note

The application uses two approaches depending on environment:

**Development (Replit):**
- Firebase Client SDK on backend for Firestore operations
- Permissive security rules allow backend operations
- Frontend token verification provides authentication layer
- Trade-off: Less secure, but works without service account credentials

**Production (Recommended):**
- Firebase Admin SDK with service account credentials
- Restrictive security rules require authentication
- Server-side operations bypass security rules securely
- Full security with admin email whitelisting

## Migration to Production

When deploying to production:

1. **Set up service account credentials**:
   - Download service account JSON from Firebase Console
   - Add as `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable
   - Update `server/firebase-admin.ts` to use credentials

2. **Switch to restrictive Firestore rules**:
   - Use the production rules shown above
   - Add your admin email(s) to the whitelist
   - Publish the rules in Firebase Console

3. **Update backend to use Admin SDK**:
   - Modify `server/routes.ts` to use `admin.firestore()` instead of `firestoreBackend`
   - Remove `server/firestore-backend.ts` dependency

## Current Implementation

The application currently uses:
- **Firebase Client SDK** on backend for Firestore operations
- **Firebase Admin SDK** for token verification only
- **Permissive Firestore rules** for development ease

This allows the application to work on Replit without service account credentials, but should be upgraded to the production architecture for live deployments.
