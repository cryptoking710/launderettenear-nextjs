import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Launderette, UserLocation } from "@shared/schema";
import { calculateDistance } from "@/lib/distance";
import { trackSearch } from "@/lib/analytics";
import { SearchBar } from "@/components/search-bar";
import { ListingCard } from "@/components/listing-card";
import { FilterPanel, FilterOptions } from "@/components/filter-panel";
import { MapView } from "@/components/map-view";
import { MapPin, Loader2, List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import heroImage from "@assets/generated_images/Modern_launderette_interior_scene_2912be0b.png";
import { InFeedAd, BannerAd, ResponsiveAd } from "@/components/ad-sense";
import { WebsiteSchema, ItemListSchema } from "@/components/schema-markup";

export default function Home() {
  const [userLocation, setUserLocation] = useState<UserLocation>({ lat: null, lng: null });
  const [searchLocation, setSearchLocation] = useState<UserLocation>({ lat: null, lng: null });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGeocodedSearch, setIsGeocodedSearch] = useState(false);
  const [isUsingGpsLocation, setIsUsingGpsLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    selectedFeatures: [],
    priceRange: null,
    openNow: false,
  });
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const { toast } = useToast();

  // Fetch launderettes from backend API
  const { data: launderettes = [], isLoading } = useQuery<Launderette[]>({
    queryKey: ["/api/launderettes"],
  });

  // Debug logging
  useEffect(() => {
    if (launderettes.length > 0) {
      const wisbechCount = launderettes.filter(l => l.city === 'Wisbech').length;
      console.log(`📍 Total launderettes loaded: ${launderettes.length}`);
      console.log(`📍 Wisbech launderettes: ${wisbechCount}`);
      if (wisbechCount > 0) {
        console.log(`📍 First Wisbech:`, launderettes.find(l => l.city === 'Wisbech'));
      }
    }
  }, [launderettes]);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          setSearchLocation(coords);
          setIsUsingGpsLocation(true);
        },
        (error) => {
          console.warn("Geolocation failed:", error);
          const fallback = { lat: 54.0, lng: -2.0 };
          setUserLocation(fallback);
          setSearchLocation(fallback);
          setIsUsingGpsLocation(false);
        }
      );
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setIsUsingGpsLocation(false);
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Geocoding failed");
      
      const data = await response.json();
      setSearchLocation({ lat: data.lat, lng: data.lng });
      setIsGeocodedSearch(true);
      
      trackSearch(query, data.lat, data.lng);
      
      toast({
        title: "Location found",
        description: `Showing results near ${data.formattedAddress}`,
      });
    } catch (error) {
      setIsGeocodedSearch(false);
      toast({
        title: "Search failed",
        description: "Could not find that location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseLocation = () => {
    if (userLocation.lat && userLocation.lng) {
      setSearchLocation(userLocation);
      setSearchQuery("");
      setIsGeocodedSearch(false);
      setIsUsingGpsLocation(true);
      toast({
        title: "Using your location",
        description: "Showing nearest launderettes",
      });
    } else {
      toast({
        title: "Location unavailable",
        description: "Please enable location services or search manually",
        variant: "destructive",
      });
    }
  };

  // Get unique features for filter panel
  const availableFeatures = Array.from(
    new Set(launderettes.flatMap((l) => l.features || []))
  ).sort();

  // Helper function to check if a launderette is open now
  const isOpenNow = (launderette: Launderette): boolean => {
    if (!launderette.openingHours) return true; // If no hours specified, assume open
    
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
    
    const hoursToday = launderette.openingHours[dayOfWeek];
    if (!hoursToday || hoursToday.toLowerCase() === 'closed') return false;
    
    // Parse hours like "9:00 AM - 5:00 PM"
    const match = hoursToday.match(/(\d+):(\d+)\s*(AM|PM)\s*-\s*(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return true; // If can't parse, assume open
    
    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = match;
    let start = parseInt(startHour) * 60 + parseInt(startMin);
    let end = parseInt(endHour) * 60 + parseInt(endMin);
    
    if (startPeriod.toUpperCase() === 'PM' && parseInt(startHour) !== 12) start += 12 * 60;
    if (endPeriod.toUpperCase() === 'PM' && parseInt(endHour) !== 12) end += 12 * 60;
    if (startPeriod.toUpperCase() === 'AM' && parseInt(startHour) === 12) start -= 12 * 60;
    if (endPeriod.toUpperCase() === 'AM' && parseInt(endHour) === 12) end -= 12 * 60;
    
    return currentTime >= start && currentTime <= end;
  };

  // Apply filters and calculate distances
  const filteredAndSortedLaunderettes = launderettes
    .filter((l) => {
      // Filter by search query - only apply text matching if NOT a geocoded search
      if (searchQuery && !isGeocodedSearch) {
        const query = searchQuery.toLowerCase();
        const matchesName = l.name?.toLowerCase().includes(query);
        const matchesCity = l.city?.toLowerCase().includes(query);
        
        // Only match on name or city (not address to avoid false positives like "Wisbech Road" in March)
        if (!matchesName && !matchesCity) {
          return false;
        }
      }

      // Filter by selected features
      if (filters.selectedFeatures.length > 0) {
        const hasAllFeatures = filters.selectedFeatures.every((feature) =>
          l.features?.includes(feature)
        );
        if (!hasAllFeatures) return false;
      }

      // Filter by price range
      if (filters.priceRange && l.priceRange !== filters.priceRange) {
        return false;
      }

      // Filter by open now
      if (filters.openNow && !isOpenNow(l)) {
        return false;
      }

      return true;
    })
    .map((l) => {
      if (searchLocation.lat && searchLocation.lng) {
        return {
          ...l,
          distance: calculateDistance(
            searchLocation.lat,
            searchLocation.lng,
            l.lat,
            l.lng
          ),
        };
      }
      return { ...l, distance: undefined };
    })
    .sort((a, b) => {
      if (a.isPremium !== b.isPremium) {
        return a.isPremium ? -1 : 1;
      }
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

  // Debug filtered results
  useEffect(() => {
    if (launderettes.length > 0) {
      const wisbechFiltered = filteredAndSortedLaunderettes.filter(l => l.city === 'Wisbech');
      console.log(`🔍 Search query: "${searchQuery}"`);
      console.log(`🔍 Filtered results: ${filteredAndSortedLaunderettes.length} total (Wisbech: ${wisbechFiltered.length})`);
      console.log(`🔍 Active filters:`, filters);
      console.log(`🔍 Search location:`, searchLocation);
      if (wisbechFiltered.length > 0) {
        console.log(`🔍 First filtered Wisbech with distance:`, wisbechFiltered[0]);
      }
    }
  }, [filteredAndSortedLaunderettes, filters, searchLocation, searchQuery, launderettes.length]);

  const handleClearFilters = () => {
    setFilters({
      selectedFeatures: [],
      priceRange: null,
      openNow: false,
    });
  };

  // Calculate unique cities count
  const uniqueCities = new Set(launderettes.map(l => l.city)).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org Structured Data for SEO */}
      <WebsiteSchema totalLaunderettes={launderettes.length} totalCities={uniqueCities} />
      <ItemListSchema launderettes={filteredAndSortedLaunderettes} />
      
      {/* Hero Section with Integrated Search */}
      <div 
        className="relative min-h-[500px] md:min-h-[600px] bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        data-testid="hero-section"
      >
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 pointer-events-none"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 font-heading">
              Launderette Near Me | UK Laundrette Directory
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 font-medium">
              Find Your Nearest Launderette in Seconds - 792+ UK Launderettes
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white/90 text-sm md:text-base mb-12">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md" data-testid="text-total-launderettes">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold">{launderettes.length} Launderettes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md" data-testid="text-total-cities">
                <span className="font-semibold">{uniqueCities} UK Cities</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md" data-testid="text-total-nations">
                <span className="font-semibold">All 4 Nations</span>
              </div>
            </div>
            
            {/* Search Bar in Hero */}
            <div className="max-w-2xl mx-auto relative z-20">
              <SearchBar 
                onSearch={handleSearch}
                isLoading={isSearching}
                onUseLocation={handleUseLocation}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simplified Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              <span className="text-xl font-bold font-heading">LaunderetteNear.me</span>
            </div>
            
            <Link href="/admin">
              <Button 
                variant="outline" 
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground"
                data-testid="link-admin"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Banner Ad - Above the fold */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <BannerAd slot="9763433271" className="mb-6" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <main>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-heading">
              Launderettes Near You ({filteredAndSortedLaunderettes.length} {filteredAndSortedLaunderettes.length === 1 ? 'Result' : 'Results'})
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredAndSortedLaunderettes.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-state">
                <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No launderettes found</h3>
                <p className="text-muted-foreground">
                  {launderettes.length === 0
                    ? "Try searching in a different area or check back later"
                    : "Try adjusting your filters or search criteria"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredAndSortedLaunderettes.map((listing, index) => (
                  <div key={listing.id}>
                    <ListingCard
                      listing={listing}
                      distance={listing.distance}
                    />
                    {(index + 1) % 3 === 0 && index < filteredAndSortedLaunderettes.length - 1 && (
                      <InFeedAd slot="6982191410" className="my-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
              </TabsContent>

              <TabsContent value="map" className="mt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[600px]">
                    <MapView
                      launderettes={filteredAndSortedLaunderettes}
                      userLocation={
                        isUsingGpsLocation && userLocation.lat && userLocation.lng
                          ? { lat: userLocation.lat, lng: userLocation.lng }
                          : null
                      }
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <ResponsiveAd slot="8977142822" />
              <ResponsiveAd slot="6454921261" />
            </div>
          </aside>
        </div>
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
