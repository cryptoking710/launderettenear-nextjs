import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function getClientApp(): FirebaseApp {
  if (!app) {
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = apps[0];
    }
  }
  return app;
}

export function getClientAuth(): Auth {
  if (!auth) {
    const firebaseApp = getClientApp();
    auth = getAuth(firebaseApp);
  }
  return auth;
}

export function getClientDb(): Firestore {
  if (!db) {
    const firebaseApp = getClientApp();
    db = getFirestore(firebaseApp);
  }
  return db;
}
