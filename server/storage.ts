import { users, electricityPlans, planSwitches } from "@shared/schema";
import type { User, ElectricityPlan, PlanSwitch, InsertUser, InsertPlan, InsertSwitch } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByPersonalCode(code: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Plans
  getPlans(): Promise<ElectricityPlan[]>;
  getPlan(id: number): Promise<ElectricityPlan | undefined>;
  createPlan(plan: InsertPlan): Promise<ElectricityPlan>;

  // Switches
  createSwitch(planSwitch: InsertSwitch): Promise<PlanSwitch>;
  getUserSwitches(userId: number): Promise<PlanSwitch[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPersonalCode(code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.personalCode, code));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getPlans(): Promise<ElectricityPlan[]> {
    return await db.select().from(electricityPlans);
  }

  async getPlan(id: number): Promise<ElectricityPlan | undefined> {
    const [plan] = await db.select().from(electricityPlans).where(eq(electricityPlans.id, id));
    return plan;
  }

  async createPlan(insertPlan: InsertPlan): Promise<ElectricityPlan> {
    const [plan] = await db.insert(electricityPlans).values(insertPlan).returning();
    return plan;
  }

  async createSwitch(insertSwitch: InsertSwitch): Promise<PlanSwitch> {
    const [planSwitch] = await db.insert(planSwitches).values(insertSwitch).returning();
    return planSwitch;
  }

  async getUserSwitches(userId: number): Promise<PlanSwitch[]> {
    return await db.select().from(planSwitches).where(eq(planSwitches.userId, userId));
  }
}

export const storage = new DatabaseStorage();