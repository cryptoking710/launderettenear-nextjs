import admin from "firebase-admin";

// Initialize Firebase Admin SDK for Authentication only
// Note: Firestore operations will be handled via client SDK with security rules
if (!admin.apps.length) {
  try {
    // Initialize with minimal config for token verification only
    // This works without service account credentials
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
    console.log("Firebase Admin Auth initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
}

// Export auth for token verification - this works without service account
export const adminAuth = admin.auth();

// Note: Firestore Admin SDK requires service account credentials
// For development, we'll use a workaround or client SDK with proper security rules
// For production, set FIREBASE_SERVICE_ACCOUNT_KEY environment variable
export const adminDb = admin.firestore();
