"use client";

import Link from "next/link";
import { MapPin, Search, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { UK_REGIONS } from "@/lib/regions";

// Mock data - will be replaced with real Firestore data
const MOCK_CITY_COUNTS: Record<string, number> = {
  "London": 85,
  "Manchester": 42,
  "Birmingham": 38,
  "Glasgow": 32,
  "Edinburgh": 28,
  "Liverpool": 24,
  "Bristol": 22,
  "Leeds": 20,
  "Cardiff": 18,
  "Brighton": 16,
  // Add more as needed...
};

export default function Cities() {
  const [searchTerm, setSearchTerm] = useState("");

  // Get all cities from regions
  const allCities = useMemo(() => {
    return Object.values(UK_REGIONS).flat().sort();
  }, []);

  // Filter cities by search term
  const filteredCities = useMemo(() => {
    if (!searchTerm.trim()) return allCities;
    const term = searchTerm.toLowerCase();
    return allCities.filter(city => 
      city.toLowerCase().includes(term)
    );
  }, [allCities, searchTerm]);

  // Group cities by region
  const citiesByRegion = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    
    Object.entries(UK_REGIONS).forEach(([region, cities]) => {
      const matchingCities = filteredCities.filter(city => 
        cities.some(regionCity => 
          regionCity.toLowerCase() === city.toLowerCase()
        )
      );
      if (matchingCities.length > 0) {
        grouped[region] = matchingCities;
      }
    });

    return grouped;
  }, [filteredCities]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-[300px] bg-primary">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary"></div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary-foreground mb-4 font-heading">
              Browse Launderettes by City
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-6 font-medium">
              {allCities.length} UK Cities • Comprehensive UK Coverage
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
              <MapPin className="w-6 h-6" />
              <span className="text-xl font-bold font-heading">LaunderetteNear.me</span>
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
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for a city..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-cities"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
            </p>
          )}
        </div>

        {filteredCities.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No cities found</h3>
            <p className="text-muted-foreground">Try adjusting your search term</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(citiesByRegion).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-2xl font-bold font-heading text-foreground mb-6 pb-2 border-b border-border">
                  {region}
                  <Badge variant="secondary" className="ml-3">
                    {cities.length} {cities.length === 1 ? 'city' : 'cities'}
                  </Badge>
                </h2>
                
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {cities.map((city) => (
                    <Link key={city} href={`/city/${encodeURIComponent(city)}`} data-testid={`link-city-${city.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all h-full">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="font-medium text-foreground truncate">{city}</span>
                            </div>
                            {MOCK_CITY_COUNTS[city] && (
                              <Badge variant="outline" className="ml-2 flex-shrink-0">
                                {MOCK_CITY_COUNTS[city]}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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
              <h3 className="font-semibold text-foreground mb-4">Coverage</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive UK coverage including England, Scotland, Wales, and Northern Ireland
              </p>
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
