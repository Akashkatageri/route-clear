import { db } from "./db";
import { emergencyAlerts, type InsertEmergencyAlert, type EmergencyAlert } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
  getActiveAlerts(): Promise<EmergencyAlert[]>;
  updateAlertLocation(id: number, lat: number, lng: number): Promise<EmergencyAlert | undefined>;
  updateAlertStatus(id: number, status: string): Promise<EmergencyAlert | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const [newAlert] = await db.insert(emergencyAlerts).values(alert).returning();
    return newAlert;
  }

  async getActiveAlerts(): Promise<EmergencyAlert[]> {
    return await db.select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.status, 'active'))
      .orderBy(desc(emergencyAlerts.updatedAt));
  }

  async updateAlertLocation(id: number, lat: number, lng: number): Promise<EmergencyAlert | undefined> {
    const [updated] = await db.update(emergencyAlerts)
      .set({ currentLat: lat, currentLng: lng, updatedAt: new Date() })
      .where(eq(emergencyAlerts.id, id))
      .returning();
    return updated;
  }

  async updateAlertStatus(id: number, status: string): Promise<EmergencyAlert | undefined> {
    const [updated] = await db.update(emergencyAlerts)
      .set({ status, updatedAt: new Date() })
      .where(eq(emergencyAlerts.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
