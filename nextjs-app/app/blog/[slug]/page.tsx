import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/firestore';
import { marked } from 'marked';

export const revalidate = 86400; // Revalidate daily

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found | LaunderetteNear.me',
    };
  }

  return {
    title: `${post.title} | LaunderetteNear.me Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | LaunderetteNear.me Blog`,
      description: post.excerpt,
      url: `https://launderettenear.me/blog/${post.slug}`,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | LaunderetteNear.me Blog`,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const contentHtml = await marked(post.content);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/blog" data-testid="link-back-blog">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-blog-header">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <h1 className="text-lg font-heading font-bold text-foreground">
              LaunderetteNear.me Blog
            </h1>
            <Link href="/" data-testid="link-home">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-home-header">
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4" data-testid="text-blog-title">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <span className="flex items-center gap-2" data-testid="text-author">
                {post.author}
              </span>
              <span className="flex items-center gap-2" data-testid="text-published-date">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-2" data-testid="text-reading-time">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
            </div>

            <p className="text-lg text-muted-foreground" data-testid="text-excerpt">
              {post.excerpt}
            </p>
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg prose-slate dark:prose-invert max-w-none"
            data-testid="content-article"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Call to Action */}
          <div className="mt-12 p-8 bg-card border border-border rounded-lg text-center">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
              Need Laundry Services?
            </h2>
            <p className="text-muted-foreground mb-6">
              Find quality launderettes near you with our comprehensive UK directory
            </p>
            <Link href="/" data-testid="link-find-launderette">
              <Button size="lg" data-testid="button-find-launderette">
                Find a Launderette
              </Button>
            </Link>
          </div>

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Link href="/blog" data-testid="link-back-all-articles">
              <Button variant="outline" data-testid="button-back-blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Articles
              </Button>
            </Link>
          </div>
        </article>
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

      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: {
              '@type': 'Person',
              name: post.author,
            },
            datePublished: new Date(post.publishedAt).toISOString(),
            publisher: {
              '@type': 'Organization',
              name: 'LaunderetteNear.me',
              url: 'https://launderettenear.me',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://launderettenear.me/blog/${post.slug}`,
            },
            ...(post.imageUrl && {
              image: post.imageUrl,
            }),
          }),
        }}
      />
    </div>
  );
}
