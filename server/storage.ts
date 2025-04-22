import { users, type User, type InsertUser } from "@shared/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import session from "express-session";
import connectPg from "connect-pg-simple";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
}

// Database connection
const connectionString = process.env.DATABASE_URL;
let db: any;
let queryClient: any;

if (connectionString) {
  queryClient = postgres(connectionString);
  db = drizzle(queryClient);
}

// Create session store
const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString,
      },
      createTableIfMissing: true,
    });
    
    // Initialize database tables
    this.initDb();
  }

  private async initDb() {
    try {
      // Create users table if it doesn't exist
      await queryClient`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT,
          "isGuest" BOOLEAN DEFAULT false
        )
      `;
      
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values({
        username: insertUser.username,
        password: insertUser.password,
        email: insertUser.email || null,
        isGuest: insertUser.isGuest || false
      }).returning();
      
      return result[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Create memory-based session store
    const MemoryStore = require('memorystore')(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      id, 
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email || null,
      isGuest: insertUser.isGuest || false
    };
    
    this.users.set(id, user);
    return user;
  }
}

// Use database storage if we have a connection string, otherwise fall back to memory
export const storage = connectionString 
  ? new DatabaseStorage() 
  : new MemStorage();
