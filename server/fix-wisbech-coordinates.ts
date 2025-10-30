import { db } from './firestore-backend';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

async function fixWisbechCoordinates() {
  console.log('🔧 Starting Wisbech coordinate fix...');
  console.log('='.repeat(60));
  
  try {
    // Get all Wisbech launderettes
    const launderettesRef = collection(db, 'launderettes');
    const q = query(launderettesRef, where('city', '==', 'Wisbech'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ No Wisbech launderettes found');
      return;
    }
    
    console.log(`📍 Found ${snapshot.size} Wisbech launderettes to fix`);
    
    // The offset to correct the longitude (shift west)
    const LNG_OFFSET = -0.22;
    
    let fixed = 0;
    let errors = 0;
    
    for (const docSnapshot of snapshot.docs) {
      try {
        const data = docSnapshot.data();
        const oldLng = data.lng;
        const newLng = oldLng + LNG_OFFSET;
        
        const docRef = doc(db, 'launderettes', docSnapshot.id);
        await updateDoc(docRef, {
          lng: newLng
        });
        
        console.log(`✅ ${data.name}: ${oldLng.toFixed(4)} → ${newLng.toFixed(4)}`);
        fixed++;
      } catch (error) {
        console.error(`❌ Failed to update ${docSnapshot.id}:`, error);
        errors++;
      }
    }
    
    console.log('='.repeat(60));
    console.log(`✅ Fixed: ${fixed} launderettes`);
    console.log(`❌ Errors: ${errors}`);
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Fix script failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

fixWisbechCoordinates();
