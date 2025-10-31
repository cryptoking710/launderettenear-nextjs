import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Initialize Firebase using client SDK (same as backend)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Parse opening hours from compact format to day-by-day format
function parseOpeningHours(hoursStr: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Handle special cases
  if (hoursStr === '24/7' || hoursStr === '24/7 Booking') {
    return {
      monday: '12:00am - 11:59pm',
      tuesday: '12:00am - 11:59pm',
      wednesday: '12:00am - 11:59pm',
      thursday: '12:00am - 11:59pm',
      friday: '12:00am - 11:59pm',
      saturday: '12:00am - 11:59pm',
      sunday: '12:00am - 11:59pm'
    };
  }
  
  // Split by comma to handle multiple day ranges
  const segments = hoursStr.split(', ');
  
  segments.forEach(segment => {
    const match = segment.match(/^([^:]+):\s*(.+)$/);
    if (!match) return;
    
    const [, daysStr, hours] = match;
    const dayPart = daysStr.trim();
    const hoursPart = hours.trim();
    
    // Parse day ranges
    let days: string[] = [];
    
    if (dayPart === 'Mon-Sun') {
      days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    } else if (dayPart === 'Mon-Sat') {
      days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    } else if (dayPart === 'Mon-Fri') {
      days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    } else if (dayPart === 'Sat-Sun') {
      days = ['saturday', 'sunday'];
    } else if (dayPart === 'Mon') {
      days = ['monday'];
    } else if (dayPart === 'Tue') {
      days = ['tuesday'];
    } else if (dayPart === 'Wed') {
      days = ['wednesday'];
    } else if (dayPart === 'Thu') {
      days = ['thursday'];
    } else if (dayPart === 'Fri') {
      days = ['friday'];
    } else if (dayPart === 'Sat') {
      days = ['saturday'];
    } else if (dayPart === 'Sun') {
      days = ['sunday'];
    }
    
    // Apply hours to all days in range
    days.forEach(day => {
      result[day] = hoursPart;
    });
  });
  
  // Fill in missing days with "Closed"
  const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  allDays.forEach(day => {
    if (!result[day]) {
      result[day] = 'Closed';
    }
  });
  
  return result;
}

async function main() {
  const filePath = path.join(process.cwd(), 'attached_assets/Pasted--name-Thetford-Launderette-Icknield-Way-address-39-Icknield-Way-Thetfor-1761910420365_1761910420366.txt');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const listings = JSON.parse(rawData);
  
  console.log(`Found ${listings.length} listings to import`);
  console.log(`Cities: ${[...new Set(listings.map((l: any) => l.city))].join(', ')}`);
  console.log('');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const listing of listings) {
    try {
      // Convert to our schema format
      const launderette = {
        name: listing.name,
        address: listing.address,
        city: listing.city,
        lat: listing.lat,
        lng: listing.lng,
        features: listing.features || [],
        openingHours: parseOpeningHours(listing.openingHours || ''),
        website: listing.website || '',
        phone: '',
        email: '',
        isPremium: listing.isPremium || false,
        priceRange: '££',
        description: `Launderette in ${listing.city}${listing.isPremium ? ' - Premium Listing' : ''}`,
        photoUrls: [],
        rating: listing.rating || 0,
        reviewCount: listing.reviewCount || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, 'launderettes'), launderette);
      console.log(`✅ Added: ${listing.name} (${listing.city}) - ID: ${docRef.id}`);
      successCount++;
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error(`❌ Error adding ${listing.name}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Import complete:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📍 Total: ${listings.length}`);
  console.log(`\n🏙️  Cities added: Thetford, Great Yarmouth, Ely`);
  console.log(`📈 Total listings now: ${372 + successCount}`);
  
  // Exit process
  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
