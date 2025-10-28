import type { Express } from "express";
import { createServer, type Server } from "http";
import { firestoreBackend } from "./firestore-backend";
import { requireAuth, AuthenticatedRequest } from "./middleware/auth";
import { insertLaunderetteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Public endpoint - Geocoding using free Nominatim service
  app.get("/api/geocode", async (req, res) => {
    try {
      const address = req.query.address as string;
      
      if (!address) {
        return res.status(400).json({ error: "Address parameter is required" });
      }

      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'LaunderetteNearMe/1.0'
        }
      });

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        return res.status(404).json({ error: "Location not found" });
      }

      const result = data[0];
      
      res.json({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formattedAddress: result.display_name
      });
    } catch (error) {
      console.error("Geocoding error:", error);
      res.status(500).json({ error: "Geocoding failed" });
    }
  });

  // Public endpoint - Get all launderettes
  app.get("/api/launderettes", async (req, res) => {
    try {
      const snapshot = await firestoreBackend.collection("launderettes").get();
      const launderettes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(launderettes);
    } catch (error) {
      console.error("Error fetching launderettes:", error);
      res.status(500).json({ error: "Failed to fetch launderettes" });
    }
  });

  // Public endpoint - Get single launderette by ID
  app.get("/api/launderettes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await firestoreBackend.collection("launderettes").doc(id).get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: "Launderette not found" });
      }
      
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("Error fetching launderette:", error);
      res.status(500).json({ error: "Failed to fetch launderette" });
    }
  });

  // Protected endpoints - Require authentication
  
  // Create launderette
  app.post("/api/launderettes", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertLaunderetteSchema.parse(req.body);
      
      const docRef = await firestoreBackend.collection("launderettes").add({
        ...validatedData,
        createdAt: Date.now(),
        createdBy: req.user?.uid,
      });
      
      const doc = await docRef.get();
      const launderette = { id: doc.id, ...doc.data() };
      
      res.status(201).json(launderette);
    } catch (error: any) {
      console.error("Error creating launderette:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create launderette" });
    }
  });

  // Update launderette
  app.put("/api/launderettes/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertLaunderetteSchema.parse(req.body);
      
      const docRef = firestoreBackend.collection("launderettes").doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: "Launderette not found" });
      }
      
      await docRef.update({
        ...validatedData,
        updatedAt: Date.now(),
        updatedBy: req.user?.uid,
      });
      
      const updatedDoc = await docRef.get();
      const launderette = { id: updatedDoc.id, ...updatedDoc.data() };
      
      res.json(launderette);
    } catch (error: any) {
      console.error("Error updating launderette:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update launderette" });
    }
  });

  // Delete launderette
  app.delete("/api/launderettes/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      const docRef = firestoreBackend.collection("launderettes").doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: "Launderette not found" });
      }
      
      await docRef.delete();
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting launderette:", error);
      res.status(500).json({ error: "Failed to delete launderette" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
