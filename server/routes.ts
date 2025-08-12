import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPatentSchema, insertPatentDocumentSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { hederaService } from "./services/hederaService";
import { aiService } from "./services/aiService";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getUserActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get('/api/dashboard/category-stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const categoryStats = await storage.getPatentCategoryStats(userId);
      res.json(categoryStats);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      res.status(500).json({ message: "Failed to fetch category stats" });
    }
  });

  // Patent routes
  app.get('/api/patents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patents = await storage.getPatentsByUser(userId);
      res.json(patents);
    } catch (error) {
      console.error("Error fetching patents:", error);
      res.status(500).json({ message: "Failed to fetch patents" });
    }
  });

  app.get('/api/patents/:id', isAuthenticated, async (req: any, res) => {
    try {
      const patent = await storage.getPatent(req.params.id);
      if (!patent) {
        return res.status(404).json({ message: "Patent not found" });
      }
      
      // Check if user owns this patent
      if (patent.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(patent);
    } catch (error) {
      console.error("Error fetching patent:", error);
      res.status(500).json({ message: "Failed to fetch patent" });
    }
  });

  app.post('/api/patents', isAuthenticated, upload.array('documents'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patentData = insertPatentSchema.parse({
        ...req.body,
        userId,
      });

      // Create the patent
      const patent = await storage.createPatent(patentData);

      // Process uploaded files
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // Calculate file hash
          const fileBuffer = fs.readFileSync(file.path);
          const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

          // Create document record
          await storage.createPatentDocument({
            patentId: patent.id,
            fileName: file.originalname,
            filePath: file.path,
            fileType: file.mimetype,
            fileSize: file.size,
            hashValue: hash,
          });
        }

        // Store patent hash on Hedera blockchain
        try {
          const hederaResult = await hederaService.storePatentHash(patent.id, req.files[0].path);
          
          // Update patent with Hedera information
          await storage.updatePatent(patent.id, {
            hederaTopicId: hederaResult.topicId,
            hederaMessageId: hederaResult.messageId,
            hashValue: hederaResult.hash,
          });

          // Create blockchain transaction record
          await storage.createBlockchainTransaction({
            patentId: patent.id,
            transactionType: 'hash_storage',
            hederaTopicId: hederaResult.topicId,
            hederaMessageId: hederaResult.messageId,
            status: 'confirmed',
          });
        } catch (hederaError) {
          console.error("Hedera storage error:", hederaError);
          // Continue even if blockchain storage fails
        }
      }

      // Create activity record
      await storage.createPatentActivity({
        patentId: patent.id,
        userId,
        activityType: 'created',
        description: `Patent "${patent.title}" created`,
      });

      res.status(201).json(patent);
    } catch (error) {
      console.error("Error creating patent:", error);
      res.status(500).json({ message: "Failed to create patent" });
    }
  });

  app.put('/api/patents/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patent = await storage.getPatent(req.params.id);
      
      if (!patent) {
        return res.status(404).json({ message: "Patent not found" });
      }
      
      if (patent.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updates = insertPatentSchema.partial().parse(req.body);
      const updatedPatent = await storage.updatePatent(req.params.id, updates);

      // Create activity record
      await storage.createPatentActivity({
        patentId: patent.id,
        userId,
        activityType: 'updated',
        description: `Patent "${patent.title}" updated`,
      });

      res.json(updatedPatent);
    } catch (error) {
      console.error("Error updating patent:", error);
      res.status(500).json({ message: "Failed to update patent" });
    }
  });

  app.delete('/api/patents/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patent = await storage.getPatent(req.params.id);
      
      if (!patent) {
        return res.status(404).json({ message: "Patent not found" });
      }
      
      if (patent.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deletePatent(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting patent:", error);
      res.status(500).json({ message: "Failed to delete patent" });
    }
  });

  // AI Services routes
  app.post('/api/ai/prior-art-search', isAuthenticated, async (req: any, res) => {
    try {
      const { patentId, description } = req.body;
      const userId = req.user.claims.sub;

      // Verify patent ownership
      const patent = await storage.getPatent(patentId);
      if (!patent || patent.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Perform AI prior art search
      const searchResults = await aiService.performPriorArtSearch(description);

      // Store results in database
      for (const result of searchResults) {
        await storage.createPriorArtResult({
          patentId,
          externalPatentId: result.patentId,
          similarityScore: result.similarityScore.toString(),
          title: result.title,
          description: result.description,
          source: result.source,
        });
      }

      // Create AI analysis record
      await storage.createAIAnalysis({
        patentId,
        analysisType: 'prior_art',
        result: { results: searchResults },
        confidence: Math.max(...searchResults.map(r => r.similarityScore)).toString(),
      });

      res.json(searchResults);
    } catch (error) {
      console.error("Error in prior art search:", error);
      res.status(500).json({ message: "Failed to perform prior art search" });
    }
  });

  app.post('/api/ai/patent-valuation', isAuthenticated, async (req: any, res) => {
    try {
      const { patentId } = req.body;
      const userId = req.user.claims.sub;

      // Verify patent ownership
      const patent = await storage.getPatent(patentId);
      if (!patent || patent.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Perform AI valuation
      const valuation = await aiService.evaluatePatentValue(patent);

      // Update patent with estimated value
      await storage.updatePatent(patentId, {
        estimatedValue: valuation.estimatedValue.toString(),
      });

      // Create AI analysis record
      await storage.createAIAnalysis({
        patentId,
        analysisType: 'valuation',
        result: valuation,
        confidence: valuation.confidence.toString(),
      });

      // Create activity record
      await storage.createPatentActivity({
        patentId,
        userId,
        activityType: 'valuation_updated',
        description: `Patent valuation updated to $${valuation.estimatedValue}`,
      });

      res.json(valuation);
    } catch (error) {
      console.error("Error in patent valuation:", error);
      res.status(500).json({ message: "Failed to evaluate patent value" });
    }
  });

  app.post('/api/ai/similarity-detection', isAuthenticated, async (req: any, res) => {
    try {
      const { patentId, targetText } = req.body;
      const userId = req.user.claims.sub;

      // Verify patent ownership
      const patent = await storage.getPatent(patentId);
      if (!patent || patent.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Perform similarity detection
      const similarity = await aiService.detectSimilarity(patent.description, targetText);

      // Create AI analysis record
      await storage.createAIAnalysis({
        patentId,
        analysisType: 'similarity',
        result: similarity,
        confidence: similarity.confidence.toString(),
      });

      res.json(similarity);
    } catch (error) {
      console.error("Error in similarity detection:", error);
      res.status(500).json({ message: "Failed to detect similarity" });
    }
  });

  app.post('/api/ai/patent-drafting', isAuthenticated, async (req: any, res) => {
    try {
      const { title, description, category } = req.body;
      
      // Generate patent document using AI
      const draftDocument = await aiService.generatePatentDraft({
        title,
        description,
        category,
      });

      res.json(draftDocument);
    } catch (error) {
      console.error("Error in patent drafting:", error);
      res.status(500).json({ message: "Failed to generate patent draft" });
    }
  });

  // Blockchain verification routes
  app.get('/api/blockchain/verify/:patentId', isAuthenticated, async (req: any, res) => {
    try {
      const patent = await storage.getPatent(req.params.patentId);
      if (!patent) {
        return res.status(404).json({ message: "Patent not found" });
      }

      if (!patent.hederaTopicId || !patent.hederaMessageId) {
        return res.status(400).json({ message: "Patent not stored on blockchain" });
      }

      // Verify on Hedera blockchain
      const verification = await hederaService.verifyPatentHash(
        patent.hederaTopicId,
        patent.hederaMessageId,
        patent.hashValue!
      );

      res.json(verification);
    } catch (error) {
      console.error("Error verifying patent:", error);
      res.status(500).json({ message: "Failed to verify patent on blockchain" });
    }
  });

  app.post('/api/blockchain/mint-nft/:patentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const patent = await storage.getPatent(req.params.patentId);
      
      if (!patent || patent.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (patent.hederaNftId) {
        return res.status(400).json({ message: "NFT already minted for this patent" });
      }

      // Mint NFT on Hedera
      const nftResult = await hederaService.mintPatentNFT(patent);

      // Update patent with NFT information
      await storage.updatePatent(req.params.patentId, {
        hederaNftId: nftResult.nftId,
      });

      // Create blockchain transaction record
      await storage.createBlockchainTransaction({
        patentId: patent.id,
        transactionType: 'nft_mint',
        hederaTransactionId: nftResult.transactionId,
        status: 'confirmed',
      });

      // Create activity record
      await storage.createPatentActivity({
        patentId: patent.id,
        userId,
        activityType: 'nft_minted',
        description: `NFT minted for patent "${patent.title}"`,
      });

      res.json(nftResult);
    } catch (error) {
      console.error("Error minting NFT:", error);
      res.status(500).json({ message: "Failed to mint patent NFT" });
    }
  });

  // Search routes
  app.get('/api/search/patents', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }

      const results = await storage.searchPatents(query, userId);
      res.json(results);
    } catch (error) {
      console.error("Error searching patents:", error);
      res.status(500).json({ message: "Failed to search patents" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
