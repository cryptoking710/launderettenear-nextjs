import { useEffect } from 'react';

interface SEOTagsProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'business.business';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function SEOTags({
  title,
  description,
  url,
  image = 'https://launderettenear.me/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
}: SEOTagsProps) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }

    // Helper to set/update meta tag
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    // Helper to set/update Twitter meta tag
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (tag) {
        tag.setAttribute('content', content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        tag.setAttribute('content', content);
        document.head.appendChild(tag);
      }
    };

    // Helper to remove meta tag
    const removeMetaTag = (property: string) => {
      const tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.remove();
      }
    };

    // Set Open Graph tags
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:type', type);
    setMetaTag('og:image', image);
    
    if (url) {
      setMetaTag('og:url', url);
    }

    // Handle article-specific tags
    if (type === 'article') {
      // Always remove first to clear stale values, then conditionally add new ones
      removeMetaTag('article:published_time');
      removeMetaTag('article:modified_time');
      removeMetaTag('article:author');
      
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime);
      }
      if (modifiedTime) {
        setMetaTag('article:modified_time', modifiedTime);
      }
      if (author) {
        setMetaTag('article:author', author);
      }
    } else {
      // Remove article-specific tags if this is not an article
      removeMetaTag('article:published_time');
      removeMetaTag('article:modified_time');
      removeMetaTag('article:author');
    }

    // Set Twitter Card tags
    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', title);
    setTwitterTag('twitter:description', description);
    setTwitterTag('twitter:image', image);

    // Cleanup function to reset to default
    return () => {
      document.title = "Launderette Near Me | Find 1,057+ UK Launderettes & Laundrettes | LaunderetteNear.me";
      const defaultDesc = "Find your nearest launderette in seconds. Search 1,057+ launderettes across 104 UK cities. Service wash, 24 hour, self-service & more. Real reviews, opening hours & prices.";
      
      const desc = document.querySelector('meta[name="description"]');
      if (desc) {
        desc.setAttribute('content', defaultDesc);
      }

      // Remove article-specific tags on cleanup
      const articleTags = ['article:published_time', 'article:modified_time', 'article:author'];
      articleTags.forEach(prop => {
        const tag = document.querySelector(`meta[property="${prop}"]`);
        if (tag) tag.remove();
      });
    };
  }, [title, description, url, image, type, publishedTime, modifiedTime, author]);

  return null;
}
