import { Link } from "wouter";
import { Home, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSubmissionSchema, type InsertContactSubmission } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const { toast } = useToast();
  
  const form = useForm<InsertContactSubmission>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const submitMutation = useMutation({
    mutationFn: (data: InsertContactSubmission) => 
      apiRequest("/api/contact", "POST", data),
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond within 1-2 business days.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or email us directly.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: InsertContactSubmission) => {
    submitMutation.mutate(data);
  };

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

      {/* Main Content */}
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="John Smith" 
                                data-testid="input-name"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="john@example.com" 
                                data-testid="input-email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="What is your inquiry about?" 
                              data-testid="input-subject"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us how we can help..."
                              rows={6}
                              data-testid="input-message"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={submitMutation.isPending}
                      data-testid="button-submit"
                      className="w-full md:w-auto"
                    >
                      {submitMutation.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
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
    </div>
  );
}
