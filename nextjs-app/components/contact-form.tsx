"use client";

import Link from "next/link";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: "success" | "error", message: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you for contacting us. We'll respond within 1-2 business days."
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again or email us directly."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Contact Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 1-2 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder="What is your inquiry about?"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="input-subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    data-testid="input-message"
                  />
                </div>

                {submitStatus && (
                  <div className={`p-4 rounded-md ${
                    submitStatus.type === "success" 
                      ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-100"
                      : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-100"
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  data-testid="button-submit"
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Common Inquiries */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold font-heading mb-4">Common Inquiries</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-2">Add Your Launderette</h4>
                  <p className="text-sm text-muted-foreground">
                    If you own or manage a launderette and want to be listed in our directory, please contact us with your business details.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-2">Update Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Need to update opening hours, contact details, or services? Send us the corrected information.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-2">Report an Issue</h4>
                  <p className="text-sm text-muted-foreground">
                    Found incorrect information or experiencing technical issues? Let us know and we'll fix it promptly.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-foreground mb-2">Partnership Opportunities</h4>
                  <p className="text-sm text-muted-foreground">
                    Interested in advertising or partnering with LaunderetteNear.me? We'd love to discuss opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Contact Information Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">General Inquiries:</p>
              <a 
                href="mailto:info@launderettenear.me" 
                className="text-primary hover:underline font-medium"
                data-testid="link-email-general"
              >
                info@launderettenear.me
              </a>
              
              <p className="text-sm text-muted-foreground mt-4 mb-2">Business Listings:</p>
              <a 
                href="mailto:listings@launderettenear.me" 
                className="text-primary hover:underline font-medium"
                data-testid="link-email-listings"
              >
                listings@launderettenear.me
              </a>

              <p className="text-sm text-muted-foreground mt-4 mb-2">Privacy Requests:</p>
              <a 
                href="mailto:privacy@launderettenear.me" 
                className="text-primary hover:underline font-medium"
                data-testid="link-email-privacy"
              >
                privacy@launderettenear.me
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Business Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                LaunderetteNear.me<br />
                UK Laundry Directory Services<br />
                United Kingdom
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                * For correspondence only. We are an online directory service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We typically respond to all inquiries within 1-2 business days.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                <strong className="text-foreground">Business Hours:</strong><br />
                Monday - Friday: 9:00 AM - 5:00 PM GMT
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <Link href="/about" className="text-primary hover:underline" data-testid="link-about">
                    About Us →
                  </Link>
                </div>
                <div>
                  <Link href="/privacy" className="text-primary hover:underline" data-testid="link-privacy">
                    Privacy Policy →
                  </Link>
                </div>
                <div>
                  <Link href="/terms" className="text-primary hover:underline" data-testid="link-terms">
                    Terms of Service →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
