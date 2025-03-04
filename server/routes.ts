import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSwitchSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Smart ID mock authentication
  app.post("/api/auth/smart-id", async (req, res) => {
    const { personalCode } = req.body;
    
    if (!personalCode || typeof personalCode !== "string") {
      return res.status(400).json({ message: "Invalid personal code" });
    }

    // Mock Smart ID authentication process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let user = await storage.getUserByPersonalCode(personalCode);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.session.userId = user.id;
    return res.json(user);
  });

  // User registration
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Get current user
  app.get("/api/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  });

  // Update user profile
  app.patch("/api/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.updateUser(req.session.userId, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Get all electricity plans
  app.get("/api/plans", async (_req, res) => {
    const plans = await storage.getPlans();
    res.json(plans);
  });

  // Request plan switch
  app.post("/api/switches", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const switchData = insertSwitchSchema.parse({
        ...req.body,
        userId: req.session.userId,
        requestedAt: new Date(),
        status: "pending"
      });
      
      const planSwitch = await storage.createSwitch(switchData);
      res.json(planSwitch);
    } catch (error) {
      res.status(400).json({ message: "Invalid switch request" });
    }
  });

  // Get user's switches
  app.get("/api/switches", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const switches = await storage.getUserSwitches(req.session.userId);
    res.json(switches);
  });

  return httpServer;
}
