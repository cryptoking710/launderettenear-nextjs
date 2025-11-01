import { z } from "zod";

// Launderette schema for Firestore
export const launderetteSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  features: z.array(z.string()).default([]),
  isPremium: z.boolean().default(false),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  photoUrls: z.array(z.string()).default([]),
  openingHours: z.record(z.string()).optional(),
  priceRange: z.enum(["budget", "moderate", "premium"]).optional(),
  createdAt: z.number().optional(),
});

export const insertLaunderetteSchema = launderetteSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type Launderette = z.infer<typeof launderetteSchema>;
export type InsertLaunderette = z.infer<typeof insertLaunderetteSchema>;

// Geocoding result
export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

// User location
export interface UserLocation {
  lat: number | null;
  lng: number | null;
}

// Review schema
export const reviewSchema = z.object({
  id: z.string(),
  launderetteId: z.string(),
  userName: z.string().min(1, "Name is required"),
  userEmail: z.string().email().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
  createdAt: z.number(),
});

export const insertReviewSchema = reviewSchema.omit({ 
  id: true, 
  createdAt: true 
});

export type Review = z.infer<typeof reviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Analytics event schema
export const analyticsEventSchema = z.object({
  id: z.string(),
  type: z.enum(["search", "view"]),
  searchQuery: z.string().optional(),
  launderetteId: z.string().optional(),
  launderetteName: z.string().optional(),
  userLat: z.number().optional(),
  userLng: z.number().optional(),
  timestamp: z.number(),
});

export const insertAnalyticsEventSchema = analyticsEventSchema.omit({ 
  id: true, 
  timestamp: true 
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

// Correction schema for user-submitted corrections
export const correctionSchema = z.object({
  id: z.string(),
  launderetteId: z.string(),
  launderetteName: z.string(),
  submitterName: z.string().min(1, "Name is required"),
  submitterEmail: z.string().email("Valid email is required"),
  fieldName: z.string().min(1, "Field name is required"),
  currentValue: z.string(),
  proposedValue: z.string().min(1, "Proposed value is required"),
  additionalNotes: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  createdAt: z.number(),
  reviewedAt: z.number().optional(),
  reviewedBy: z.string().optional(),
});

export const insertCorrectionSchema = correctionSchema.omit({ 
  id: true, 
  createdAt: true,
  reviewedAt: true,
  reviewedBy: true,
  status: true,
});

export type Correction = z.infer<typeof correctionSchema>;
export type InsertCorrection = z.infer<typeof insertCorrectionSchema>;

// FAQ schema for city-specific frequently asked questions
export const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const cityFaqSchema = z.object({
  id: z.string(),
  cityName: z.string().min(1, "City name is required"),
  questions: z.array(faqItemSchema).min(1, "At least one FAQ is required"),
  createdAt: z.number(),
  updatedAt: z.number().optional(),
});

export const insertCityFaqSchema = cityFaqSchema.omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true,
});

export type FaqItem = z.infer<typeof faqItemSchema>;
export type CityFaq = z.infer<typeof cityFaqSchema>;
export type InsertCityFaq = z.infer<typeof insertCityFaqSchema>;
