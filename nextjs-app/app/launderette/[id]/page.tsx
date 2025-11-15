import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Mail, Globe, Clock, Star, ChevronRight, Home } from 'lucide-react';
import { getLaunderetteById, getReviewsForLaunderette, getAverageRating } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResponsiveAd } from '@/components/adsense';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const launderette = await getLaunderetteById(id);

  if (!launderette) {
    return {
      title: 'Launderette Not Found',
    };
  }

  const description = launderette.description 
    ? launderette.description.substring(0, 155) 
    : `Find ${launderette.name} in ${launderette.city || 'the UK'}. View opening hours, services, reviews, and contact information for this launderette.`;

  return {
    title: `${launderette.name} - ${launderette.city || 'UK'} | LaunderetteNear.me`,
    description,
    openGraph: {
      title: `${launderette.name} - ${launderette.city || 'UK'}`,
      description,
      url: `https://launderettenear.me/launderette/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${launderette.name} - ${launderette.city || 'UK'}`,
      description,
    },
  };
}

export default async function LaunderettePage({ params }: PageProps) {
  const { id } = await params;
  const [launderette, reviews, ratingData] = await Promise.all([
    getLaunderetteById(id),
    getReviewsForLaunderette(id),
    getAverageRating(id),
  ]);

  if (!launderette) {
    notFound();
  }

  const priceRangeLabels = {
    budget: '£ - Budget Friendly',
    moderate: '££ - Moderate',
    premium: '£££ - Premium',
  };

  const openingHoursOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

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
              {launderette.city && (
                <Link href={`/city/${encodeURIComponent(launderette.city)}`}>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground/20 text-primary-foreground"
                    data-testid="button-city"
                  >
                    {launderette.city}
                  </Button>
                </Link>
              )}
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
            {launderette.city && (
              <>
                <Link href={`/city/${encodeURIComponent(launderette.city)}`} className="hover:text-primary transition-colors" data-testid="link-breadcrumb-city">
                  {launderette.city}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-foreground font-medium">{launderette.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Name & Rating */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground" data-testid="text-launderette-name">
                  {launderette.name}
                </h1>
                {launderette.isPremium && (
                  <Badge variant="default" className="flex-shrink-0" data-testid="badge-premium">
                    Premium
                  </Badge>
                )}
              </div>
              
              {ratingData.count > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center" data-testid="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= ratingData.average
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-foreground" data-testid="text-rating-average">
                    {ratingData.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground" data-testid="text-rating-count">
                    ({ratingData.count} {ratingData.count === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {launderette.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-line">{launderette.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Ad Unit 1 */}
            <ResponsiveAd slot="2411734474" className="my-6" />

            {/* Features */}
            {launderette.features && launderette.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {launderette.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" data-testid={`badge-feature-${index}`}>
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ad Unit 2 */}
            <ResponsiveAd slot="5991886839" className="my-6" />

            {/* Opening Hours */}
            {launderette.openingHours && Object.keys(launderette.openingHours).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Opening Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {openingHoursOrder.map((day) => {
                      const hours = launderette.openingHours?.[day];
                      if (!hours) return null;
                      
                      return (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{day}</span>
                          <span className="text-muted-foreground">{hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ad Unit 3 */}
            <ResponsiveAd slot="1240578443" className="my-6" />

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{review.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star: number) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-foreground">{review.comment}</p>
                        {review !== reviews[reviews.length - 1] && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ad Unit 4 */}
            <ResponsiveAd slot="3365723499" className="my-6" />
          </div>

          {/* Right Column - Contact & Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-foreground break-words" data-testid="text-address">{launderette.address}</p>
                    {launderette.city && (
                      <p className="text-foreground" data-testid="text-city">{launderette.city}</p>
                    )}
                  </div>
                </div>

                {launderette.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <a 
                        href={`tel:${launderette.phone}`} 
                        className="text-primary hover:underline break-words"
                        data-testid="link-phone"
                      >
                        {launderette.phone}
                      </a>
                    </div>
                  </div>
                )}

                {launderette.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <a 
                        href={`mailto:${launderette.email}`} 
                        className="text-primary hover:underline break-words"
                        data-testid="link-email"
                      >
                        {launderette.email}
                      </a>
                    </div>
                  </div>
                )}

                {launderette.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">Website</p>
                      <a 
                        href={launderette.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline break-words"
                        data-testid="link-website"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Range */}
            {launderette.priceRange && (
              <Card>
                <CardHeader>
                  <CardTitle>Price Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-base" data-testid="badge-price-range">
                    {priceRangeLabels[launderette.priceRange as keyof typeof priceRangeLabels]}
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Location Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md h-48 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    Map integration coming soon
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Coordinates: {launderette.lat.toFixed(6)}, {launderette.lng.toFixed(6)}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      {/* Schema.org LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: launderette.name,
            description: launderette.description || `${launderette.name} - Launderette in ${launderette.city || 'the UK'}`,
            address: {
              '@type': 'PostalAddress',
              streetAddress: launderette.address,
              addressLocality: launderette.city,
              addressCountry: 'GB',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: launderette.lat,
              longitude: launderette.lng,
            },
            ...(launderette.phone && { telephone: launderette.phone }),
            ...(launderette.email && { email: launderette.email }),
            ...(launderette.website && { url: launderette.website }),
            ...(launderette.openingHours && Object.keys(launderette.openingHours).length > 0 && {
              openingHoursSpecification: Object.entries(launderette.openingHours).map(([day, hours]: [string, any]) => ({
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: day,
                opens: hours.split('-')[0]?.trim() || '',
                closes: hours.split('-')[1]?.trim() || '',
              })),
            }),
            ...(ratingData.count > 0 && {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: ratingData.average,
                reviewCount: ratingData.count,
                bestRating: 5,
                worstRating: 1,
              },
            }),
            ...(reviews.length > 0 && {
              review: reviews.map((review: any) => ({
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: review.userName,
                },
                datePublished: new Date(review.createdAt).toISOString(),
                reviewBody: review.comment,
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: review.rating,
                  bestRating: 5,
                  worstRating: 1,
                },
              })),
            }),
            ...(launderette.priceRange && {
              priceRange: launderette.priceRange === 'budget' ? '£' : launderette.priceRange === 'moderate' ? '££' : '£££',
            }),
          }),
        }}
      />
    </div>
  );
}
