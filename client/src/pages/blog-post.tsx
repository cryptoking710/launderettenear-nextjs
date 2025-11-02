import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Home, Clock, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";
import { Footer } from "@/components/footer";
import { Adsense } from "@ctrl/react-adsense";
import { useEffect } from "react";
import { marked } from "marked";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${slug}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
    enabled: !!slug,
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Configure marked for proper HTML output
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  const formatContent = (content: string) => {
    // Use marked to convert Markdown to HTML with proper list wrapping
    const html = marked.parse(content) as string;
    
    // Add Tailwind classes to the generated HTML elements
    return html
      .replace(/<h2>/g, '<h2 class="text-2xl font-heading font-bold text-foreground mt-10 mb-5">')
      .replace(/<h3>/g, '<h3 class="text-xl font-heading font-semibold text-foreground mt-8 mb-4">')
      .replace(/<p>/g, '<p class="text-foreground leading-relaxed mb-4">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2">')
      .replace(/<li>/g, '<li class="text-foreground ml-6">');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>Return to Blog</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const publishedDate = new Date(post.publishedAt).toISOString();
  const currentUrl = `https://launderettenear.me/blog/${post.slug}`;

  // Update document title and meta tags for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | LaunderetteNear.me Blog`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      }
    }

    return () => {
      document.title = "Launderette Near Me | Find 1,057+ UK Launderettes & Laundrettes | LaunderetteNear.me";
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', "Find quality launderettes and laundromats near you across the UK. Search by location, view opening hours, prices, services, and user reviews.");
      }
    };
  }, [post]);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Schema.org Article Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "author": {
            "@type": "Organization",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "LaunderetteNear.me",
            "url": "https://launderettenear.me"
          },
          "datePublished": publishedDate,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": currentUrl
          }
        })}
      </script>

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/blog" data-testid="link-back-blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <Link href="/" data-testid="link-home">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4" data-testid="text-post-title">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
              <span>By {post.author}</span>
            </div>
          </header>

          {/* AdSense Ad Unit 1 - Top */}
          <div className="my-8">
            <Adsense
              client="ca-pub-9361445858164574"
              slot="2411734474"
              style={{ display: 'block' }}
              format="auto"
              responsive="true"
            />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            data-testid="content-article"
          />

          {/* AdSense Ad Unit 2 - Middle */}
          <div className="my-8">
            <Adsense
              client="ca-pub-9361445858164574"
              slot="5991886839"
              style={{ display: 'block' }}
              format="auto"
              responsive="true"
            />
          </div>

          {/* Share/CTA Section */}
          <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
              Need a Launderette?
            </h3>
            <p className="text-muted-foreground mb-4">
              Find quality laundry services near you with our comprehensive UK directory
            </p>
            <Link href="/">
              <Button data-testid="button-find-launderette">
                Find a Launderette Near You
              </Button>
            </Link>
          </div>

          {/* AdSense Ad Unit 3 - Bottom */}
          <div className="my-8">
            <Adsense
              client="ca-pub-9361445858164574"
              slot="1240578443"
              style={{ display: 'block' }}
              format="auto"
              responsive="true"
            />
          </div>

          {/* Related Posts CTA */}
          <div className="mt-8 text-center">
            <Link href="/blog">
              <Button variant="outline" data-testid="button-more-articles">
                Read More Articles
              </Button>
            </Link>
          </div>

          {/* AdSense Ad Unit 4 - Final */}
          <div className="my-8">
            <Adsense
              client="ca-pub-9361445858164574"
              slot="3365723499"
              style={{ display: 'block' }}
              format="auto"
              responsive="true"
            />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
