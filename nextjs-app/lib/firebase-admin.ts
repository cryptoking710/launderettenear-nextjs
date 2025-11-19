import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App;
let adminDb: Firestore;

export function getAdminApp(): App | null {
  if (!adminApp) {
    const apps = getApps();
    if (apps.length === 0) {
      // Try service account JSON first (more reliable)
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      
      if (serviceAccountJson) {
        try {
          // Decode base64-encoded service account JSON
          const decoded = Buffer.from(serviceAccountJson, 'base64').toString('utf8');
          const serviceAccount = JSON.parse(decoded);
          
          adminApp = initializeApp({
            credential: cert(serviceAccount),
          });
        } catch (error) {
          console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', error);
          return null;
        }
      } else {
        // Fallback to individual environment variables
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || !clientEmail || !privateKey) {
          // Return null instead of throwing - Admin SDK not available during build
          console.warn('Firebase Admin SDK not configured - admin features disabled');
          return null;
        }

        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
          }),
        });
      }
    } else {
      adminApp = apps[0];
    }
  }
  return adminApp;
}

export function getAdminDb(): Firestore | null {
  if (!adminDb) {
    const app = getAdminApp();
    if (!app) {
      return null;
    }
    adminDb = getFirestore(app);
  }
  return adminDb;
}
