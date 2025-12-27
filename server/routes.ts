import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.alerts.create.path, async (req, res) => {
    try {
      const input = api.alerts.create.input.parse(req.body);
      const alert = await storage.createAlert(input);
      res.status(201).json(alert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.alerts.listActive.path, async (req, res) => {
    const alerts = await storage.getActiveAlerts();
    res.json(alerts);
  });

  app.patch(api.alerts.updateLocation.path, async (req, res) => {
    try {
      const { id } = req.params;
      const input = api.alerts.updateLocation.input.parse(req.body);
      const updated = await storage.updateAlertLocation(Number(id), input.lat, input.lng);
      if (!updated) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(updated);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  app.patch(api.alerts.updateStatus.path, async (req, res) => {
    try {
      const { id } = req.params;
      const input = api.alerts.updateStatus.input.parse(req.body);
      const updated = await storage.updateAlertStatus(Number(id), input.status);
      if (!updated) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(updated);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  // Seed data
  const alerts = await storage.getActiveAlerts();
  if (alerts.length === 0) {
    console.log("Seeding database with initial alert...");
    try {
      await storage.createAlert({
        ambulanceId: "TEMP-AMB-01",
        currentLat: 12.9716,
        currentLng: 77.5946,
        destinationName: "City Hospital",
        destinationLat: 12.9352,
        destinationLng: 77.6245,
        routePolyline: "[]", 
        eta: 15,
        distance: 5.2,
        status: "active"
      });
      console.log("Seeded initial alert.");
    } catch (e) {
      console.error("Error seeding:", e);
    }
  }

  return httpServer;
}
