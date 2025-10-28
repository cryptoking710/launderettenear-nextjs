import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// Using projectId for auth verification - Admin SDK can verify tokens without service account
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
