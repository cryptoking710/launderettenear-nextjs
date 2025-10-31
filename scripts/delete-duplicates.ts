import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  // These are the cities from the WRONG import (previous batch cities)
  const duplicateCities = [
    'Southend-on-Sea', 'Canterbury', 'Gillingham', 'Folkestone', 
    'Hastings', 'Eastbourne', 'Brighton', 'Bournemouth', 'Chichester'
  ];
  
  // Find launderettes created in the last 20 minutes (filter by date in JS)
  const twentyMinutesAgo = Date.now() - 20 * 60 * 1000;
  
  let deleteCount = 0;
  
  for (const city of duplicateCities) {
    const q = query(
      collection(db, 'launderettes'),
      where('city', '==', city)
    );
    
    const snapshot = await getDocs(q);
    
    // Filter by createdAt in JavaScript
    const recentDocs = snapshot.docs.filter(doc => {
      const createdAt = new Date(doc.data().createdAt).getTime();
      return createdAt > twentyMinutesAgo;
    });
    
    console.log(`Found ${recentDocs.length} recent listings in ${city} (out of ${snapshot.size} total)`);
    
    for (const document of recentDocs) {
      const data = document.data();
      console.log(`🗑️  Deleting: ${data.name} (${city}) - ID: ${document.id}`);
      await deleteDoc(doc(db, 'launderettes', document.id));
      deleteCount++;
    }
  }
  
  console.log(`\n✅ Deleted ${deleteCount} duplicate listings`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
