import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// For Replit development: Initialize Firebase Admin without Firestore
// Token verification works without service account credentials
let adminAuth;

try {
  if (getApps().length === 0) {
    initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    });
  }
  
  adminAuth = getAuth();
  console.log("Firebase Admin Auth initialized for token verification");
} catch (error) {
  console.error("Firebase Admin Auth initialization error:", error);
  throw error;
}

export { adminAuth };

// Note: For Firestore operations in development without service account,
// we use Firestore REST API or client SDK with security rules enforcement
