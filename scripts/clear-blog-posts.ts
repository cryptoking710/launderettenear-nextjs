// Script to clear all existing blog posts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

async function clearBlogPosts() {
  console.log("Clearing all blog posts from Firestore...");
  
  const querySnapshot = await getDocs(collection(db, "blog_posts"));
  console.log(`Found ${querySnapshot.size} posts to delete`);
  
  for (const doc of querySnapshot.docs) {
    await deleteDoc(doc.ref);
    console.log(`Deleted: ${doc.data().title}`);
  }
  
  console.log("\n✓ All blog posts cleared!");
  process.exit(0);
}

clearBlogPosts();
