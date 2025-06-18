import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServiceRequestSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/user/:id/location", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { latitude, longitude, address } = req.body;
      const user = await storage.updateUserLocation(userId, latitude, longitude, address);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Mechanic routes
  app.get("/api/mechanics", async (req, res) => {
    try {
      const mechanics = await storage.getAllMechanics();
      res.json(mechanics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/mechanics/nearby", async (req, res) => {
    try {
      const { latitude, longitude, radius } = req.query;
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }
      
      const lat = parseFloat(latitude as string);
      const lng = parseFloat(longitude as string);
      const searchRadius = radius ? parseInt(radius as string) : 10;
      
      const mechanics = await storage.getNearbyMechanics(lat, lng, searchRadius);
      res.json(mechanics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/mechanics/:id", async (req, res) => {
    try {
      const mechanicId = parseInt(req.params.id);
      const mechanic = await storage.getMechanic(mechanicId);
      if (!mechanic) {
        return res.status(404).json({ message: "Mechanic not found" });
      }
      res.json(mechanic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Service request routes
  app.post("/api/service-requests", async (req, res) => {
    try {
      const requestData = insertServiceRequestSchema.parse(req.body);
      const request = await storage.createServiceRequest(requestData);
      
      // Auto-assign first available mechanic (simplified matching)
      const nearbyMechanics = await storage.getNearbyMechanics(
        parseFloat(request.userLatitude),
        parseFloat(request.userLongitude)
      );
      
      const availableMechanic = nearbyMechanics.find(m => m.availability === "available");
      if (availableMechanic) {
        const estimatedArrival = new Date();
        estimatedArrival.setMinutes(estimatedArrival.getMinutes() + availableMechanic.responseTime);
        
        const estimatedPrice = request.serviceType === "Battery Jump" ? "55.00" :
                             request.serviceType === "Towing" ? "95.00" :
                             request.serviceType === "Tire Change" ? "65.00" :
                             request.serviceType === "Lockout" ? "75.00" : "65.00";
        
        await storage.assignMechanicToRequest(request.id, availableMechanic.id, estimatedArrival, estimatedPrice);
      }
      
      const updatedRequest = await storage.getServiceRequest(request.id);
      res.status(201).json(updatedRequest);
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get("/api/service-requests/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await storage.getUserServiceRequests(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/service-requests/:id", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getServiceRequest(requestId);
      if (!request) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/service-requests/:id/status", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const { status } = req.body;
      const request = await storage.updateServiceRequestStatus(requestId, status);
      if (!request) {
        return res.status(404).json({ message: "Service request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Service history routes
  app.get("/api/service-history/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const history = await storage.getUserServiceHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Message routes
  app.get("/api/messages/request/:requestId", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const messages = await storage.getRequestMessages(requestId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const message = await storage.createMessage(req.body);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
