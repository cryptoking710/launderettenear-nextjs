// Script to generate engaging blog posts using OpenAI
import OpenAI from "openai";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();
const openai = new OpenAI({ 
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

const blogTopics = [
  {
    title: "10 Money-Saving Laundry Tips Every UK Household Should Know",
    slug: "money-saving-laundry-tips-uk",
    prompt: "Write an engaging, practical 1000-word blog post about money-saving laundry tips for UK households. Include specific tips about water temperature, detergent usage, energy-efficient washing, air drying vs tumble drying, and when to use a launderette vs home washing. Make it friendly, conversational, and include real cost comparisons. Format with clear headings and bullet points where appropriate."
  },
  {
    title: "The Complete Guide to Stain Removal: Coffee, Wine, Grass & More",
    slug: "complete-stain-removal-guide",
    prompt: "Write a comprehensive 1100-word guide on removing common household stains. Cover coffee, red wine, grass, blood, oil, ink, and chocolate stains. For each stain type, provide step-by-step instructions, recommended products available in the UK, and tips on what to avoid. Use a helpful, encouraging tone and include a quick reference table. Format with clear sections and actionable advice."
  },
  {
    title: "How to Choose the Right Launderette: A First-Timer's Guide",
    slug: "choosing-right-launderette-guide",
    prompt: "Write a friendly 900-word guide for people using a launderette for the first time in the UK. Cover what to look for (cleanliness, machine variety, staff presence), what to bring, how pricing works, safety tips, and etiquette. Include a section on premium services like service washes. Make it welcoming and reduce anxiety for first-time users."
  },
  {
    title: "Eco-Friendly Laundry: Reducing Your Environmental Impact in 2025",
    slug: "eco-friendly-laundry-tips-2025",
    prompt: "Write an informative 1000-word article about environmentally friendly laundry practices for UK readers. Cover eco-friendly detergents, cold water washing, microplastic filters, sustainable fabric care, and choosing green launderettes. Include statistics about water and energy usage, and practical tips that actually work. Balance environmental benefits with cost savings."
  },
  {
    title: "Washing Machine vs Launderette: Which is More Cost-Effective?",
    slug: "washing-machine-vs-launderette-costs",
    prompt: "Write a detailed 1100-word cost comparison between owning a washing machine and using a launderette in the UK in 2025. Include purchase costs, running costs (water, electricity, detergent), maintenance, lifespan, and convenience factors. Provide scenarios for different household sizes and living situations. Use real UK pricing and be balanced and objective."
  },
  {
    title: "Understanding UK Laundry Symbols: A Complete Visual Guide",
    slug: "uk-laundry-symbols-guide",
    prompt: "Write a comprehensive 950-word guide explaining UK and international laundry care symbols. Organize by category: washing, bleaching, drying, ironing, and dry cleaning. For each symbol, explain what it means and provide practical advice. Include tips on what happens if you ignore the symbols. Make it easy to understand and reference."
  },
  {
    title: "How to Care for Delicate Fabrics: Silk, Wool, and Cashmere",
    slug: "delicate-fabric-care-guide",
    prompt: "Write an expert 1000-word guide on caring for delicate fabrics like silk, wool, cashmere, and linen. Cover hand washing vs machine washing, appropriate detergents, drying methods, storage tips, and when to use professional services. Include specific advice for UK weather and humidity conditions. Use an authoritative but accessible tone."
  },
  {
    title: "The Ultimate Duvet and Bedding Cleaning Guide",
    slug: "duvet-bedding-cleaning-guide",
    prompt: "Write a thorough 1050-word guide on cleaning duvets, pillows, and bedding. Cover different filling types (feather, synthetic, wool), washing frequencies, machine capacity requirements, drying techniques, and when to use a launderette's large capacity machines. Include seasonal cleaning advice and allergy considerations for UK households."
  },
  {
    title: "Laundry Mistakes That Are Ruining Your Clothes (And How to Fix Them)",
    slug: "common-laundry-mistakes-fix",
    prompt: "Write an engaging 1000-word article about common laundry mistakes UK households make. Cover overloading machines, wrong temperatures, incorrect detergent amounts, mixing colors, neglecting pockets, improper drying, and more. For each mistake, explain the consequences and provide the correct method. Use a helpful, non-judgmental tone."
  },
  {
    title: "Student's Guide to Laundry: Essential Tips for University Life",
    slug: "student-laundry-guide-university",
    prompt: "Write a practical 900-word guide specifically for UK university students doing laundry for the first time. Cover basics like sorting, detergent amounts, machine settings, dealing with shared facilities, budgeting, quick fixes for emergencies, and time management. Make it friendly, relatable, and include student-specific money-saving tips."
  },
  {
    title: "Professional Dry Cleaning: When Is It Really Necessary?",
    slug: "dry-cleaning-when-necessary",
    prompt: "Write an informative 950-word article explaining when dry cleaning is truly necessary versus when home washing works fine. Cover fabric types, care labels, suits, coats, delicates, and special occasion wear. Discuss dry cleaning costs in the UK, alternatives, and how to find quality dry cleaners. Be honest about when you can save money vs when professional care is essential."
  },
  {
    title: "Winter Laundry Tips: Drying Clothes in UK Weather",
    slug: "winter-laundry-drying-tips-uk",
    prompt: "Write a practical 1000-word guide specifically about drying laundry during UK winters. Cover indoor drying challenges (condensation, mold, heating costs), outdoor drying in cold weather, dehumidifiers, heated airers, and when tumble drying or launderette services make sense. Include energy-saving tips and preventing musty smells. Very UK-specific and seasonal."
  }
];

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function createExcerpt(content: string): string {
  // Extract first paragraph or first 150 characters
  const firstParagraph = content.split('\n\n')[0];
  if (firstParagraph.length <= 160) {
    return firstParagraph;
  }
  return firstParagraph.substring(0, 157) + '...';
}

async function generateBlogPost(topic: typeof blogTopics[0]) {
  console.log(`\nGenerating: ${topic.title}...`);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        {
          role: "system",
          content: "You are a professional laundry and fabric care expert writing for a UK audience. Write engaging, practical, SEO-optimized blog posts that are genuinely helpful. Use a friendly, conversational tone while being authoritative. Include specific UK pricing, brands, and context where relevant. Format content with proper headings using ## for main sections and ### for subsections. Use bullet points and numbered lists to improve readability. Don't include a meta description or title in the content - just the article body starting with an engaging introduction paragraph."
        },
        {
          role: "user",
          content: topic.prompt
        }
      ],
      max_completion_tokens: 2000
    });

    const content = completion.choices[0].message.content || "";
    const readingTime = calculateReadingTime(content);
    const excerpt = createExcerpt(content);

    // Store in Firestore
    const blogPost = {
      title: topic.title,
      slug: topic.slug,
      excerpt: excerpt,
      content: content,
      author: "LaunderetteNear.me Team",
      publishedAt: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      readingTime: readingTime
    };

    await addDoc(collection(db, "blog_posts"), blogPost);
    console.log(`✓ Generated and saved: ${topic.title} (${readingTime} min read)`);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.error(`✗ Error generating ${topic.title}:`, error);
  }
}

async function main() {
  console.log("Starting blog post generation...");
  console.log(`Total posts to generate: ${blogTopics.length}\n`);
  
  for (const topic of blogTopics) {
    await generateBlogPost(topic);
  }
  
  console.log("\n✓ Blog post generation complete!");
  process.exit(0);
}

main();
