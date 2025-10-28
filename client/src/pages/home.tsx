import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Launderette, UserLocation } from "@shared/schema";
import { calculateDistance } from "@/lib/distance";
import { SearchBar } from "@/components/search-bar";
import { ListingCard } from "@/components/listing-card";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [userLocation, setUserLocation] = useState<UserLocation>({ lat: null, lng: null });
  const [searchLocation, setSearchLocation] = useState<UserLocation>({ lat: null, lng: null });
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Fetch launderettes from backend API
  const { data: launderettes = [], isLoading } = useQuery<Launderette[]>({
    queryKey: ["/api/launderettes"],
  });

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
        },
        (error) => {
          console.warn("Geolocation failed:", error);
          const fallback = { lat: 54.0, lng: -2.0 };
          setUserLocation(fallback);
          setSearchLocation(fallback);
        }
      );
    }
  }, []);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Geocoding failed");
      
      const data = await response.json();
      setSearchLocation({ lat: data.lat, lng: data.lng });
      
      toast({
        title: "Location found",
        description: `Showing results near ${data.formattedAddress}`,
      });
    } catch (error) {
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

  // Calculate distances and sort
  const sortedLaunderettes = launderettes
    .map(l => {
      if (searchLocation.lat && searchLocation.lng) {
        return {
          ...l,
          distance: calculateDistance(
            searchLocation.lat,
            searchLocation.lng,
            l.lat,
            l.lng
          )
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading flex items-center gap-2">
              <MapPin className="w-7 h-7 md:w-8 md:h-8" />
              <span>LaunderetteNear.me</span>
            </h1>
            
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
          
          <p className="text-primary-foreground/90 text-center mb-6 hidden sm:block text-base leading-relaxed">
            Find the closest UK launderettes with real-time features and reviews
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            isLoading={isSearching}
            onUseLocation={handleUseLocation}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 font-heading">
          Launderettes Near You ({sortedLaunderettes.length} {sortedLaunderettes.length === 1 ? 'Result' : 'Results'})
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sortedLaunderettes.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No launderettes found</h3>
            <p className="text-muted-foreground">
              Try searching in a different area or check back later
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
      </main>

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
