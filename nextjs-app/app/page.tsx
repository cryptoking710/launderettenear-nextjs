import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Nearby Launderettes | LaunderetteNear.me - UK Laundry Directory",
  description: "Find nearby launderettes and laundromats across the UK. Search 1,057+ listings in 79 cities with reviews, prices, opening hours, and services. Locate self-service and full-service laundries near you.",
  openGraph: {
    title: "Find Nearby Launderettes | LaunderetteNear.me",
    description: "Search 1,057+ UK launderettes across 79 cities. Find reviews, prices, and opening hours for laundromats near you.",
    url: "https://launderettenear.me",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Nearby Launderettes | LaunderetteNear.me",
    description: "Search 1,057+ UK launderettes across 79 cities. Find reviews, prices, and opening hours.",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold font-heading text-foreground">LaunderetteNear.me</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link href="/cities">
                <Button variant="ghost" size="sm" data-testid="link-cities">
                  Browse Cities
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="sm" data-testid="link-about">
                  About
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 font-heading">
              Find Nearby Launderettes
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              Search 1,057+ launderettes across 79 UK cities. Find reviews, prices, and opening hours.
            </p>
            
            {/* Search CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/cities">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto" data-testid="button-browse-cities">
                  <MapPin className="mr-2 h-5 w-5" />
                  Browse by City
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
            Why Choose LaunderetteNear.me?
          </h2>
          <p className="text-lg text-muted-foreground">
            Your comprehensive guide to laundry services across the UK
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Find Nearby</CardTitle>
              <CardDescription>
                Discover launderettes close to your location with accurate distance calculations and directions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Read Reviews</CardTitle>
              <CardDescription>
                Check genuine customer reviews and ratings to find the best launderettes in your area.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Check Hours</CardTitle>
              <CardDescription>
                View opening hours, services offered, and pricing information before you visit.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Coverage Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
              Comprehensive UK Coverage
            </h2>
            <p className="text-lg text-muted-foreground">
              Serving communities across England, Scotland, Wales, and Northern Ireland
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1,057+</div>
                <div className="text-sm text-muted-foreground">Launderettes Listed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">79</div>
                <div className="text-sm text-muted-foreground">UK Cities</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Free to Use</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Always Available</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Popular Cities Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-4">
            Popular Cities
          </h2>
          <p className="text-lg text-muted-foreground">
            Browse launderettes in major UK cities
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {["London", "Manchester", "Birmingham", "Glasgow", "Edinburgh", "Liverpool", "Bristol", "Leeds", "Cardiff", "Newcastle upon Tyne", "Belfast", "Brighton"].map((city) => (
            <Link key={city} href={`/city/${encodeURIComponent(city)}`} data-testid={`link-city-${city.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{city}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/cities">
            <Button size="lg" variant="outline" data-testid="button-view-all-cities">
              View All 79 Cities
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Ready to Find Your Local Launderette?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Browse our comprehensive directory and find the perfect laundry service for your needs.
          </p>
          <Link href="/cities">
            <Button size="lg" variant="secondary" data-testid="button-get-started">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-bold font-heading text-foreground">LaunderetteNear.me</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your comprehensive UK launderette directory. Find, compare, and review laundry services near you.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/cities" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-cities">
                    Browse Cities
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/laundry-symbols" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-laundry-symbols">
                    Laundry Symbols Guide
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
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LaunderetteNear.me. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
