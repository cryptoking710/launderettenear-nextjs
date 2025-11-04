import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Nearest Launderette | LaunderetteNear.me",
  description: "Search 1,057+ UK launderettes instantly. Service wash, self-service, 24-hour facilities across 79 cities. Reviews, opening hours & prices.",
  alternates: {
    canonical: "https://launderettenear.me",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
            Find Your Nearest Launderette
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Search 1,057+ launderettes across 79 UK cities with comprehensive UK coverage.
          </p>
          <div className="bg-card border border-border rounded-lg p-8 text-left">
            <h2 className="text-2xl font-bold font-heading mb-4">
              Next.js 15 Migration - Week 1
            </h2>
            <p className="text-muted-foreground mb-4">
              ✅ Project setup complete
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Next.js 15 with App Router</li>
              <li>TypeScript configured</li>
              <li>Tailwind CSS with design system</li>
              <li>TanStack Query provider</li>
              <li>Google Fonts (Inter + Manrope)</li>
              <li>AdSense script integration</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
