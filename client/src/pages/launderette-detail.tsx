import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Launderette, Review } from "@shared/schema";
import { ReviewList, ReviewForm, StarRating, calculateAverageRating } from "@/components/reviews";
import { CorrectionForm } from "@/components/correction-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Clock, Zap, Loader2 } from "lucide-react";
import { calculateDistance } from "@/lib/distance";
import { trackView } from "@/lib/analytics";
import { useState, useEffect } from "react";
import { ResponsiveAd } from "@/components/ad-sense";
import { SchemaMarkup } from "@/components/schema-markup";

export default function LaunderetteDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch launderette details
  const { data: launderette, isLoading: isLoadingLaunderette } = useQuery<Launderette>({
    queryKey: ["/api/launderettes", id],
    queryFn: async () => {
      const response = await fetch(`/api/launderettes/${id}`);
      if (!response.ok) throw new Error("Failed to fetch launderette");
      return response.json();
    },
    enabled: !!id,
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["/api/launderettes", id, "reviews"],
    queryFn: async () => {
      const response = await fetch(`/api/launderettes/${id}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: !!id,
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation(null);
        }
      );
    }
  }, []);

  // Track page view and update page title for SEO
  useEffect(() => {
    if (launderette) {
      trackView(launderette.id, launderette.name);
      
      // Update document title for SEO
      const pageTitle = `${launderette.name} - Launderette in ${launderette.city} | LaunderetteNear.me`;
      document.title = pageTitle;
      
      // Calculate average rating for meta description
      const avgRating = calculateAverageRating(reviews);
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `${launderette.name} in ${launderette.city}. ${launderette.features.slice(0, 3).join(', ')}. ` +
          `${avgRating > 0 ? `${avgRating.toFixed(1)} star rating from ${reviews.length} reviews. ` : ''}` +
          `Opening hours, contact details & directions.`
        );
      }
    }
    
    return () => {
      // Reset title and meta description when leaving page
      document.title = "Launderette Near Me | Find 1,057+ UK Launderettes & Laundrettes | LaunderetteNear.me";
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          "Find your nearest launderette in seconds. Search 1,057+ launderettes across 104 UK cities. Service wash, 24 hour, self-service & more. Real reviews, opening hours & prices."
        );
      }
    };
  }, [launderette, reviews]);

  if (isLoadingLaunderette) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loading-detail" />
      </div>
    );
  }

  if (!launderette) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Launderette Not Found</h1>
          <Link href="/">
            <Button data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = calculateAverageRating(reviews);
  const distance = userLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, launderette.lat, launderette.lng)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org Structured Data for Local Business SEO */}
      <SchemaMarkup 
        launderette={launderette} 
        averageRating={averageRating} 
        reviewCount={reviews.length} 
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
          {/* Main Info Card */}
          <Card className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-extrabold font-heading" data-testid="text-name">
                    {launderette.name}
                  </h1>
                  {launderette.isPremium && (
                    <Badge variant="default" className="gap-1">
                      <Zap className="w-3 h-3 fill-current" />
                      Premium
                    </Badge>
                  )}
                </div>
                {averageRating > 0 && (
                  <div className="mb-3">
                    <StarRating rating={averageRating} count={reviews.length} />
                  </div>
                )}
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span data-testid="text-address">{launderette.address}</span>
                </div>
              </div>
              {distance !== null && (
                <div className="text-right">
                  <div className="text-4xl font-extrabold text-primary" data-testid="text-distance">
                    {distance.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">miles away</div>
                </div>
              )}
            </div>

            {launderette.description && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="text-lg font-semibold mb-3">About</h2>
                  <p className="text-foreground leading-relaxed" data-testid="text-description">
                    {launderette.description}
                  </p>
                </div>
              </>
            )}

            {/* Contact Info */}
            {(launderette.phone || launderette.email || launderette.website) && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    {launderette.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <a
                          href={`tel:${launderette.phone}`}
                          className="text-primary hover:underline"
                          data-testid="link-phone"
                        >
                          {launderette.phone}
                        </a>
                      </div>
                    )}
                    {launderette.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <a
                          href={`mailto:${launderette.email}`}
                          className="text-primary hover:underline"
                          data-testid="link-email"
                        >
                          {launderette.email}
                        </a>
                      </div>
                    )}
                    {launderette.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <a
                          href={launderette.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          data-testid="link-website"
                        >
                          {launderette.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Opening Hours */}
            {launderette.openingHours && Object.keys(launderette.openingHours).length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Opening Hours
                  </h2>
                  <div className="grid gap-2">
                    {Object.entries(launderette.openingHours).map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between text-sm"
                        data-testid={`hours-${day.toLowerCase()}`}
                      >
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-muted-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Features & Price Range */}
            {(launderette.features.length > 0 || launderette.priceRange) && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  {launderette.features.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-3">Features & Amenities</h2>
                      <div className="flex flex-wrap gap-2">
                        {launderette.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" data-testid={`badge-feature-${index}`}>
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {launderette.priceRange && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Price Range</h2>
                      <Badge variant="outline" data-testid="badge-price-range">
                        {launderette.priceRange.charAt(0).toUpperCase() + launderette.priceRange.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>

          {/* Ad Block - Above the fold */}
          <ResponsiveAd slot="2411734474" />

          {/* Correction Form */}
          <div>
            <CorrectionForm launderette={launderette} />
          </div>

          {/* Photos */}
          {launderette.photoUrls && launderette.photoUrls.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {launderette.photoUrls.map((url, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden bg-muted"
                    data-testid={`photo-${index}`}
                  >
                    <img
                      src={url}
                      alt={`${launderette.name} launderette in ${launderette.city} - Interior photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Ad Block - Before reviews (high engagement) */}
          <ResponsiveAd slot="5991886839" />

          {/* Reviews Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-heading">Reviews</h2>
            
            <ReviewForm launderetteId={id!} />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">
                All Reviews ({reviews.length})
              </h3>
              <ReviewList launderetteId={id!} />
            </div>
          </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <ResponsiveAd slot="1240578443" />
              <ResponsiveAd slot="3365723499" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
