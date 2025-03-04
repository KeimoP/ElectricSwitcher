import { users, electricityPlans, planSwitches } from "@shared/schema";
import type { User, ElectricityPlan, PlanSwitch, InsertUser, InsertPlan, InsertSwitch } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plans: Map<number, ElectricityPlan>;
  private switches: Map<number, PlanSwitch>;
  private currentId: { users: number; plans: number; switches: number };

  constructor() {
    this.users = new Map();
    this.plans = new Map();
    this.switches = new Map();
    this.currentId = { users: 1, plans: 1, switches: 1 };
    
    // Add some sample electricity plans
    const samplePlans: InsertPlan[] = [
      {
        provider: "Eesti Energia",
        name: "Fixed Basic",
        pricePerKwh: 0.14,
        contractLength: 12,
        fixedFee: 2.99,
        greenEnergy: false
      },
      {
        provider: "Elektrum",
        name: "Green Plus",
        pricePerKwh: 0.152,
        contractLength: 24,
        fixedFee: 1.99,
        greenEnergy: true
      },
      {
        provider: "220 Energia",
        name: "Flexible Start",
        pricePerKwh: 0.138,
        contractLength: 6,
        fixedFee: 3.49,
        greenEnergy: false
      }
    ];
    
    samplePlans.forEach(plan => this.createPlan(plan));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPersonalCode(code: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.personalCode === code);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, isSubscribed: false };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getPlans(): Promise<ElectricityPlan[]> {
    return Array.from(this.plans.values());
  }

  async getPlan(id: number): Promise<ElectricityPlan | undefined> {
    return this.plans.get(id);
  }

  async createPlan(insertPlan: InsertPlan): Promise<ElectricityPlan> {
    const id = this.currentId.plans++;
    const plan: ElectricityPlan = { ...insertPlan, id };
    this.plans.set(id, plan);
    return plan;
  }

  async createSwitch(insertSwitch: InsertSwitch): Promise<PlanSwitch> {
    const id = this.currentId.switches++;
    const planSwitch: PlanSwitch = { ...insertSwitch, id };
    this.switches.set(id, planSwitch);
    return planSwitch;
  }

  async getUserSwitches(userId: number): Promise<PlanSwitch[]> {
    return Array.from(this.switches.values()).filter(s => s.userId === userId);
  }
}

export const storage = new MemStorage();
