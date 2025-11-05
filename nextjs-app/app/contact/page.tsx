import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Get In Touch | LaunderetteNear.me",
  description: "Get in touch with LaunderetteNear.me. Submit questions, feedback, or business inquiries. We typically respond within 1-2 business days.",
  openGraph: {
    title: "Contact Us - LaunderetteNear.me",
    description: "Get in touch with LaunderetteNear.me. Submit questions, feedback, or business inquiries.",
    url: "https://launderettenear.me/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - LaunderetteNear.me",
    description: "Get in touch with LaunderetteNear.me. Submit questions, feedback, or business inquiries.",
  },
};

export default function Contact() {
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
            <h1 className="text-xl font-bold font-heading text-foreground">Contact Us</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-primary-foreground/90">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Form - Client Component */}
      <ContactForm />
    </div>
  );
}
