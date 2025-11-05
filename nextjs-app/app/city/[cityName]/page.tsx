import Link from "next/link";
import { MapPin, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { UK_REGIONS } from "@/lib/regions";

interface CityPageProps {
  params: {
    cityName: string;
  };
}

// Generate static params for all cities
export async function generateStaticParams() {
  const allCities = Object.values(UK_REGIONS).flat();
  
  return allCities.map((city) => ({
    cityName: encodeURIComponent(city),
  }));
}

// Generate metadata for each city
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const cityName = decodeURIComponent(params.cityName);
  
  return {
    title: `Launderettes in ${cityName} | LaunderetteNear.me`,
    description: `Find launderettes and laundromats in ${cityName}. Compare prices, read reviews, check opening hours, and find the best laundry services near you in ${cityName}.`,
    openGraph: {
      title: `Launderettes in ${cityName} | LaunderetteNear.me`,
      description: `Find launderettes and laundromats in ${cityName}. Compare prices, reviews, and opening hours.`,
      url: `https://launderettenear.me/city/${encodeURIComponent(cityName)}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Launderettes in ${cityName} | LaunderetteNear.me`,
      description: `Find launderettes and laundromats in ${cityName}. Compare prices, reviews, and opening hours.`,
    },
  };
}

export default function CityDetail({ params }: CityPageProps) {
  const cityName = decodeURIComponent(params.cityName);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
              <MapPin className="w-6 h-6" />
              <span className="text-xl font-bold font-heading">LaunderetteNear.me</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/cities">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground"
                  data-testid="button-cities"
                >
                  All Cities
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground"
                  data-testid="button-home"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors" data-testid="link-breadcrumb-home">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/cities" className="hover:text-primary transition-colors" data-testid="link-breadcrumb-cities">
              Cities
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{cityName}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Launderettes in {cityName}
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Find local laundromats with reviews, prices, and opening hours
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Full Data Loading Coming Soon
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                City detail pages with full launderette listings, map view, filters, and reviews will be integrated with Firestore data in the next migration phase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cities">
                  <Button variant="outline" data-testid="button-browse-cities">
                    Browse Other Cities
                  </Button>
                </Link>
                <Link href="/">
                  <Button data-testid="button-return-home">
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">What's Coming</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Complete launderette listings for {cityName}</li>
                <li>• Interactive map with markers</li>
                <li>• User reviews and ratings</li>
                <li>• Opening hours and pricing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">Features</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Filter by services and price</li>
                <li>• Distance calculations</li>
                <li>• Premium listing highlights</li>
                <li>• City-specific FAQ section</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">Migration Status</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✅ Page structure created</li>
                <li>✅ SSG with ISR configured</li>
                <li>✅ SEO metadata optimized</li>
                <li>⏳ Firestore data integration pending</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-bold font-heading text-foreground">LaunderetteNear.me</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your comprehensive UK launderette directory.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-home">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/cities" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-cities">
                    All Cities
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-about">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-privacy">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-terms">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-contact">
                    Get in Touch
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaunderetteNear.me. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Configure ISR with hourly revalidation
export const revalidate = 3600; // Revalidate every hour
