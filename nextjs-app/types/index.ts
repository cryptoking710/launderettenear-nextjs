// Shared types for the Next.js app
export interface Launderette {
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  features: string[];
  openingHours?: string;
  priceRange?: string;
  isPremium: boolean;
  photos?: string[];
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  launderetteId: string;
  rating: number;
  comment: string;
  reviewerName: string;
  timestamp: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readingTime?: number;
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
