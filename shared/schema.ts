import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("buyer"), // buyer, seller, agent
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  condition: text("condition").notNull(), // new, like new, very good, good, acceptable
  sellerId: integer("seller_id").notNull(),
  category: text("category").notNull(),
  images: json("images").notNull().default([]), // URLs to images
  acceptedCryptocurrencies: json("accepted_cryptocurrencies").notNull().default([]),
  status: text("status").notNull().default("available"), // available, sold, pending
  defects: text("defects"),
  originalPackaging: boolean("original_packaging"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  title: true,
  description: true,
  price: true,
  condition: true,
  sellerId: true,
  category: true,
  images: true,
  acceptedCryptocurrencies: true,
  defects: true,
  originalPackaging: true,
});

// Transaction model
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  buyerId: integer("buyer_id").notNull(),
  sellerId: integer("seller_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  cryptoCurrency: text("crypto_currency").notNull(),
  cryptoAmount: doublePrecision("crypto_amount").notNull(),
  fiatLocked: doublePrecision("fiat_locked").notNull(),
  status: text("status").notNull().default("initiated"), // initiated, paid, verified, shipped, completed, cancelled
  currentStep: integer("current_step").notNull().default(1), // 1-5
  shippingAgentId: integer("shipping_agent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  productId: true,
  buyerId: true,
  sellerId: true,
  amount: true,
  cryptoCurrency: true,
  cryptoAmount: true,
  fiatLocked: true,
  shippingAgentId: true,
});

// Cart model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
});

// Cryptocurrency conversion rates
export const cryptoRates = pgTable("crypto_rates", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  usdRate: doublePrecision("usd_rate").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCryptoRateSchema = createInsertSchema(cryptoRates).pick({
  symbol: true,
  name: true,
  usdRate: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type CryptoRate = typeof cryptoRates.$inferSelect;
export type InsertCryptoRate = z.infer<typeof insertCryptoRateSchema>;

// Custom schemas for validation
export const productStepSchema = z.object({
  step: z.number().min(1).max(5),
  transactionId: z.number(),
  status: z.enum(['approved', 'negotiated', 'cancelled']).optional(),
});

export const cryptoPaymentSchema = z.object({
  transactionId: z.number(),
  cryptoCurrency: z.string(),
});
