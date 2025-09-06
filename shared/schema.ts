import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const circuits = pgTable("circuits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  nodes: jsonb("nodes").notNull().default('[]'),
  edges: jsonb("edges").notNull().default('[]'),
  scenario: text("scenario").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const proofSessions = pgTable("proof_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  circuitId: varchar("circuit_id").references(() => circuits.id),
  status: text("status").notNull().default('idle'),
  steps: jsonb("steps").notNull().default('[]'),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertCircuitSchema = createInsertSchema(circuits).pick({
  name: true,
  description: true,
  nodes: true,
  edges: true,
  scenario: true,
});

export const insertProofSessionSchema = createInsertSchema(proofSessions).pick({
  circuitId: true,
  status: true,
  steps: true,
  result: true,
});

export type InsertCircuit = z.infer<typeof insertCircuitSchema>;
export type Circuit = typeof circuits.$inferSelect;

export type InsertProofSession = z.infer<typeof insertProofSessionSchema>;
export type ProofSession = typeof proofSessions.$inferSelect;
