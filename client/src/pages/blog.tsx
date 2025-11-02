import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Home, Clock, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";
import { Footer } from "@/components/footer";

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

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
          <div className="flex items-center justify-between">
            <Link href="/" data-testid="link-home">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-heading font-bold text-foreground">
              LaunderetteNear.me Blog
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              Laundry Tips & Guides
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expert advice on fabric care, stain removal, eco-friendly washing, and everything you need to know about keeping your clothes fresh and clean.
            </p>
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-10 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col hover-elevate" data-testid={`card-blog-${post.slug}`}>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min read
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`}>
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
            <Link href="/">
              <Button size="lg" data-testid="button-find-launderette">
                Find a Launderette
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
