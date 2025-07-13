import { pgTable, text, serial, integer, boolean, timestamp, json, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prompts = pgTable("prompts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  categoryId: integer("category_id"),
  userId: varchar("user_id"),
  metadata: json("metadata"), // For storing additional prompt data like format, tone, etc.
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const promptSessions = pgTable("prompt_sessions", {
  id: serial("id").primaryKey(),
  sessionData: json("session_data").notNull(), // Store multi-step form data
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  prompts: many(prompts),
  promptSessions: many(promptSessions),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  prompts: many(prompts),
}));

export const promptRelations = relations(prompts, ({ one }) => ({
  category: one(categories, {
    fields: [prompts.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [prompts.userId],
    references: [users.id],
  }),
}));

export const promptSessionRelations = relations(promptSessions, ({ one }) => ({
  user: one(users, {
    fields: [promptSessions.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  parentId: true,
});

export const insertPromptSchema = createInsertSchema(prompts).pick({
  title: true,
  content: true,
  categoryId: true,
  userId: true,
  metadata: true,
  isPublic: true,
});

export const insertPromptSessionSchema = createInsertSchema(promptSessions).pick({
  sessionData: true,
  userId: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertPrompt = z.infer<typeof insertPromptSchema>;
export type Prompt = typeof prompts.$inferSelect;

export type InsertPromptSession = z.infer<typeof insertPromptSessionSchema>;
export type PromptSession = typeof promptSessions.$inferSelect;
