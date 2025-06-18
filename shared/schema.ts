import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
});

export const mechanics = pgTable("mechanics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  businessName: text("business_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  address: text("address").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  services: text("services").array().notNull(),
  availability: text("availability").notNull().default("available"), // available, busy, offline
  responseTime: integer("response_time").default(15), // minutes
  priceRange: text("price_range").notNull(),
  profileImage: text("profile_image"),
  is24x7: boolean("is_24x7").default(false),
});

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  mechanicId: integer("mechanic_id").references(() => mechanics.id),
  serviceType: text("service_type").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, assigned, in_progress, completed, cancelled
  priority: text("priority").notNull().default("normal"), // emergency, high, normal
  userLatitude: decimal("user_latitude", { precision: 10, scale: 8 }).notNull(),
  userLongitude: decimal("user_longitude", { precision: 11, scale: 8 }).notNull(),
  userAddress: text("user_address").notNull(),
  estimatedPrice: decimal("estimated_price", { precision: 8, scale: 2 }),
  finalPrice: decimal("final_price", { precision: 8, scale: 2 }),
  estimatedArrival: timestamp("estimated_arrival"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceHistory = pgTable("service_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  mechanicId: integer("mechanic_id").notNull().references(() => mechanics.id),
  serviceType: text("service_type").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  rating: integer("rating"), // 1-5 stars
  review: text("review"),
  completedAt: timestamp("completed_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => serviceRequests.id),
  senderId: integer("sender_id").notNull(),
  senderType: text("sender_type").notNull(), // user, mechanic, system
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertMechanicSchema = createInsertSchema(mechanics).omit({
  id: true,
  rating: true,
  reviewCount: true,
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  mechanicId: true,
  status: true,
  estimatedPrice: true,
  finalPrice: true,
  estimatedArrival: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceHistorySchema = createInsertSchema(serviceHistory).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Mechanic = typeof mechanics.$inferSelect;
export type InsertMechanic = z.infer<typeof insertMechanicSchema>;

export type ServiceRequest = typeof serviceRequests.$inferSelect;
export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;

export type ServiceHistory = typeof serviceHistory.$inferSelect;
export type InsertServiceHistory = z.infer<typeof insertServiceHistorySchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
