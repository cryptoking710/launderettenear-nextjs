import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App;
let adminDb: Firestore;

export function getAdminApp(): App {
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
          throw new Error(
            'Invalid FIREBASE_SERVICE_ACCOUNT_JSON. Please ensure the JSON is valid and properly base64-encoded.'
          );
        }
      } else {
        // Fallback to individual environment variables
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || !clientEmail || !privateKey) {
          throw new Error(
            "Missing Firebase credentials. Set either FIREBASE_SERVICE_ACCOUNT_JSON or all of: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
          );
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

export function getAdminDb(): Firestore {
  if (!adminDb) {
    const app = getAdminApp();
    adminDb = getFirestore(app);
  }
  return adminDb;
}
