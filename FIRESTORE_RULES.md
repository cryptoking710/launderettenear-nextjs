# Firestore Security Rules

## Important: Required Security Configuration

To secure your LaunderetteNear.me application, you **must** configure Firebase Firestore security rules. Without these rules, anyone can read and write to your database.

### How to Set Up Security Rules

1. Go to the [Firebase Console](https://console.firebase.com/)
2. Select your project
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the default rules with the rules below
6. Click "Publish"

### Recommended Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Launderettes collection
    match /launderettes/{launderetteId} {
      // Anyone can read launderettes (public directory)
      allow read: if true;
      
      // Only authenticated users can create, update, or delete
      // In production, you might want to restrict this to specific admin emails
      allow create, update, delete: if request.auth != null;
      
      // OPTIONAL: Restrict to specific admin emails
      // allow create, update, delete: if request.auth != null && 
      //   request.auth.token.email in ['admin@example.com', 'manager@example.com'];
    }
    
    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Production Security (Recommended)

For production environments, uncomment the email restriction and add your admin email addresses:

```javascript
allow create, update, delete: if request.auth != null && 
  request.auth.token.email in ['your-admin-email@gmail.com'];
```

This ensures only specific authenticated users can manage listings.

### Testing the Rules

After publishing the rules:
1. Try accessing the public directory at `/` - should work
2. Try logging in as admin at `/admin/login` - should work
3. Try creating/editing/deleting listings - should work when logged in
4. Try accessing admin features without logging in - should fail

## Current Implementation

The application uses both:
- **Client-side Firebase SDK**: For real-time updates on the public directory
- **Server-side Firebase Admin SDK**: For authenticated CRUD operations through the API

The server validates the user's Firebase auth token before allowing any create/update/delete operations on launderettes.
