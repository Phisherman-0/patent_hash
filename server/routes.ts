import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { storage } from "./storage";
import { insertPatentSchema, insertPatentDocumentSchema } from "@shared/schema";
import { aiService } from "./services/aiService";
import { hederaService } from "./services/hederaService";
import { register, login, logout, getCurrentUser, requireAuth } from "./auth";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export function registerRoutes(app: Express): Server {
  
  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Authentication routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/user", getCurrentUser);

  // Middleware to get user from session for protected routes
  app.use('/api', async (req, res, next) => {
    if (req.session?.userId) {
      try {
        const user = await storage.getUser(req.session.userId);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          req.user = userWithoutPassword;
        }
      } catch (error) {
        console.error('Error loading user from session:', error);
      }
    }
    next();
  });

  // Get all patents for authenticated user
  app.get("/api/patents", requireAuth, async (req, res) => {
    try {
      const patents = await storage.getUserPatents(req.user!.id);
      res.json(patents);
    } catch (error) {
      console.error("Error fetching patents:", error);
      res.status(500).json({ error: "Failed to fetch patents" });
    }
  });

  // Create new patent
  app.post("/api/patents", requireAuth, upload.array("documents", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      // Validate patent data
      const patentData = insertPatentSchema.parse({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        userId: req.user!.id,
      });

      // Create patent
      const patent = await storage.createPatent(patentData);

      // Process documents if any
      if (files && files.length > 0) {
        for (const file of files) {
          const documentData = insertPatentDocumentSchema.parse({
            patentId: patent.id,
            filename: file.originalname,
            filepath: file.path,
            fileSize: file.size,
            mimeType: file.mimetype,
          });

          await storage.createPatentDocument(documentData);
        }
      }

      // Store on blockchain if Hedera is available
      try {
        const hashData = `${patent.title}-${patent.description}-${Date.now()}`;
        await hederaService.storePatentHash(patent.id, hashData);
      } catch (hederaError) {
        console.error("Hedera storage error:", hederaError);
        // Continue even if blockchain storage fails
      }

      // Trigger AI analysis if available
      try {
        await aiService.analyzePatent(patent.id, patent.description);
      } catch (aiError) {
        console.error("AI analysis error:", aiError);
        // Continue even if AI analysis fails
      }

      res.status(201).json(patent);
    } catch (error) {
      console.error("Error creating patent:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid patent data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create patent" });
    }
  });

  // Get patent by ID
  app.get("/api/patents/:id", requireAuth, async (req, res) => {
    try {
      const patent = await storage.getPatent(req.params.id);
      if (!patent) {
        return res.status(404).json({ error: "Patent not found" });
      }

      // Check if user owns the patent
      if (patent.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(patent);
    } catch (error) {
      console.error("Error fetching patent:", error);
      res.status(500).json({ error: "Failed to fetch patent" });
    }
  });

  // Get dashboard statistics
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Get user activities
  app.get("/api/dashboard/activities", requireAuth, async (req, res) => {
    try {
      const activities = await storage.getUserActivities(req.user!.id);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Get category statistics
  app.get("/api/dashboard/category-stats", requireAuth, async (req, res) => {
    try {
      const categoryStats = await storage.getCategoryStats(req.user!.id);
      res.json(categoryStats);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      res.status(500).json({ error: "Failed to fetch category stats" });
    }
  });

  // AI Prior Art Search
  app.post("/api/ai/prior-art-search", requireAuth, async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }

      const results = await aiService.searchPriorArt(description);
      res.json(results);
    } catch (error) {
      console.error("Prior art search error:", error);
      res.status(500).json({ error: "Failed to search prior art" });
    }
  });

  // AI Similarity Detection
  app.post("/api/ai/similarity", requireAuth, async (req, res) => {
    try {
      const { description1, description2 } = req.body;
      if (!description1 || !description2) {
        return res.status(400).json({ error: "Both descriptions are required" });
      }

      const similarity = await aiService.checkSimilarity(description1, description2);
      res.json({ similarity });
    } catch (error) {
      console.error("Similarity detection error:", error);
      res.status(500).json({ error: "Failed to check similarity" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}