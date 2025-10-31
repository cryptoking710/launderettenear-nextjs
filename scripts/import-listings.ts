import fs from 'fs';
import path from 'path';

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
        reviewCount: listing.reviewCount || 0
      };
      
      // Post to API
      const response = await fetch('http://localhost:5000/api/launderettes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(launderette)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Added: ${listing.name} (ID: ${result.id})`);
        successCount++;
      } else {
        const error = await response.text();
        console.error(`❌ Failed to add ${listing.name}: ${error}`);
        errorCount++;
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error adding ${listing.name}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Import complete:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📍 Total: ${listings.length}`);
}

main().catch(console.error);
