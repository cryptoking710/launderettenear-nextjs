import Link from 'next/link';
import { Metadata } from 'next';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllBlogPosts } from '@/lib/firestore';

export const revalidate = 86400; // Revalidate daily

export const metadata: Metadata = {
  title: 'Laundry Tips & Guides | Expert Fabric Care Advice | LaunderetteNear.me',
  description: 'Expert advice on fabric care, stain removal, eco-friendly washing, and everything you need to know about keeping your clothes fresh and clean. Read our comprehensive laundry guides.',
  openGraph: {
    title: 'Laundry Tips & Guides | Expert Fabric Care Advice | LaunderetteNear.me',
    description: 'Expert advice on fabric care, stain removal, eco-friendly washing, and everything you need to know about keeping your clothes fresh and clean.',
    url: 'https://launderettenear.me/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laundry Tips & Guides | Expert Fabric Care Advice | LaunderetteNear.me',
    description: 'Expert advice on fabric care, stain removal, eco-friendly washing, and everything you need to know about keeping your clothes fresh and clean.',
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-heading font-bold text-foreground">
              LaunderetteNear.me Blog
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4" data-testid="heading-blog">
              Laundry Tips & Guides
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert advice on fabric care, stain removal, eco-friendly washing, and everything you need to know about keeping your clothes fresh and clean.
            </p>
          </div>

          {/* Blog Posts Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col hover-elevate" data-testid={`card-blog-${post.slug}`}>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl line-clamp-2" data-testid={`title-${post.slug}`}>
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1" data-testid={`date-${post.slug}`}>
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1" data-testid={`reading-time-${post.slug}`}>
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min read
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-1" data-testid={`excerpt-${post.slug}`}>
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} data-testid={`link-read-${post.slug}`}>
                      <Button variant="outline" className="w-full group" data-testid={`button-read-${post.slug}`}>
                        Read Article
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center p-8 bg-card border border-border rounded-lg">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
              Looking for a Launderette?
            </h2>
            <p className="text-muted-foreground mb-6">
              Find quality laundry services near you with our comprehensive UK directory
            </p>
            <Link href="/" data-testid="link-find-launderette">
              <Button size="lg" data-testid="button-find-launderette">
                Find a Launderette
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                LaunderetteNear.me helps you find quality laundry services across the UK.
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
