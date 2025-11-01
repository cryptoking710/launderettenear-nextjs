import type { Express } from "express";
import { createServer, type Server } from "http";
import { firestoreBackend } from "./firestore-backend";
import { requireAuth, AuthenticatedRequest } from "./middleware/auth";
import { insertLaunderetteSchema, insertReviewSchema, insertAnalyticsEventSchema, insertCorrectionSchema, insertCityFaqSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Public endpoint - Geocoding using free Nominatim service
  app.get("/api/geocode", async (req, res) => {
    try {
      const address = req.query.address as string;
      
      if (!address) {
        return res.status(400).json({ error: "Address parameter is required" });
      }

      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=gb&limit=1`;
      
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

  // Review endpoints
  
  // Get all reviews for a launderette (public)
  app.get("/api/launderettes/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const snapshot = await firestoreBackend.collection("reviews").get();
      const allReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter reviews for this launderette
      const reviews = allReviews.filter((r: any) => r.launderetteId === id);
      
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Create a review (public - anyone can review)
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      
      const docRef = await firestoreBackend.collection("reviews").add({
        ...validatedData,
        createdAt: Date.now(),
      });
      
      const doc = await docRef.get();
      const review = { id: doc.id, ...doc.data() };
      
      res.status(201).json(review);
    } catch (error: any) {
      console.error("Error creating review:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Delete a review (admin only)
  app.delete("/api/reviews/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      const docRef = firestoreBackend.collection("reviews").doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: "Review not found" });
      }
      
      await docRef.delete();
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  });

  // Analytics endpoints
  
  // Track an analytics event (public)
  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsEventSchema.parse(req.body);
      
      await firestoreBackend.collection("analytics").add({
        ...validatedData,
        timestamp: Date.now(),
      });
      
      res.status(201).json({ success: true });
    } catch (error: any) {
      console.error("Error tracking analytics:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to track analytics" });
    }
  });

  // Get analytics data (admin only)
  app.get("/api/analytics", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const snapshot = await firestoreBackend.collection("analytics").get();
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Correction endpoints
  
  // Submit a correction (public - anyone can submit)
  app.post("/api/corrections", async (req, res) => {
    try {
      const validatedData = insertCorrectionSchema.parse(req.body);
      
      // Force status to pending and strip any reviewer metadata for security
      const docRef = await firestoreBackend.collection("corrections").add({
        ...validatedData,
        status: "pending",
        createdAt: Date.now(),
        // Explicitly ensure these are not set
        reviewedAt: null,
        reviewedBy: null,
      });
      
      const doc = await docRef.get();
      const correction = { id: doc.id, ...doc.data() };
      
      res.status(201).json(correction);
    } catch (error: any) {
      console.error("Error creating correction:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit correction" });
    }
  });

  // Get all corrections (admin only)
  app.get("/api/corrections", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const snapshot = await firestoreBackend.collection("corrections").get();
      const corrections = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(corrections);
    } catch (error) {
      console.error("Error fetching corrections:", error);
      res.status(500).json({ error: "Failed to fetch corrections" });
    }
  });

  // Approve a correction (admin only)
  app.put("/api/corrections/:id/approve", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      const docRef = firestoreBackend.collection("corrections").doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: "Correction not found" });
      }
      
      const correction = doc.data();
      
      // Security: Only allow pending corrections to be approved
      if (correction?.status !== "pending") {
        return res.status(400).json({ error: "Only pending corrections can be approved" });
      }
      
      // Validate the field name is an allowed launderette field
      const allowedFields = ["name", "address", "phone", "email", "website"];
      if (!allowedFields.includes(correction?.fieldName)) {
        return res.status(400).json({ error: "Invalid field name for correction" });
      }
      
      // Update the correction status
      await docRef.update({
        status: "approved",
        reviewedAt: Date.now(),
        reviewedBy: req.user?.email || req.user?.uid,
      });

      // Apply the correction to the launderette
      const launderetteRef = firestoreBackend.collection("launderettes").doc(correction?.launderetteId);
      const launderetteDoc = await launderetteRef.get();
      
      if (launderetteDoc.exists) {
        const updateData: any = {
          updatedAt: Date.now(),
        };
        
        // Apply the proposed value to the correct field
        updateData[correction?.fieldName] = correction?.proposedValue;
        
        await launderetteRef.update(updateData);
      }
      
      const updatedDoc = await docRef.get();
      const updatedCorrection = { id: updatedDoc.id, ...updatedDoc.data() };
      
      res.json(updatedCorrection);
    } catch (error) {
      console.error("Error approving correction:", error);
      res.status(500).json({ error: "Failed to approve correction" });
    }
  });

  // Reject a correction (admin only)
  app.put("/api/corrections/:id/reject", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      const docRef = firestoreBackend.collection("corrections").doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return res.status(404).json({ error: "Correction not found" });
      }
      
      const correction = doc.data();
      
      // Security: Only allow pending corrections to be rejected
      if (correction?.status !== "pending") {
        return res.status(400).json({ error: "Only pending corrections can be rejected" });
      }
      
      await docRef.update({
        status: "rejected",
        reviewedAt: Date.now(),
        reviewedBy: req.user?.email || req.user?.uid,
      });
      
      const updatedDoc = await docRef.get();
      const updatedCorrection = { id: updatedDoc.id, ...updatedDoc.data() };
      
      res.json(updatedCorrection);
    } catch (error) {
      console.error("Error rejecting correction:", error);
      res.status(500).json({ error: "Failed to reject correction" });
    }
  });

  // FAQ endpoints

  // Public endpoint - Get FAQs for a specific city
  app.get("/api/faqs/:cityName", async (req, res) => {
    try {
      const { cityName } = req.params;
      
      const snapshot = await firestoreBackend
        .collection("faqs")
        .where("cityName", "==", cityName)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return res.status(404).json({ error: "FAQs not found for this city" });
      }
      
      const doc = snapshot.docs[0];
      res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  // Protected endpoint - Create or update FAQs for a city (admin only)
  app.post("/api/faqs", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertCityFaqSchema.parse(req.body);
      
      // Check if FAQs already exist for this city
      const existingSnapshot = await firestoreBackend
        .collection("faqs")
        .where("cityName", "==", validatedData.cityName)
        .limit(1)
        .get();
      
      let docRef;
      let isUpdate = false;
      
      if (!existingSnapshot.empty) {
        // Update existing FAQs
        docRef = existingSnapshot.docs[0].ref;
        await docRef.update({
          questions: validatedData.questions,
          updatedAt: Date.now(),
          updatedBy: req.user?.uid,
        });
        isUpdate = true;
      } else {
        // Create new FAQs
        docRef = await firestoreBackend.collection("faqs").add({
          ...validatedData,
          createdAt: Date.now(),
          createdBy: req.user?.uid,
        });
      }
      
      const doc = await docRef.get();
      const faq = { id: doc.id, ...doc.data() };
      
      res.status(isUpdate ? 200 : 201).json(faq);
    } catch (error: any) {
      console.error("Error saving FAQs:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to save FAQs" });
    }
  });

  // Public endpoint - Generate sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const snapshot = await firestoreBackend.collection("launderettes").get();
      const launderettes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Extract unique cities
      const cities = Array.from(new Set(launderettes
        .map(l => l.city)
        .filter(Boolean)
      )).sort();

      // Build sitemap XML
      const baseUrl = "https://launderettenear.me";
      const now = new Date().toISOString();

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Homepage
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>1.0</priority>\n';
      xml += '  </url>\n';

      // Cities index page
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/cities</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';

      // City pages
      cities.forEach(city => {
        const encodedCity = encodeURIComponent(city);
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/city/${encodedCity}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.9</priority>\n';
        xml += '  </url>\n';
      });

      // Launderette detail pages
      launderettes.forEach(launderette => {
        const lastmod = launderette.updatedAt 
          ? new Date(launderette.updatedAt).toISOString()
          : launderette.createdAt 
            ? new Date(launderette.createdAt).toISOString()
            : now;

        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/launderette/${launderette.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      });

      xml += '</urlset>';

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Failed to generate sitemap");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
