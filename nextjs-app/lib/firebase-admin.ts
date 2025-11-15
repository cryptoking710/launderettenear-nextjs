import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App;
let adminDb: Firestore;

export function getAdminApp(): App {
  if (!adminApp) {
    const apps = getApps();
    if (apps.length === 0) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const rawKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !rawKey) {
        throw new Error(
          "Missing Firebase Admin credentials. Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set."
        );
      }

      const privateKey = Buffer.from(rawKey, "base64").toString("utf8");

      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
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
