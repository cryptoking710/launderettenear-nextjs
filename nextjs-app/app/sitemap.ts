import { MetadataRoute } from 'next';
import { getAllLaunderettes, getAllBlogPosts } from '@/lib/firestore';
import { UK_REGIONS, type City } from '@/lib/regions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://launderettenear.me';
  const now = new Date();

  try {
    const [launderettes, blogPosts] = await Promise.all([
      getAllLaunderettes(),
      getAllBlogPosts()
    ]);

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/cities`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/laundry-symbols`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ];

    const allCities: City[] = Object.values(UK_REGIONS).flat();
    const cityPages: MetadataRoute.Sitemap = allCities.map((city: City) => ({
      url: `${baseUrl}/city/${encodeURIComponent(city)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    const launderettePages: MetadataRoute.Sitemap = launderettes.map((launderette) => ({
      url: `${baseUrl}/launderette/${launderette.id}`,
      lastModified: launderette.createdAt ? new Date(launderette.createdAt) : now,
      changeFrequency: 'weekly' as const,
      priority: launderette.isPremium ? 0.8 : 0.7,
    }));

    const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...cityPages, ...launderettePages, ...blogPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
