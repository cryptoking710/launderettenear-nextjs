// Shared types for the Next.js app (matches Firestore schema)
export interface Launderette {
  id: string;
  name: string;
  address: string;
  city?: string;
  lat: number;
  lng: number;
  features: string[];
  isPremium: boolean;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  photoUrls: string[];
  openingHours?: Record<string, string>;
  priceRange?: "budget" | "moderate" | "premium";
  createdAt?: number;
}

export interface Review {
  id: string;
  launderetteId: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: number;
  readingTime: number;
  imageUrl?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: 'search' | 'view';
  searchQuery?: string;
  launderetteId?: string;
  launderetteName?: string;
  userLat?: number;
  userLng?: number;
  timestamp: number;
}

export interface Correction {
  id: string;
  launderetteId: string;
  launderetteName: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  reason?: string;
  submittedBy?: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: number;
  reviewedBy?: string;
}
