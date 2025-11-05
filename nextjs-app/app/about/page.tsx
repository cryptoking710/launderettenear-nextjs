import Link from "next/link";
import { MapPin, Heart, Users, Shield, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Your Trusted UK Launderette Directory | LaunderetteNear.me",
  description: "Learn about LaunderetteNear.me, the UK's most comprehensive launderette directory. Helping communities find quality laundry services across England, Scotland, Wales and Northern Ireland since 2024.",
  openGraph: {
    title: "About Us - Your Trusted UK Launderette Directory",
    description: "Learn about LaunderetteNear.me, the UK's most comprehensive launderette directory with over 1,057 verified listings across 79 cities.",
    url: "https://launderettenear.me/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Your Trusted UK Launderette Directory",
    description: "Learn about LaunderetteNear.me, the UK's most comprehensive launderette directory with over 1,057 verified listings across 79 cities.",
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-home">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-bold font-heading text-foreground">About Us</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
            Your Trusted UK Launderette Directory
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Helping communities across the United Kingdom find quality laundry services since 2024
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-6">Our Mission</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-4">
              LaunderetteNear.me was created to solve a simple but important problem: finding a reliable launderette shouldn't be difficult. Whether you're a student, busy professional, family, or visitor to the UK, everyone deserves easy access to quality laundry services.
            </p>
            <p className="text-lg leading-relaxed">
              We've built the most comprehensive directory of launderettes across the United Kingdom, covering major cities, towns, and communities from England, Scotland, Wales, and Northern Ireland. Our platform combines modern technology with local knowledge to help you find the perfect laundry service for your needs.
            </p>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-6">Why LaunderetteNear.me?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <MapPin className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold font-heading mb-3">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Over 1,000 verified launderettes across 79 UK cities and towns. From London to Edinburgh, Cardiff to Belfast, we've got you covered.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold font-heading mb-3">Verified Information</h3>
                <p className="text-muted-foreground">
                  Every listing includes verified details: addresses, opening hours, services offered, and genuine customer reviews to help you make informed decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold font-heading mb-3">Community-Driven</h3>
                <p className="text-muted-foreground">
                  Real reviews from real customers. Our platform thrives on honest feedback from the community to help everyone find quality service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold font-heading mb-3">Local Expertise</h3>
                <p className="text-muted-foreground">
                  We understand UK communities. Our directory highlights local favorites, trusted services, and hidden gems in your neighborhood.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-6">What We Offer</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-foreground">Location-Based Search:</strong> Find launderettes near you with our intelligent geolocation technology
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-foreground">Detailed Listings:</strong> Opening hours, services, pricing, contact information, and customer reviews
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-foreground">City Guides:</strong> Dedicated pages for every major UK city with local launderette recommendations
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-foreground">Service Filters:</strong> Search by specific services like dry cleaning, ironing, collection/delivery, or 24-hour access
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-foreground">Mobile-Friendly:</strong> Access our directory anywhere, anytime, from any device
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-6">Our Commitment to Quality</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="text-lg leading-relaxed mb-4">
              We take pride in maintaining accurate, up-to-date information. Our team regularly verifies listings, updates opening hours, and ensures contact details are current. We work directly with launderette owners and managers to provide you with the most reliable information possible.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              Your privacy and trust are paramount. We comply with UK GDPR regulations and handle all user data responsibly. We never sell your information, and we're transparent about how we operate.
            </p>
            <p className="text-lg leading-relaxed">
              LaunderetteNear.me is funded through ethical advertising partnerships. This allows us to keep our directory completely free for users while continuing to improve and expand our coverage across the UK.
            </p>
          </div>
        </section>

        {/* Coverage Stats */}
        <section className="mb-12 bg-primary/5 border border-primary/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold font-heading text-foreground mb-6 text-center">Our UK Coverage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,057+</div>
              <div className="text-sm text-muted-foreground">Verified Launderettes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">79</div>
              <div className="text-sm text-muted-foreground">UK Cities & Towns</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">Full</div>
              <div className="text-sm text-muted-foreground">UK Coverage</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Free to Use</div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have questions, feedback, or want to add your launderette to our directory? We'd love to hear from you.
          </p>
          <Link href="/contact">
            <Button size="lg" data-testid="button-contact">
              Contact Us
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
