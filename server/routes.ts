import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/login, /api/register, /api/logout, /api/user)
  setupAuth(app);

  // Add other API routes here
  // prefix all routes with /api

  const httpServer = createServer(app);

  return httpServer;
}
