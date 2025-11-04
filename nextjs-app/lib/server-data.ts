import { getAdminDb } from "./firebase-admin";

export interface Launderette {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  features?: string[];
  priceRange?: string;
  isPremium?: boolean;
  photoUrls?: string[];
  openingHours?: Record<string, string>;
  createdAt?: any;
  updatedAt?: any;
}

export async function getAllLaunderettes(): Promise<Launderette[]> {
  const db = getAdminDb();
  const snapshot = await db.collection("launderettes").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Launderette[];
}

export async function getLaunderetteById(id: string): Promise<Launderette | null> {
  const db = getAdminDb();
  const doc = await db.collection("launderettes").doc(id).get();
  if (!doc.exists) {
    return null;
  }
  return {
    id: doc.id,
    ...doc.data(),
  } as Launderette;
}

export async function getLaunderettesByCity(city: string): Promise<Launderette[]> {
  const db = getAdminDb();
  const snapshot = await db
    .collection("launderettes")
    .where("city", "==", city)
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Launderette[];
}

export async function getAllCities(): Promise<string[]> {
  const launderettes = await getAllLaunderettes();
  const cities = [...new Set(launderettes.map((l) => l.city))];
  return cities.sort();
}
