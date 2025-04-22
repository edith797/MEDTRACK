import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isGuest: boolean("is_guest").default(false),
  email: text("email"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isGuest: true,
  email: true,
});

// Medication model
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  schedule: json("schedule").notNull().$type<ScheduleItem[]>(),
  color: text("color").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMedicationSchema = createInsertSchema(medications).pick({
  userId: true,
  name: true,
  dosage: true,
  schedule: true,
  color: true,
  notes: true,
});

// Typescript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Medication = typeof medications.$inferSelect;
export type InsertMedication = z.infer<typeof insertMedicationSchema>;

// Schedule item type
export type ScheduleItem = {
  time: string;
  days: number[]; // 1-7 representing Monday-Sunday
};

// Frontend-only types (for localStorage)
export type LocalUser = {
  id: string;
  username: string;
  isGuest: boolean;
  email?: string;
};

export type LocalMedication = {
  id: string;
  name: string;
  dosage: string;
  schedule: ScheduleItem[];
  color: string;
  notes?: string;
};

// Storage keys
export const STORAGE_KEYS = {
  USER: 'medtrack_user',
  MEDICATIONS: 'medtrack_medications'
};
