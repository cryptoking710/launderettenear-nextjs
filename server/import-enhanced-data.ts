import { db } from './firestore-backend';
import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

interface EnhancedLaunderette {
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  features: string[];
  openingHours: string;
  website: string;
  isPremium: boolean;
  reviewCount: number;
  rating: number;
}

// Parse opening hours string into object format
function parseOpeningHours(hoursString: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  // Handle formats like "Mon-Sun: 7:00am - 9:30pm"
  if (hoursString.includes('Mon-Sun:')) {
    const hours = hoursString.replace('Mon-Sun:', '').trim();
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
      result[day] = hours;
    });
    return result;
  }
  
  // Handle formats like "Mon-Fri: 9:00am - 7:00pm, Sat: 9:00am - 5:00pm, Sun: Closed"
  const segments = hoursString.split(',').map(s => s.trim());
  
  for (const segment of segments) {
    const [days, hours] = segment.split(':').map(s => s.trim());
    
    if (days.includes('Mon-Fri')) {
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        result[day] = hours;
      });
    } else if (days.includes('Mon-Sat')) {
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].forEach(day => {
        result[day] = hours;
      });
    } else if (days.includes('Mon-Thu')) {
      ['monday', 'tuesday', 'wednesday', 'thursday'].forEach(day => {
        result[day] = hours;
      });
    } else if (days.includes('Sat-Sun')) {
      result['saturday'] = hours;
      result['sunday'] = hours;
    } else {
      // Single day
      const dayMap: Record<string, string> = {
        'Mon': 'monday',
        'Tue': 'tuesday',
        'Wed': 'wednesday',
        'Thu': 'thursday',
        'Fri': 'friday',
        'Sat': 'saturday',
        'Sun': 'sunday'
      };
      const dayKey = dayMap[days];
      if (dayKey) {
        result[dayKey] = hours;
      }
    }
  }
  
  return result;
}

const enhancedData: EnhancedLaunderette[] = [
  {
    "name": "The Launderette SW8",
    "address": "137 South Lambeth Rd, London, SW8 1XB",
    "city": "London",
    "lat": 51.4790,
    "lng": -0.1230,
    "features": [
      "Self-Service",
      "Drop-Off Wash",
      "Ironing Service",
      "Linen Hire"
    ],
    "openingHours": "Mon-Sun: 7:00am - 9:30pm",
    "website": "https://www.thelaunderettesw8.co.uk/",
    "isPremium": false,
    "reviewCount": 10,
    "rating": 4.2
  },
  {
    "name": "Amesbury Laundrette & Dry Cleaners",
    "address": "256 Amesbury Avenue, London, SW2 3BL",
    "city": "London",
    "lat": 51.4420,
    "lng": -0.1340,
    "features": [
      "Self-Service",
      "Service Wash",
      "Dry Cleaning",
      "Alterations"
    ],
    "openingHours": "Mon-Fri: 9:00am - 7:00pm, Sat: 9:00am - 5:00pm, Sun: Closed",
    "website": "https://www.amesburylaundrette.co.uk/",
    "isPremium": false,
    "reviewCount": 8,
    "rating": 4.5
  },
  {
    "name": "Boswell Laundrette",
    "address": "23 Boswell St, Bloomsbury, London, WC1N 3BW",
    "city": "London",
    "lat": 51.5220,
    "lng": -0.1220,
    "features": [
      "Service Wash",
      "Express Service",
      "Collection & Delivery",
      "Dry Cleaning"
    ],
    "openingHours": "Mon-Sun: 8:00am - 8:00pm",
    "website": "https://boswelllaundrette.com/",
    "isPremium": true,
    "reviewCount": 15,
    "rating": 4.6
  },
  {
    "name": "Bandbox Laundry (Hathersage Rd)",
    "address": "72 Hathersage Rd, Manchester M13 0FN",
    "city": "Manchester",
    "lat": 53.4500,
    "lng": -2.2210,
    "features": [
      "Self-Service",
      "Wash & Iron",
      "Dry Cleaning",
      "Same Day Service",
      "Non-Toxic Cleaning"
    ],
    "openingHours": "Mon-Sat: 9:00am - 9:00pm, Sun: 10:00am - 8:00pm",
    "website": "https://bandboxlaundry.com/",
    "isPremium": true,
    "reviewCount": 20,
    "rating": 4.7
  },
  {
    "name": "Granada Dry Cleaners",
    "address": "71-73 Bridge St, Deansgate, Manchester, M3 2RH",
    "city": "Manchester",
    "lat": 53.4840,
    "lng": -2.2450,
    "features": [
      "Dry Cleaning",
      "Service Wash",
      "40+ Years Experience"
    ],
    "openingHours": "Mon-Fri: 9:00am - 6:00pm, Sat-Sun: Closed",
    "website": "https://www.granadadrycleaners.co.uk/",
    "isPremium": false,
    "reviewCount": 7,
    "rating": 4.1
  },
  {
    "name": "Majestic Laundrette",
    "address": "1110 Argyle St, Glasgow G3 8TD (Est)",
    "city": "Glasgow",
    "lat": 55.8610,
    "lng": -4.2790,
    "features": [
      "Self-Serve Coin-Op",
      "Service Wash",
      "Dry Cleaning",
      "Commercial Laundry"
    ],
    "openingHours": "Mon-Fri: 9:00am - 5:00pm, Sat: 9:00am - 4:00pm, Sun: Closed",
    "website": "http://www.majesticlaundrette.co.uk/",
    "isPremium": true,
    "reviewCount": 18,
    "rating": 4.5
  },
  {
    "name": "Park Road Laundrette",
    "address": "14 Park Road, Glasgow, G4 9JG",
    "city": "Glasgow",
    "lat": 55.8740,
    "lng": -4.2880,
    "features": [
      "Self-Service",
      "Service Wash",
      "Ironing Service",
      "Pick-up & Delivery",
      "Eco-Friendly Machines"
    ],
    "openingHours": "Mon-Thu: 8:00am - 8:00pm, Fri: 8:00am - 6:00pm, Sat: 9:00am - 5:00pm, Sun: 10:00am - 4:00pm",
    "website": "https://www.laundretteglasgow.co.uk/",
    "isPremium": false,
    "reviewCount": 25,
    "rating": 4.7
  },
  {
    "name": "Laundry Hut",
    "address": "423 Gallowgate, Glasgow, G40 2DY",
    "city": "Glasgow",
    "lat": 55.8558,
    "lng": -4.2285,
    "features": [
      "Self-Service",
      "Dry Cleaning",
      "Ironing",
      "Duvet Service"
    ],
    "openingHours": "Mon-Fri: 8:00am - 6:00pm, Sat: 10:00am - 4:00pm, Sun: Closed",
    "website": "https://www.laundryhut.co.uk",
    "isPremium": false,
    "reviewCount": 15,
    "rating": 4.3
  }
];

async function importEnhancedData() {
  console.log('🌱 Importing enhanced launderette data...\n');
  
  const launderettesRef = collection(db, 'launderettes');
  
  // Get all existing launderettes
  const snapshot = await getDocs(launderettesRef);
  const existingLaunderettes = new Map();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    existingLaunderettes.set(data.name, { id: doc.id, data });
  });
  
  let addedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const item of enhancedData) {
    try {
      const openingHoursObj = parseOpeningHours(item.openingHours);
      
      const docData = {
        name: item.name,
        address: item.address,
        lat: item.lat,
        lng: item.lng,
        features: item.features,
        isPremium: item.isPremium,
        website: item.website,
        openingHours: openingHoursObj,
        description: `${item.city} launderette with ${item.features.join(', ').toLowerCase()}. Rated ${item.rating} stars based on ${item.reviewCount} reviews.`,
        updatedAt: Date.now()
      };
      
      // Check if this launderette already exists
      const existing = existingLaunderettes.get(item.name);
      
      if (existing) {
        // Update existing launderette
        const docRef = doc(db, 'launderettes', existing.id);
        await updateDoc(docRef, docData);
        console.log(`✅ Updated: ${item.name}`);
        console.log(`   Website: ${item.website}`);
        console.log(`   Opening Hours: ${item.openingHours}\n`);
        updatedCount++;
      } else {
        // Add new launderette
        await addDoc(launderettesRef, {
          ...docData,
          createdAt: Date.now()
        });
        console.log(`✨ Added: ${item.name}`);
        console.log(`   Address: ${item.address}`);
        console.log(`   Website: ${item.website}`);
        console.log(`   Opening Hours: ${item.openingHours}\n`);
        addedCount++;
      }
      
    } catch (error) {
      console.error(`❌ Failed to process ${item.name}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n📊 Import Summary:');
  console.log(`   New launderettes added: ${addedCount}`);
  console.log(`   Existing updated: ${updatedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log('\n✨ Import complete!');
}

// Run the script
importEnhancedData()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
