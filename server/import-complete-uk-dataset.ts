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
  
  // Handle complex formats with multiple segments
  const segments = hoursString.split(',').map(s => s.trim());
  
  for (const segment of segments) {
    const colonIndex = segment.indexOf(':');
    if (colonIndex === -1) continue;
    
    const days = segment.substring(0, colonIndex).trim();
    const hours = segment.substring(colonIndex + 1).trim();
    
    if (!hours) continue;
    
    // Handle day ranges
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
    } else if (days.includes('Wed-Thu')) {
      result['wednesday'] = hours;
      result['thursday'] = hours;
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

async function importCompleteDataset() {
  console.log('🌱 Importing complete UK launderette dataset (60 locations)...\n');
  
  // Read the JSON file
  const dataPath = path.join(__dirname, 'full-uk-dataset.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const fullDataset: EnhancedLaunderette[] = JSON.parse(rawData);
  
  console.log(`📦 Loaded ${fullDataset.length} launderettes from JSON file\n`);
  
  const launderettesRef = collection(db, 'launderettes');
  
  // Get all existing launderettes
  const snapshot = await getDocs(launderettesRef);
  const existingLaunderettes = new Map();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    existingLaunderettes.set(data.name, { id: doc.id, data });
  });
  
  console.log(`📊 Currently in database: ${existingLaunderettes.size} launderettes\n`);
  
  let addedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  const cityCounts: Record<string, number> = {};
  
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
      
      // Track city counts
      cityCounts[item.city] = (cityCounts[item.city] || 0) + 1;
      
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
  
  Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).forEach(([city, count]) => {
    console.log(`   ${city}: ${count} launderettes`);
  });
  
  console.log('\n✨ Import complete!');
}

// Run the script
importCompleteDataset()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
