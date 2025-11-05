import { getAdminDb } from './firebase-admin';
import type { Launderette, Review, BlogPost } from '../../shared/schema';

export async function getLaunderetteById(id: string): Promise<Launderette | null> {
  try {
    const db = getAdminDb();
    const doc = await db.collection('launderettes').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data(),
    } as Launderette;
  } catch (error) {
    console.error('Error fetching launderette:', error);
    return null;
  }
}

export async function getLaunderettesByCity(cityName: string): Promise<Launderette[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('launderettes')
      .where('city', '==', cityName)
      .orderBy('isPremium', 'desc')
      .orderBy('name', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Launderette[];
  } catch (error) {
    console.error('Error fetching launderettes by city:', error);
    return [];
  }
}

export async function getReviewsForLaunderette(launderetteId: string): Promise<Review[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('reviews')
      .where('launderetteId', '==', launderetteId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getAverageRating(launderetteId: string): Promise<{ average: number; count: number }> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('reviews')
      .where('launderetteId', '==', launderetteId)
      .get();
    
    if (snapshot.empty) {
      return { average: 0, count: 0 };
    }
    
    const ratings = snapshot.docs.map(doc => (doc.data() as Review).rating);
    const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    
    return {
      average: Math.round(average * 10) / 10,
      count: ratings.length,
    };
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return { average: 0, count: 0 };
  }
}

export async function getAllLaunderettes(): Promise<Launderette[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('launderettes')
      .orderBy('city', 'asc')
      .orderBy('isPremium', 'desc')
      .orderBy('name', 'asc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Launderette[];
  } catch (error) {
    console.error('Error fetching all launderettes:', error);
    return [];
  }
}

export async function getCitiesWithCounts(): Promise<{ city: string; count: number }[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection('launderettes').get();
    
    const cityCounts = new Map<string, number>();
    
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const city = data.city as string;
      if (city) {
        cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
      }
    });
    
    return Array.from(cityCounts.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => a.city.localeCompare(b.city));
  } catch (error) {
    console.error('Error fetching city counts:', error);
    return [];
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('blog_posts')
      .orderBy('publishedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db = getAdminDb();
    const snapshot = await db
      .collection('blog_posts')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as BlogPost;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
