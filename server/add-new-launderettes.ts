import { db } from './firestore-backend';
import { collection, addDoc } from 'firebase/firestore';

interface NewLaunderette {
  name: string;
  address: string;
  features: string[];
  isPremium: boolean;
  description?: string;
}

const newLaunderettes: NewLaunderette[] = [
  // London - Real addresses
  {
    name: "The Launderette SW8",
    address: "137 South Lambeth Rd, London, SW8 1XB",
    features: ["Self-Service", "Drop-Off Service Wash", "Ironing Service", "Linen Hire"],
    isPremium: false,
    description: "Full-service launderette in South Lambeth with self-service and professional wash services."
  },
  {
    name: "Amesbury Laundrette & Dry Cleaners",
    address: "256 Amesbury Avenue, London, SW2 3BL",
    features: ["Self-Service", "Service Wash", "Dry Cleaning", "Pick Up & Drop Off", "Alterations"],
    isPremium: false,
    description: "Comprehensive laundry services including dry cleaning and alterations."
  },
  
  // Glasgow - Real addresses
  {
    name: "Majestic Laundrette",
    address: "1110 Argyle St, Glasgow",
    features: ["Self-Serve Coin-Op", "Service Wash", "Dry Cleaning", "Commercial Laundry"],
    isPremium: true,
    description: "Premier launderette on Argyle Street offering commercial and personal laundry services."
  },
  {
    name: "Park Road Laundrette",
    address: "14 Park Road, Glasgow, G4 9JG",
    features: ["Self-Service", "Service Wash", "Ironing Service", "Dry Cleaning", "Pick-up & Delivery"],
    isPremium: false,
    description: "Friendly neighborhood launderette with comprehensive services and delivery options."
  },
  {
    name: "Laundry Hut",
    address: "423 Gallowgate, Glasgow, G40 2DY",
    features: ["Self-Service", "Dry Cleaning", "Ironing", "Duvet Service"],
    isPremium: false,
    description: "Convenient laundry services in Gallowgate with specialist duvet cleaning."
  }
];

// Geocoding function using Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LaunderetteNear.me/1.0'
      }
    });
    
    if (!response.ok) {
      console.error(`Geocoding failed for ${address}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      console.error(`No results found for address: ${address}`);
      return null;
    }
    
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      formattedAddress: data[0].display_name
    };
  } catch (error) {
    console.error(`Error geocoding ${address}:`, error);
    return null;
  }
}

async function addLaunderettes() {
  console.log('🌱 Adding new launderettes...\n');
  
  const launderettesRef = collection(db, 'launderettes');
  let successCount = 0;
  let errorCount = 0;
  
  for (const launderette of newLaunderettes) {
    try {
      console.log(`📍 Geocoding: ${launderette.name}...`);
      
      // Add delay to respect Nominatim rate limit (1 request/second)
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const geocodeResult = await geocodeAddress(launderette.address);
      
      if (!geocodeResult) {
        console.log(`❌ Failed to geocode: ${launderette.name} (skipping)\n`);
        errorCount++;
        continue;
      }
      
      const docData = {
        name: launderette.name,
        address: launderette.address,
        lat: geocodeResult.lat,
        lng: geocodeResult.lng,
        features: launderette.features,
        isPremium: launderette.isPremium,
        description: launderette.description,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await addDoc(launderettesRef, docData);
      console.log(`✅ Added: ${launderette.name}`);
      console.log(`   Address: ${launderette.address}`);
      console.log(`   Location: ${geocodeResult.lat.toFixed(4)}, ${geocodeResult.lng.toFixed(4)}\n`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Failed to add ${launderette.name}:`, error);
      errorCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Successfully added: ${successCount} launderettes`);
  console.log(`   Errors: ${errorCount}`);
  console.log('\n✨ Complete!');
}

// Run the script
addLaunderettes()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
