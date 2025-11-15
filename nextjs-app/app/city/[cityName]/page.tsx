import Link from "next/link";
import { MapPin, Home, ChevronRight, Star, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import { UK_REGIONS } from "@/lib/regions";
import { getLaunderettesByCity, getAverageRating } from "@/lib/firestore";

interface CityPageProps {
  params: Promise<{
    cityName: string;
  }>;
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
  const { cityName: rawCityName } = await params;
  const cityName = decodeURIComponent(rawCityName);
  
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

export default async function CityDetail({ params }: CityPageProps) {
  const { cityName: rawCityName } = await params;
  const cityName = decodeURIComponent(rawCityName);
  
  // Fetch launderettes for this city
  const launderettes = await getLaunderettesByCity(cityName);
  
  // Fetch ratings for all launderettes
  const launderettesWithRatings = await Promise.all(
    launderettes.map(async (launderette) => {
      const rating = await getAverageRating(launderette.id);
      return {
        ...launderette,
        rating,
      };
    })
  );

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
        {launderettes.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  No Launderettes Found
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We don't have any launderettes listed in {cityName} yet. Check back soon or browse other cities.
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
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                Found {launderettes.length} {launderettes.length === 1 ? 'launderette' : 'launderettes'} in {cityName}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {launderettesWithRatings.map((launderette) => (
                <Link 
                  key={launderette.id} 
                  href={`/launderette/${launderette.id}`}
                  data-testid={`link-launderette-${launderette.id}`}
                >
                  <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg leading-tight" data-testid={`text-name-${launderette.id}`}>{launderette.name}</CardTitle>
                        {launderette.isPremium && (
                          <Badge variant="default" className="flex-shrink-0" data-testid={`badge-premium-${launderette.id}`}>
                            Premium
                          </Badge>
                        )}
                      </div>
                      {launderette.rating.count > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center" data-testid={`rating-stars-${launderette.id}`}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= launderette.rating.average
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-foreground" data-testid={`text-rating-${launderette.id}`}>
                            {launderette.rating.average.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground" data-testid={`text-rating-count-${launderette.id}`}>
                            ({launderette.rating.count})
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-address-${launderette.id}`}>
                            {launderette.address}
                          </p>
                        </div>

                        {launderette.phone && (
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground" data-testid={`text-phone-${launderette.id}`}>
                              {launderette.phone}
                            </p>
                          </div>
                        )}

                        {launderette.email && (
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground truncate" data-testid={`text-email-${launderette.id}`}>
                              {launderette.email}
                            </p>
                          </div>
                        )}

                        {launderette.features && launderette.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {launderette.features.slice(0, 3).map((feature: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-feature-${launderette.id}-${index}`}>
                                {feature}
                              </Badge>
                            ))}
                            {launderette.features.length > 3 && (
                              <Badge variant="outline" className="text-xs" data-testid={`badge-more-features-${launderette.id}`}>
                                +{launderette.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {launderette.priceRange && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-xs" data-testid={`badge-price-${launderette.id}`}>
                              {launderette.priceRange === 'budget' && '£ Budget'}
                              {launderette.priceRange === 'moderate' && '££ Moderate'}
                              {launderette.priceRange === 'premium' && '£££ Premium'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Info Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">Quick Search</h3>
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
