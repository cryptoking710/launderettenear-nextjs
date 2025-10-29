import { db } from './firestore-backend';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function parseOpeningHours(hoursString: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  if (hoursString === "24/7") {
    const allDay = "12:00 AM - 11:59 PM";
    return {
      monday: allDay,
      tuesday: allDay,
      wednesday: allDay,
      thursday: allDay,
      friday: allDay,
      saturday: allDay,
      sunday: allDay
    };
  }

  const parts = hoursString.split(', ');
  
  parts.forEach(part => {
    const colonIndex = part.indexOf(':');
    if (colonIndex === -1) return;
    
    const daysPart = part.substring(0, colonIndex).trim();
    const timePart = part.substring(colonIndex + 1).trim();
    
    if (timePart.toLowerCase() === 'closed') {
      if (daysPart.includes('-')) {
        const [start, end] = daysPart.split('-').map(d => d.trim().toLowerCase());
        const days = getDayRange(start, end);
        days.forEach(day => {
          result[day] = 'Closed';
        });
      } else {
        const day = normalizeDay(daysPart);
        if (day) result[day] = 'Closed';
      }
      return;
    }
    
    if (daysPart.includes('-')) {
      const [start, end] = daysPart.split('-').map(d => d.trim().toLowerCase());
      const days = getDayRange(start, end);
      days.forEach(day => {
        result[day] = timePart;
      });
    } else {
      const day = normalizeDay(daysPart);
      if (day) result[day] = timePart;
    }
  });
  
  return result;
}

function getDayRange(start: string, end: string): string[] {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const startDay = normalizeDay(start);
  const endDay = normalizeDay(end);
  
  if (!startDay || !endDay) return [];
  
  const startIdx = daysOfWeek.indexOf(startDay);
  const endIdx = daysOfWeek.indexOf(endDay);
  
  if (startIdx === -1 || endIdx === -1) return [];
  
  const result: string[] = [];
  let idx = startIdx;
  while (idx !== endIdx) {
    result.push(daysOfWeek[idx]);
    idx = (idx + 1) % 7;
  }
  result.push(daysOfWeek[endIdx]);
  
  return result;
}

function normalizeDay(day: string): string | null {
  const normalized = day.toLowerCase().trim();
  const dayMap: Record<string, string> = {
    'mon': 'monday',
    'tue': 'tuesday',
    'tues': 'tuesday',
    'wed': 'wednesday',
    'weds': 'wednesday',
    'thu': 'thursday',
    'thur': 'thursday',
    'thurs': 'thursday',
    'fri': 'friday',
    'sat': 'saturday',
    'sun': 'sunday'
  };
  
  if (normalized in dayMap) return dayMap[normalized];
  if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(normalized)) {
    return normalized;
  }
  return null;
}

async function importLaunderettes() {
  console.log('🌱 Importing Bradford, Stoke-on-Trent & Reading launderettes (30 locations)...\n');
  
  const jsonPath = path.join(__dirname, '..', 'sample-data', 'bradford-stoke-reading.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const launderettes: EnhancedLaunderette[] = JSON.parse(jsonData);
  
  console.log(`📦 Loaded ${launderettes.length} launderettes from JSON file\n`);
  
  const launderettesRef = collection(db, 'launderettes');
  const snapshot = await getDocs(launderettesRef);
  const existingLaunderettes = new Map(
    snapshot.docs.map(doc => [doc.data().name, doc.id])
  );
  
  console.log(`📊 Currently in database: ${existingLaunderettes.size} launderettes\n`);
  
  let addedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;

  for (const launderette of launderettes) {
    try {
      const openingHours = parseOpeningHours(launderette.openingHours);
      
      const firestoreData: any = {
        name: launderette.name,
        address: launderette.address,
        lat: launderette.lat,
        lng: launderette.lng,
        features: launderette.features,
        isPremium: launderette.isPremium,
        openingHours: openingHours,
        priceRange: launderette.isPremium ? 'premium' : 'moderate',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      if (launderette.website && launderette.website.trim() !== '') {
        firestoreData.website = launderette.website;
      }

      const existingId = existingLaunderettes.get(launderette.name);
      
      if (existingId) {
        await updateDoc(doc(db, 'launderettes', existingId), {
          ...firestoreData,
          updatedAt: Date.now()
        });
        console.log(`✅ Updated: ${launderette.name} (${launderette.city})`);
        updatedCount++;
      } else {
        await addDoc(launderettesRef, firestoreData);
        console.log(`✨ Added: ${launderette.name} (${launderette.city})`);
        addedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${launderette.name}:`, error);
      errorCount++;
    }
  }
  
  const cityBreakdown: Record<string, number> = {};
  launderettes.forEach(l => {
    cityBreakdown[l.city] = (cityBreakdown[l.city] || 0) + 1;
  });
  
  console.log(`\n📊 Import Summary:`);
  console.log(`   New launderettes added: ${addedCount}`);
  console.log(`   Existing updated: ${updatedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total in dataset: ${launderettes.length}`);
  
  console.log(`\n🌍 Geographic Distribution:`);
  Object.entries(cityBreakdown)
    .sort((a, b) => b[1] - a[1])
    .forEach(([city, count]) => {
      console.log(`   ${city}: ${count} launderettes`);
    });
  
  console.log(`\n✨ Import complete!`);
}

importLaunderettes()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Import failed:', error);
    process.exit(1);
  });
