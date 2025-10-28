// Backend Firestore using Firebase Client SDK
// Note: This implementation works with permissive Firestore security rules
// For production, use Firebase Admin SDK with service account credentials

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;

// Initialize Firebase Client SDK on backend
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig, "backend");
  console.log("Firebase Client SDK initialized on backend");
} else {
  app = getApps()[0];
}

db = getFirestore(app);

export { db };

// Helper functions that match Firebase Admin API surface
export const firestoreBackend = {
  collection(collectionName: string) {
    return {
      async get() {
        const snapshot = await getDocs(collection(db, collectionName));
        return {
          docs: snapshot.docs.map(doc => ({
            id: doc.id,
            data: () => doc.data(),
            exists: doc.exists()
          }))
        };
      },
      
      async add(data: any) {
        const docRef = await addDoc(collection(db, collectionName), data);
        return {
          id: docRef.id,
          get: async () => {
            const docSnap = await getDoc(docRef);
            return {
              id: docRef.id,
              data: () => docSnap.data(),
              exists: docSnap.exists()
            };
          }
        };
      },
      
      doc(docId: string) {
        const docRef = doc(db, collectionName, docId);
        
        return {
          async get() {
            const docSnap = await getDoc(docRef);
            return {
              id: docId,
              data: () => docSnap.data(),
              exists: docSnap.exists()
            };
          },
          
          async update(data: any) {
            await updateDoc(docRef, data);
          },
          
          async delete() {
            await deleteDoc(docRef);
          }
        };
      }
    };
  }
};
