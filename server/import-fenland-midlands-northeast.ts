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
  
  if (hoursString === "24/7" || hoursString === "24/7 Booking") {
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

  if (hoursString.includes("Self-Service:")) {
    const match = hoursString.match(/Self-Service:\s*([^,]+)/);
    if (match) {
      const times = match[1].trim();
      return {
        monday: times,
        tuesday: times,
        wednesday: times,
        thursday: times,
        friday: times,
        saturday: times,
        sunday: times
      };
    }
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
    'sun': 'sunday',
    'monday': 'monday',
    'tuesday': 'tuesday',
    'wednesday': 'wednesday',
    'thursday': 'thursday',
    'friday': 'friday',
    'saturday': 'saturday',
    'sunday': 'sunday'
  };
  
  return dayMap[normalized] || null;
}

// Data for Fenland (Wisbech, King's Lynn, March)
const fenlandData: EnhancedLaunderette[] = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../attached_assets/Pasted--name-BJ-s-Launderette-address-25-Norfolk-St-Wisbech-PE13-2LE-Est--1761829194985_1761829194986.txt'),
  'utf-8'
));

// Data for Midlands (Milton Keynes, Northampton, Luton)
const midlandsData: EnhancedLaunderette[] = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../attached_assets/Pasted--name-Milton-Keynes-Launderette-Westcroft-address-4-5-Barnsdale-Drive-W-1761829424556_1761829424557.txt'),
  'utf-8'
));

// Data for Northeast (Sunderland, Preston, Darlington)
const northeastData: EnhancedLaunderette[] = JSON.parse(fs.readFileSync(
  path.join(__dirname, '../attached_assets/Pasted--name-Cresswell-Launderette-address-1-Cresswell-Terrace-Sunderland-SR2-7-1761829584192_1761829584193.txt'),
  'utf-8'
));

// Combine all data
const allData = [...fenlandData, ...midlandsData, ...northeastData];

async function importLaunderettes() {
  console.log('🚀 Starting import of 90 new launderettes across 9 cities...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const errors: Array<{ name: string; city: string; error: string }> = [];
  
  for (const item of allData) {
    try {
      const parsedHours = parseOpeningHours(item.openingHours);
      
      const laundered = {
        name: item.name,
        address: item.address,
        city: item.city,
        lat: item.lat,
        lng: item.lng,
        features: item.features || [],
        openingHours: parsedHours,
        description: `Launderette in ${item.city}${item.isPremium ? ' - Premium Listing' : ''}`,
        phone: '',
        website: item.website || '',
        priceRange: '£',
        isPremium: item.isPremium || false,
        photoUrl: '',
        reviewCount: item.reviewCount || 0,
        rating: item.rating || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'launderettes'), laundered);
      successCount++;
      console.log(`✅ ${successCount}/${allData.length}: ${item.name} (${item.city})`);
      
    } catch (error: any) {
      errorCount++;
      const errorMsg = error.message || 'Unknown error';
      errors.push({
        name: item.name,
        city: item.city,
        error: errorMsg
      });
      console.error(`❌ Failed: ${item.name} (${item.city}) - ${errorMsg}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully imported: ${successCount} launderettes`);
  console.log(`❌ Failed imports: ${errorCount}`);
  console.log(`📍 Cities covered: Wisbech, King's Lynn, March, Milton Keynes,`);
  console.log(`   Northampton, Luton, Sunderland, Preston, Darlington`);
  console.log('='.repeat(60));
  
  if (errors.length > 0) {
    console.log('\n⚠️  ERRORS:\n');
    errors.forEach(err => {
      console.log(`  - ${err.name} (${err.city}): ${err.error}`);
    });
  }
  
  const cityBreakdown: Record<string, number> = {};
  allData.forEach(item => {
    cityBreakdown[item.city] = (cityBreakdown[item.city] || 0) + 1;
  });
  
  console.log('\n📍 CITY BREAKDOWN:');
  Object.entries(cityBreakdown).forEach(([city, count]) => {
    console.log(`  ${city}: ${count} launderettes`);
  });
  
  return {
    total: allData.length,
    success: successCount,
    failed: errorCount,
    errors
  };
}

importLaunderettes()
  .then((result) => {
    console.log('\n✨ Import completed!');
    console.log(`Total: ${result.total} | Success: ${result.success} | Failed: ${result.failed}`);
    process.exit(result.failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error('💥 Fatal error during import:', error);
    process.exit(1);
  });
