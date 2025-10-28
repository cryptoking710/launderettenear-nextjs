import { z } from "zod";

// Launderette schema for Firestore
export const launderetteSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  lat: z.number(),
  lng: z.number(),
  features: z.array(z.string()).default([]),
  isPremium: z.boolean().default(false),
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
