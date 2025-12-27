import { pgTable, text, serial, integer, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const emergencyAlerts = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  ambulanceId: text("ambulance_id").notNull(),
  currentLat: doublePrecision("current_lat").notNull(),
  currentLng: doublePrecision("current_lng").notNull(),
  destinationName: text("destination_name").notNull(),
  destinationLat: doublePrecision("destination_lat").notNull(),
  destinationLng: doublePrecision("destination_lng").notNull(),
  routePolyline: text("route_polyline").notNull(), // Stores geometry/coordinates JSON
  eta: integer("eta").notNull(), // minutes
  distance: doublePrecision("distance").notNull(), // km
  status: text("status").notNull().default('active'), // 'active', 'completed'
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({
  id: true,
  updatedAt: true,
});

export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
