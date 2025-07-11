import { 
  users, 
  categories, 
  prompts, 
  promptSessions,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Prompt,
  type InsertPrompt,
  type PromptSession,
  type InsertPromptSession
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Prompt methods
  getPrompts(userId?: number, categoryId?: number): Promise<Prompt[]>;
  getPrompt(id: number): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: number, prompt: Partial<InsertPrompt>): Promise<Prompt | undefined>;
  deletePrompt(id: number): Promise<boolean>;
  
  // Prompt session methods
  getPromptSession(id: number): Promise<PromptSession | undefined>;
  getPromptSessionsByUser(userId: number): Promise<PromptSession[]>;
  createPromptSession(session: InsertPromptSession): Promise<PromptSession>;
  updatePromptSession(id: number, session: Partial<InsertPromptSession>): Promise<PromptSession | undefined>;
  deletePromptSession(id: number): Promise<boolean>;
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, insertCategory: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(insertCategory)
      .where(eq(categories.id, id))
      .returning();
    return category || undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Prompt methods
  async getPrompts(userId?: number, categoryId?: number): Promise<Prompt[]> {
    if (userId && categoryId) {
      return await db.select().from(prompts).where(and(eq(prompts.userId, userId), eq(prompts.categoryId, categoryId)));
    } else if (userId) {
      return await db.select().from(prompts).where(eq(prompts.userId, userId));
    } else if (categoryId) {
      return await db.select().from(prompts).where(eq(prompts.categoryId, categoryId));
    }
    
    return await db.select().from(prompts);
  }

  async getPrompt(id: number): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt || undefined;
  }

  async createPrompt(insertPrompt: InsertPrompt): Promise<Prompt> {
    const [prompt] = await db
      .insert(prompts)
      .values(insertPrompt)
      .returning();
    return prompt;
  }

  async updatePrompt(id: number, insertPrompt: Partial<InsertPrompt>): Promise<Prompt | undefined> {
    const [prompt] = await db
      .update(prompts)
      .set({ ...insertPrompt, updatedAt: new Date() })
      .where(eq(prompts.id, id))
      .returning();
    return prompt || undefined;
  }

  async deletePrompt(id: number): Promise<boolean> {
    const result = await db.delete(prompts).where(eq(prompts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Prompt session methods
  async getPromptSession(id: number): Promise<PromptSession | undefined> {
    const [session] = await db.select().from(promptSessions).where(eq(promptSessions.id, id));
    return session || undefined;
  }

  async getPromptSessionsByUser(userId: number): Promise<PromptSession[]> {
    return await db.select().from(promptSessions).where(eq(promptSessions.userId, userId));
  }

  async createPromptSession(insertSession: InsertPromptSession): Promise<PromptSession> {
    const [session] = await db
      .insert(promptSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updatePromptSession(id: number, insertSession: Partial<InsertPromptSession>): Promise<PromptSession | undefined> {
    const [session] = await db
      .update(promptSessions)
      .set({ ...insertSession, updatedAt: new Date() })
      .where(eq(promptSessions.id, id))
      .returning();
    return session || undefined;
  }

  async deletePromptSession(id: number): Promise<boolean> {
    const result = await db.delete(promptSessions).where(eq(promptSessions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
