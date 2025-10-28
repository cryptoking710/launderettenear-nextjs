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
    
    if (!hours) continue;
    
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

const fullDataset: EnhancedLaunderette[] = [
  {"name":"The Launderette SW8","address":"137 South Lambeth Rd, London, SW8 1XB","city":"London","lat":51.479,"lng":-0.123,"features":["Self-Service","Drop-Off Wash","Ironing Service","Linen Hire"],"openingHours":"Mon-Sun: 7:00am - 9:30pm","website":"https://www.thelaunderettesw8.co.uk/","isPremium":false,"reviewCount":10,"rating":4.2},
  {"name":"Amesbury Laundrette & Dry Cleaners","address":"256 Amesbury Avenue, London, SW2 3BL","city":"London","lat":51.442,"lng":-0.134,"features":["Self-Service","Service Wash","Dry Cleaning","Alterations"],"openingHours":"Mon-Fri: 9:00am - 7:00pm, Sat: 9:00am - 5:00pm, Sun: Closed","website":"https://www.amesburylaundrette.co.uk/","isPremium":false,"reviewCount":8,"rating":4.5},
  {"name":"Boswell Laundrette","address":"23 Boswell St, Bloomsbury, London, WC1N 3BW","city":"London","lat":51.522,"lng":-0.122,"features":["Service Wash","Express Service","Collection & Delivery","Dry Cleaning"],"openingHours":"Mon-Sun: 8:00am - 8:00pm","website":"https://boswelllaundrette.com/","isPremium":true,"reviewCount":15,"rating":4.6},
  {"name":"1 Stop Wash Launderette & Drycleaner","address":"100 Caledonian Rd, London, N1 9DN","city":"London","lat":51.535,"lng":-0.116,"features":["Eco-Friendly","Wash & Fold","Free Pickup & Delivery"],"openingHours":"Mon-Fri: 7:30am - 8:30pm, Sat-Sun: 9:00am - 7:00pm","website":"https://1stopwash.com/","isPremium":true,"reviewCount":35,"rating":4.8},
  {"name":"Notting Hill Gate Launderette","address":"150 Notting Hill Gate, London, W11 3QG","city":"London","lat":51.509,"lng":-0.197,"features":["Self-Service","Staffed","Dry Cleaning","Duvet Service"],"openingHours":"Mon-Sat: 8:00am - 7:00pm, Sun: 10:00am - 4:00pm","website":"https://www.nhglaunderette.co.uk/","isPremium":false,"reviewCount":20,"rating":4.1},
  {"name":"Pimlico Wash & Dry","address":"30 Lupus St, London, SW1V 3EL","city":"London","lat":51.489,"lng":-0.134,"features":["Self-Service","Service Wash","Ironing"],"openingHours":"Mon-Fri: 8:00am - 6:00pm, Sat: 9:00am - 5:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":12,"rating":3.9},
  {"name":"The Wash House Shoreditch","address":"10-12 Hackney Rd, London, E2 7SJ","city":"London","lat":51.528,"lng":-0.076,"features":["Self-Service","Dry Cleaning","Large Capacity Machines"],"openingHours":"Mon-Sun: 7:00am - 10:00pm","website":"http://www.thewashhouse.com/","isPremium":false,"reviewCount":9,"rating":4.0},
  {"name":"Wandsworth Launderette","address":"88 Old York Rd, London, SW18 1TG","city":"London","lat":51.458,"lng":-0.19,"features":["Self-Service","Service Wash","Fast Turnaround"],"openingHours":"Mon-Sat: 8:30am - 6:30pm, Sun: Closed","website":"","isPremium":false,"reviewCount":18,"rating":4.4},
  {"name":"Kilburn Laundrette","address":"300 Kilburn High Rd, London, NW6 2DN","city":"London","lat":51.547,"lng":-0.203,"features":["Self-Service","Service Wash","Duvet Service","Alterations"],"openingHours":"Mon-Sun: 7:00am - 10:00pm","website":"","isPremium":false,"reviewCount":22,"rating":4.2},
  {"name":"The Launderette Fulham","address":"8 Munster Rd, London, SW6 4HS","city":"London","lat":51.482,"lng":-0.195,"features":["Self-Service","Dry Cleaning","Pick-up Service"],"openingHours":"Mon-Sat: 8:00am - 7:00pm, Sun: 9:00am - 4:00pm","website":"http://www.thelaunderettefulham.co.uk/","isPremium":false,"reviewCount":14,"rating":4.5},
  {"name":"Bandbox Laundry (Hathersage Rd)","address":"72 Hathersage Rd, Manchester M13 0FN","city":"Manchester","lat":53.45,"lng":-2.221,"features":["Self-Service","Wash & Iron","Dry Cleaning","Same Day Service"],"openingHours":"Mon-Sat: 9:00am - 9:00pm, Sun: 10:00am - 8:00pm","website":"https://bandboxlaundry.com/","isPremium":true,"reviewCount":20,"rating":4.7},
  {"name":"Granada Dry Cleaners","address":"71-73 Bridge St, Deansgate, Manchester, M3 2RH","city":"Manchester","lat":53.484,"lng":-2.245,"features":["Dry Cleaning","Service Wash","40+ Years Experience"],"openingHours":"Mon-Fri: 9:00am - 6:00pm, Sat-Sun: Closed","website":"https://www.granadadrycleaners.co.uk/","isPremium":false,"reviewCount":7,"rating":4.1},
  {"name":"3D Laundry","address":"78 Stockport Rd, Manchester, M12 6AL","city":"Manchester","lat":53.457,"lng":-2.215,"features":["Dry Cleaning","Onsite Alterations & Repairs","Same Day Returns"],"openingHours":"Mon-Sat: 9:00am - 7:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":15,"rating":4.8},
  {"name":"The Clean Machine Launderette & Dry Cleaners","address":"120 Withington Rd, Manchester, M16 8FA","city":"Manchester","lat":53.447,"lng":-2.246,"features":["Launderette","Dry Cleaners","Self-Service"],"openingHours":"Mon-Sun: 8:00am - 6:00pm","website":"","isPremium":false,"reviewCount":4,"rating":4.0},
  {"name":"Atlas Launderette Dry Cleaning & Tailoring","address":"Unit 1, 10b Wilmslow Rd, Manchester, M14 5TP","city":"Manchester","lat":53.445,"lng":-2.231,"features":["Self-Service","Dry Cleaning","Tailoring Services","Service Wash"],"openingHours":"Mon-Sat: 9:00am - 7:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":1,"rating":5.0},
  {"name":"Amazing Grace Launderette","address":"668 Rochdale Rd, Manchester, M9 5TT","city":"Manchester","lat":53.513,"lng":-2.222,"features":["Self-Service","Laundry Service"],"openingHours":"Mon-Sat: 9:00am - 6:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":3,"rating":4.3},
  {"name":"The Laundrette (Ashton Old Rd)","address":"1406 Ashton Old Rd, Manchester, M11 1HL","city":"Manchester","lat":53.473,"lng":-2.152,"features":["Self-Service","Drop-Off Service"],"openingHours":"Mon-Sun: 7:00am - 10:00pm","website":"","isPremium":false,"reviewCount":1,"rating":5.0},
  {"name":"The Blue Dolphin Launderette","address":"76C Davyhulme Road, Urmston, Manchester M41 7DN","city":"Manchester","lat":53.439,"lng":-2.353,"features":["Self-Service","Dry Cleaning","Duvet Service"],"openingHours":"Mon-Fri: 8:00am - 7:00pm, Sat: 9:00am - 5:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":5,"rating":4.4},
  {"name":"Babbs Bubbles","address":"211 Eccles Old Rd, Salford, Manchester, M6 8HA","city":"Manchester","lat":53.488,"lng":-2.31,"features":["Self-Service","Service Wash","Pick-up & Delivery"],"openingHours":"Mon-Sat: 9:00am - 6:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":4,"rating":4.0},
  {"name":"Fallowfield Laundry Centre","address":"302 Platt Ln, Fallowfield, Manchester M14 7BZ","city":"Manchester","lat":53.447,"lng":-2.221,"features":["Self-Service","Service Wash"],"openingHours":"Mon-Sun: 9:00am - 9:00pm","website":"","isPremium":false,"reviewCount":6,"rating":4.2},
  {"name":"Majestic Laundrette","address":"1110 Argyle St, Glasgow G3 8TD (Est)","city":"Glasgow","lat":55.861,"lng":-4.279,"features":["Self-Serve Coin-Op","Service Wash","Dry Cleaning","Commercial Laundry"],"openingHours":"Mon-Fri: 9:00am - 5:00pm, Sat: 9:00am - 4:00pm, Sun: Closed","website":"http://www.majesticlaundrette.co.uk/","isPremium":true,"reviewCount":18,"rating":4.5},
  {"name":"Park Road Laundrette","address":"14 Park Road, Glasgow, G4 9JG","city":"Glasgow","lat":55.874,"lng":-4.288,"features":["Self-Service","Service Wash","Ironing Service","Pick-up & Delivery","Eco-Friendly Machines"],"openingHours":"Mon-Thu: 8:00am - 8:00pm, Fri: 8:00am - 6:00pm, Sat: 9:00am - 5:00pm, Sun: 10:00am - 4:00pm","website":"https://www.laundretteglasgow.co.uk/","isPremium":false,"reviewCount":25,"rating":4.7},
  {"name":"Laundry Hut","address":"423 Gallowgate, Glasgow, G40 2DY","city":"Glasgow","lat":55.8558,"lng":-4.2285,"features":["Self-Service","Dry Cleaning","Ironing","Duvet Service"],"openingHours":"Mon-Fri: 8:00am - 6:00pm, Sat: 10:00am - 4:00pm, Sun: Closed","website":"https://www.laundryhut.co.uk","isPremium":false,"reviewCount":15,"rating":4.3},
  {"name":"VIP Dry Cleaning Laundry & Ironing","address":"247 Great Western Rd, Glasgow, G4 9EG","city":"Glasgow","lat":55.873,"lng":-4.279,"features":["Launderette","Dry Cleaning","Ironing","Express Service"],"openingHours":"Mon-Fri: 8:30am - 6:30pm, Sat: 9:00am - 5:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":5,"rating":4.0},
  {"name":"Crease Laundry Services","address":"500 Cathcart Rd, Glasgow, G42 7BX","city":"Glasgow","lat":55.836,"lng":-4.257,"features":["Launderette","Service Wash","Ironing","Dry Cleaning"],"openingHours":"Mon-Sat: 9:00am - 7:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":18,"rating":4.9},
  {"name":"Parade Launderette","address":"492 Alexandra Parade, Glasgow, G31 3BQ","city":"Glasgow","lat":55.862,"lng":-4.204,"features":["Launderette","Self-Service","Duvet Cleaning"],"openingHours":"Mon-Sat: 8:00am - 5:30pm, Sun: Closed","website":"","isPremium":false,"reviewCount":6,"rating":4.0},
  {"name":"Havelock Launderette & Dry Cleaners","address":"10 Havelock St, Glasgow, G11 5JA","city":"Glasgow","lat":55.867,"lng":-4.301,"features":["Launderette","Dry Cleaning","Service Wash"],"openingHours":"Mon-Sat: 9:00am - 6:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":11,"rating":4.6},
  {"name":"Spruced Up Laundrette Ltd","address":"550 Paisley Rd West, Glasgow, G51 1RJ","city":"Glasgow","lat":55.849,"lng":-4.316,"features":["Launderette","Family Run Business","Service Wash"],"openingHours":"Mon-Sat: 9:00am - 5:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":20,"rating":5.0},
  {"name":"The Wee Steamie","address":"57-59 Hillhouse St, Glasgow, G21 4HS","city":"Glasgow","lat":55.875,"lng":-4.225,"features":["Launderette","Service Wash","Affordable Prices"],"openingHours":"Mon-Fri: 8:30am - 6:00pm, Sat: 9:00am - 4:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":10,"rating":4.7},
  {"name":"Shawlands Laundry","address":"22 Minard Rd, Glasgow G41 2HN","city":"Glasgow","lat":55.839,"lng":-4.28,"features":["Launderette","Service Wash","Ironing"],"openingHours":"Mon-Fri: 9:00am - 5:00pm, Sat: 9:00am - 4:00pm, Sun: Closed","website":"","isPremium":false,"reviewCount":12,"rating":4.4}
];

async function importFullDataset() {
  console.log('🌱 Importing full launderette dataset (30 locations)...\n');
  
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
  
  for (const item of fullDataset) {
    try {
      const openingHoursObj = parseOpeningHours(item.openingHours);
      
      const docData = {
        name: item.name,
        address: item.address,
        lat: item.lat,
        lng: item.lng,
        features: item.features,
        isPremium: item.isPremium,
        website: item.website || '',
        openingHours: openingHoursObj,
        description: `${item.city} launderette offering ${item.features.slice(0, 3).join(', ').toLowerCase()}.`,
        updatedAt: Date.now()
      };
      
      // Check if this launderette already exists
      const existing = existingLaunderettes.get(item.name);
      
      if (existing) {
        // Update existing launderette
        const docRef = doc(db, 'launderettes', existing.id);
        await updateDoc(docRef, docData);
        console.log(`✅ Updated: ${item.name} (${item.city})`);
        updatedCount++;
      } else {
        // Add new launderette
        await addDoc(launderettesRef, {
          ...docData,
          createdAt: Date.now()
        });
        console.log(`✨ Added: ${item.name} (${item.city})`);
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
  console.log(`   Total in dataset: ${fullDataset.length}`);
  console.log('\n🌍 Geographic Distribution:');
  console.log(`   London: 10 launderettes`);
  console.log(`   Manchester: 10 launderettes`);
  console.log(`   Glasgow: 10 launderettes`);
  console.log('\n✨ Import complete!');
}

// Run the script
importFullDataset()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
