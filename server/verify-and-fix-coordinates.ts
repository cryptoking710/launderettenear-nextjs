import { db } from './firestore-backend';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Extract postcode from address string
function extractPostcode(address: string): string | null {
  // UK postcode regex pattern
  const postcodePattern = /([A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})/i;
  const match = address.match(postcodePattern);
  return match ? match[1].toUpperCase().replace(/\s+/g, ' ').trim() : null;
}

// Geocode postcodes using postcodes.io bulk API
async function geocodePostcodes(postcodes: string[]): Promise<Map<string, { lat: number, lng: number }>> {
  const results = new Map<string, { lat: number, lng: number }>();
  
  // Process in batches of 100 (API limit)
  for (let i = 0; i < postcodes.length; i += 100) {
    const batch = postcodes.slice(i, i + 100);
    
    try {
      const response = await fetch('https://api.postcodes.io/postcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcodes: batch })
      });
      
      const data = await response.json();
      
      if (data.result) {
        for (const item of data.result) {
          if (item.result) {
            // Normalize postcode format for matching
            const normalizedPostcode = item.query.toUpperCase().replace(/\s+/g, ' ').trim();
            results.set(normalizedPostcode, {
              lat: item.result.latitude,
              lng: item.result.longitude
            });
          }
        }
      }
      
      // Rate limiting - be respectful to the API
      if (i + 100 < postcodes.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Error geocoding batch starting at index ${i}:`, error);
    }
  }
  
  return results;
}

async function verifyAndFixCoordinates() {
  console.log('🔍 Starting coordinate verification and correction...');
  console.log('='.repeat(80));
  
  try {
    // Step 1: Fetch all launderettes
    console.log('📥 Fetching all launderettes from Firestore...');
    const launderettesRef = collection(db, 'launderettes');
    const snapshot = await getDocs(launderettesRef);
    
    console.log(`✅ Found ${snapshot.docs.length} launderettes\n`);
    
    // Step 2: Extract postcodes and prepare data
    console.log('📍 Extracting postcodes from addresses...');
    const launderettes: Array<{
      id: string;
      name: string;
      address: string;
      postcode: string | null;
      currentLat: number;
      currentLng: number;
    }> = [];
    
    const uniquePostcodes = new Set<string>();
    let missingPostcodes = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      const postcode = extractPostcode(data.address);
      
      if (postcode) {
        uniquePostcodes.add(postcode);
      } else {
        missingPostcodes++;
        console.log(`⚠️  No postcode found for: ${data.name} (${data.address})`);
      }
      
      launderettes.push({
        id: docSnapshot.id,
        name: data.name,
        address: data.address,
        postcode,
        currentLat: data.lat,
        currentLng: data.lng
      });
    }
    
    console.log(`✅ Extracted ${uniquePostcodes.size} unique postcodes`);
    if (missingPostcodes > 0) {
      console.log(`⚠️  ${missingPostcodes} launderettes missing postcodes\n`);
    }
    
    // Step 3: Geocode all postcodes
    console.log('🌍 Geocoding postcodes using postcodes.io...');
    const postcodeCoordinates = await geocodePostcodes(Array.from(uniquePostcodes));
    console.log(`✅ Successfully geocoded ${postcodeCoordinates.size} postcodes\n`);
    
    // Step 4: Analyze discrepancies
    console.log('📊 Analyzing coordinate discrepancies...');
    console.log('='.repeat(80));
    
    const discrepancies: Array<{
      id: string;
      name: string;
      postcode: string;
      distanceError: number;
      currentLat: number;
      currentLng: number;
      correctLat: number;
      correctLng: number;
    }> = [];
    
    for (const launderette of launderettes) {
      if (!launderette.postcode) continue;
      
      const correctCoords = postcodeCoordinates.get(launderette.postcode);
      if (!correctCoords) continue;
      
      const distance = calculateDistance(
        launderette.currentLat,
        launderette.currentLng,
        correctCoords.lat,
        correctCoords.lng
      );
      
      discrepancies.push({
        id: launderette.id,
        name: launderette.name,
        postcode: launderette.postcode,
        distanceError: distance,
        currentLat: launderette.currentLat,
        currentLng: launderette.currentLng,
        correctLat: correctCoords.lat,
        correctLng: correctCoords.lng
      });
    }
    
    // Sort by distance error (worst first)
    discrepancies.sort((a, b) => b.distanceError - a.distanceError);
    
    // Generate report
    console.log('VERIFICATION REPORT');
    console.log('='.repeat(80));
    console.log(`Total launderettes analyzed: ${discrepancies.length}`);
    
    const errorThreshold = 100; // 100 meters
    const significantErrors = discrepancies.filter(d => d.distanceError > errorThreshold);
    
    console.log(`Launderettes with >100m error: ${significantErrors.length}`);
    console.log(`Average error: ${(discrepancies.reduce((sum, d) => sum + d.distanceError, 0) / discrepancies.length).toFixed(0)}m`);
    console.log(`Maximum error: ${discrepancies[0]?.distanceError.toFixed(0)}m\n`);
    
    // Show top 20 worst offenders
    console.log('TOP 20 WORST COORDINATE ERRORS:');
    console.log('-'.repeat(80));
    console.log('Distance | Postcode  | Name');
    console.log('-'.repeat(80));
    
    for (let i = 0; i < Math.min(20, discrepancies.length); i++) {
      const d = discrepancies[i];
      const distanceKm = d.distanceError / 1000;
      console.log(`${distanceKm.toFixed(2)}km | ${d.postcode.padEnd(9)} | ${d.name}`);
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Step 5: Ask for confirmation before updating
    console.log('\n🔧 READY TO UPDATE DATABASE');
    console.log(`Will update ${discrepancies.length} launderettes with correct coordinates`);
    console.log('This will replace current coordinates with postcode-based coordinates\n');
    
    // Proceed with updates
    console.log('📝 Updating database...');
    let updated = 0;
    let errors = 0;
    
    for (const d of discrepancies) {
      try {
        const docRef = doc(db, 'launderettes', d.id);
        await updateDoc(docRef, {
          lat: d.correctLat,
          lng: d.correctLng
        });
        updated++;
        
        // Progress indicator
        if (updated % 50 === 0) {
          console.log(`  Updated ${updated}/${discrepancies.length}...`);
        }
      } catch (error) {
        console.error(`❌ Failed to update ${d.name}:`, error);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ COORDINATE CORRECTION COMPLETE');
    console.log(`✅ Updated: ${updated} launderettes`);
    console.log(`❌ Errors: ${errors}`);
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the verification and fix
verifyAndFixCoordinates()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
