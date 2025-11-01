import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Launderette, UserLocation, CityFaq } from "@shared/schema";
import { calculateDistance } from "@/lib/distance";
import { ListingCard } from "@/components/listing-card";
import { FilterPanel, FilterOptions } from "@/components/filter-panel";
import { MapView } from "@/components/map-view";
import { MapPin, Loader2, List, Map, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect, useMemo } from "react";
import { ResponsiveAd } from "@/components/ad-sense";
import { trackSearch } from "@/lib/analytics";
import { getCityImage } from "@/lib/city-images";

type LaunderetteWithDistance = Launderette & { distance?: number };

export default function CityDetail() {
  const { cityName } = useParams();
  const decodedCityName = decodeURIComponent(cityName || "");
  const [userLocation, setUserLocation] = useState<UserLocation>({ lat: null, lng: null });
  const [filters, setFilters] = useState<FilterOptions>({
    selectedFeatures: [],
    priceRange: null,
    openNow: false,
  });
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  // Fetch all launderettes
  const { data: launderettes = [], isLoading } = useQuery<Launderette[]>({
    queryKey: ["/api/launderettes"],
  });

  // Fetch FAQs for this city
  const { data: cityFaq } = useQuery<CityFaq>({
    queryKey: ["/api/faqs", decodedCityName],
    enabled: !!decodedCityName,
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation failed:", error);
        }
      );
    }
  }, []);

  // Filter launderettes by city
  const cityLaunderettes = useMemo(() => {
    return launderettes.filter(l => 
      l.city?.toLowerCase() === decodedCityName.toLowerCase()
    );
  }, [launderettes, decodedCityName]);

  // Calculate distances
  const launderettesWithDistance = useMemo((): LaunderetteWithDistance[] => {
    if (!userLocation.lat || !userLocation.lng) {
      return cityLaunderettes;
    }
    return cityLaunderettes.map(launderette => ({
      ...launderette,
      distance: calculateDistance(
        userLocation.lat!,
        userLocation.lng!,
        launderette.lat,
        launderette.lng
      ),
    }));
  }, [cityLaunderettes, userLocation]);

  // Apply filters
  const filteredLaunderettes = useMemo(() => {
    let filtered = launderettesWithDistance;

    // Feature filters
    if (filters.selectedFeatures.length > 0) {
      filtered = filtered.filter((launderette) =>
        filters.selectedFeatures.every((feature) =>
          launderette.features.includes(feature)
        )
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (launderette) => launderette.priceRange === filters.priceRange
      );
    }

    // Open now filter
    if (filters.openNow) {
      const now = new Date();
      const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const currentTime = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      filtered = filtered.filter((launderette) => {
        const hours = launderette.openingHours?.[dayOfWeek];
        if (!hours || hours === "Closed") return false;
        
        const [openTime, closeTime] = hours.split(" - ");
        return currentTime >= openTime && currentTime <= closeTime;
      });
    }

    return filtered;
  }, [launderettesWithDistance, filters]);

  // Sort: premium first, then by distance
  const sortedLaunderettes = useMemo(() => {
    return [...filteredLaunderettes].sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });
  }, [filteredLaunderettes]);

  // Get available features from city launderettes
  const availableFeatures = useMemo(() => {
    const features = new Set<string>();
    cityLaunderettes.forEach((launderette) => {
      launderette.features.forEach((feature) => features.add(feature));
    });
    return Array.from(features).sort();
  }, [cityLaunderettes]);

  // Track search analytics
  useEffect(() => {
    if (cityLaunderettes.length > 0 && userLocation.lat && userLocation.lng) {
      trackSearch(decodedCityName, userLocation.lat, userLocation.lng);
    }
  }, [decodedCityName, cityLaunderettes.length, userLocation]);

  // Update page title and meta for SEO
  useEffect(() => {
    if (cityLaunderettes.length > 0) {
      const pageTitle = `Launderettes in ${decodedCityName} | Find ${cityLaunderettes.length}+ ${decodedCityName} Laundromats`;
      document.title = pageTitle;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `Find launderettes in ${decodedCityName}. Browse ${cityLaunderettes.length} local laundromats with prices, reviews, and opening hours. Self-service, service wash, dry cleaning & more.`
        );
      }
    }
  }, [decodedCityName, cityLaunderettes.length]);

  const handleClearFilters = () => {
    setFilters({
      selectedFeatures: [],
      priceRange: null,
      openNow: false,
    });
  };

  // Calculate city center for map
  const cityCenter = useMemo(() => {
    if (cityLaunderettes.length === 0) return null;
    const avgLat = cityLaunderettes.reduce((sum, l) => sum + l.lat, 0) / cityLaunderettes.length;
    const avgLng = cityLaunderettes.reduce((sum, l) => sum + l.lng, 0) / cityLaunderettes.length;
    return { lat: avgLat, lng: avgLng };
  }, [cityLaunderettes]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (cityLaunderettes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                  <MapPin className="w-6 h-6" />
                  <span className="text-xl font-bold font-heading">LaunderetteNear.me</span>
                </div>
              </Link>
              <Link href="/">
                <Button 
                  variant="outline"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground"
                  data-testid="button-back-home"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4 font-heading">
            No Launderettes Found in {decodedCityName}
          </h1>
          <p className="text-muted-foreground mb-6">
            We don't have any listings for this city yet. Check back soon or browse other cities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button data-testid="button-back-home-2">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/cities">
              <Button variant="outline" data-testid="button-browse-cities">
                Browse All Cities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get city-specific hero image
  const cityHeroImage = getCityImage(decodedCityName);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative min-h-[400px] bg-cover bg-center"
        style={{ 
          backgroundImage: cityHeroImage ? `url(${cityHeroImage})` : undefined,
          backgroundColor: cityHeroImage ? undefined : '#1a1a2e'
        }}
        data-testid="city-hero-section"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-16">
          {/* Breadcrumb */}
          <div className="max-w-4xl mx-auto w-full mb-6">
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <Link href="/">
                <span className="hover:text-white cursor-pointer">Home</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/cities">
                <span className="hover:text-white cursor-pointer">Cities</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-semibold">{decodedCityName}</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 font-heading">
              Launderettes in {decodedCityName}
            </h1>
            <p className="text-xl text-white/95 mb-6 font-medium">
              {cityLaunderettes.length} Launderette{cityLaunderettes.length === 1 ? '' : 's'} • Prices, Reviews & Opening Hours
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">{cityLaunderettes.length} Local Launderettes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <MapPin className="w-6 h-6" />
                <span className="text-xl font-bold font-heading">LaunderetteNear.me</span>
              </div>
            </Link>
            <div className="flex gap-2">
              <Link href="/cities">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground"
                  data-testid="button-browse-cities-header"
                >
                  Browse Cities
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

      {/* Ad - Top of content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ResponsiveAd slot="2411734474" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <main>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-heading">
              {sortedLaunderettes.length} {sortedLaunderettes.length === 1 ? 'Result' : 'Results'}
            </h2>

            <FilterPanel
              availableFeatures={availableFeatures}
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            {/* View Toggle */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "map")} className="mb-6">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="list" data-testid="tab-list-view">
                  <List className="w-4 h-4 mr-2" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="map" data-testid="tab-map-view">
                  <Map className="w-4 h-4 mr-2" />
                  Map View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                {sortedLaunderettes.length === 0 ? (
                  <div className="text-center py-12" data-testid="empty-state">
                    <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">No matches found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {sortedLaunderettes.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        distance={listing.distance}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map" className="mt-6">
                <div className="h-[600px]">
                  <MapView
                    launderettes={sortedLaunderettes}
                    userLocation={
                      userLocation.lat && userLocation.lng
                        ? { lat: userLocation.lat, lng: userLocation.lng }
                        : cityCenter
                    }
                  />
                </div>
              </TabsContent>
            </Tabs>
          </main>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <ResponsiveAd slot="5991886839" />
              <ResponsiveAd slot="1240578443" />
            </div>
          </aside>
        </div>
      </div>

      {/* FAQ Section */}
      {cityFaq && cityFaq.questions && cityFaq.questions.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              {cityFaq.questions.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Schema.org FAQPage Markup */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": cityFaq.questions.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.answer
                    }
                  }))
                })
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <ResponsiveAd slot="3365723499" />
      </div>

      <footer className="mt-12 border-t border-border py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            Directory powered by React & Firestore
          </p>
        </div>
      </footer>
    </div>
  );
}
