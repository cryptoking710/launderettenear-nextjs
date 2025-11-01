import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, limit as firestoreLimit } from 'firebase/firestore';
import OpenAI from 'openai';

// Initialize Firebase using client SDK (same as backend)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize OpenAI with Replit AI Integrations
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface FaqItem {
  question: string;
  answer: string;
}

async function generateFaqsForCity(cityName: string): Promise<FaqItem[]> {
  const prompt = `Generate 5 frequently asked questions and answers about using launderettes in ${cityName}, UK. 
  
Focus on general launderette topics that would be helpful for people in ${cityName}, such as:
- What services do launderettes offer?
- How much does it cost to use a launderette?
- Do I need to stay while my laundry is washing?
- What payment methods do launderettes accept?
- What's the difference between self-service and service wash?
- How long does it take to wash and dry clothes?
- What should I bring to a launderette?

Return ONLY a valid JSON array with exactly 5 objects, each with "question" and "answer" fields. Keep answers concise (2-3 sentences) and helpful.

Example format:
[
  {
    "question": "What services do launderettes in ${cityName} typically offer?",
    "answer": "Most launderettes in ${cityName} offer self-service washing and drying machines, as well as service wash where staff will wash, dry and fold your clothes for you. Many also provide ironing services and dry cleaning."
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates FAQ content for launderette directory websites. Always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content?.trim() || '[]';
    
    // Try to extract JSON if it's wrapped in markdown code blocks
    let jsonContent = content;
    if (content.startsWith('```json')) {
      jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (content.startsWith('```')) {
      jsonContent = content.replace(/```\n?/g, '').trim();
    }
    
    const faqs = JSON.parse(jsonContent) as FaqItem[];
    
    // Validate we got exactly 5 FAQs
    if (!Array.isArray(faqs) || faqs.length !== 5) {
      throw new Error(`Expected 5 FAQs, got ${faqs.length}`);
    }
    
    // Validate structure
    for (const faq of faqs) {
      if (!faq.question || !faq.answer) {
        throw new Error('Invalid FAQ structure');
      }
    }
    
    return faqs;
  } catch (error) {
    console.error(`Error generating FAQs for ${cityName}:`, error);
    throw error;
  }
}

async function getUniqueCities(): Promise<string[]> {
  const snapshot = await getDocs(collection(db, 'launderettes'));
  const cities = new Set<string>();
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.city) {
      cities.add(data.city);
    }
  });
  
  return Array.from(cities).sort();
}

async function checkExistingFaq(cityName: string): Promise<boolean> {
  const q = query(
    collection(db, 'faqs'),
    where('cityName', '==', cityName),
    firestoreLimit(1)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function saveFaqsToFirestore(cityName: string, faqs: FaqItem[]): Promise<void> {
  // Check if FAQs already exist for this city
  const exists = await checkExistingFaq(cityName);
  
  if (exists) {
    console.log(`⚠️  FAQs already exist for ${cityName}, skipping...`);
    return;
  }
  
  const faqData = {
    cityName,
    questions: faqs,
    createdAt: Date.now(),
  };
  
  await addDoc(collection(db, 'faqs'), faqData);
  console.log(`✅ Saved FAQs for ${cityName}`);
}

async function main() {
  try {
    console.log('🚀 Starting FAQ generation...\n');
    
    // Get all unique cities
    const cities = await getUniqueCities();
    console.log(`📍 Found ${cities.length} unique cities:\n${cities.join(', ')}\n`);
    
    // Generate and save FAQs for each city
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      console.log(`\n[${i + 1}/${cities.length}] Processing ${city}...`);
      
      try {
        // Check if already exists
        const exists = await checkExistingFaq(city);
        if (exists) {
          console.log(`   ⚠️  FAQs already exist, skipping`);
          skippedCount++;
          continue;
        }
        
        // Generate FAQs
        console.log(`   🤖 Generating FAQs...`);
        const faqs = await generateFaqsForCity(city);
        
        // Save to Firestore
        console.log(`   💾 Saving to Firestore...`);
        await saveFaqsToFirestore(city, faqs);
        successCount++;
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`   ❌ Error processing ${city}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully generated: ${successCount}`);
    console.log(`   ⚠️  Skipped (already exist): ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📝 Total cities: ${cities.length}`);
    console.log('='.repeat(50));
    
    if (successCount > 0) {
      console.log('\n✨ FAQ generation complete!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
