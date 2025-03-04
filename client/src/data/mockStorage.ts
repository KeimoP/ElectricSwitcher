
// Mock data for client-side use on GitHub Pages
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { insertUserSchema, insertSwitchSchema } from '../../shared/schema';

// Types
type User = z.infer<typeof insertUserSchema> & { id: number };
type Plan = { id: number; provider: string; name: string; price: number; description: string };
type Switch = z.infer<typeof insertSwitchSchema> & { id: number };

// Mock data store
const mockUsers: User[] = [
  {
    id: 1,
    username: "demo",
    name: "Demo User",
    personalCode: "38501234567",
    email: "demo@example.com",
    address: "123 Demo St"
  }
];

const mockPlans: Plan[] = [
  {
    id: 1,
    provider: "Eesti Energia",
    name: "Fixed Rate Plan",
    price: 0.15,
    description: "Stable electricity price for 12 months"
  },
  {
    id: 2,
    provider: "Eesti Energia",
    name: "Variable Rate Plan",
    price: 0.12,
    description: "Price changes with the market, potential for savings"
  },
  {
    id: 3,
    provider: "Elektrum",
    name: "Green Energy Plan",
    price: 0.16,
    description: "100% renewable energy sources"
  }
];

const mockSwitches: Switch[] = [];

// Session management (simplified for GitHub Pages)
let currentUserId: number | null = null;

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockStorage = {
  // Auth functions
  async getUserByPersonalCode(personalCode: string): Promise<User | null> {
    await delay(1000); // Simulate network latency
    return mockUsers.find(user => user.personalCode === personalCode) || null;
  },

  async loginUser(id: number): Promise<void> {
    currentUserId = id;
  },

  async logoutUser(): Promise<void> {
    currentUserId = null;
  },

  async getCurrentUserId(): Promise<number | null> {
    return currentUserId;
  },

  // User functions
  async getUser(id: number): Promise<User | null> {
    await delay(500);
    return mockUsers.find(user => user.id === id) || null;
  },

  async createUser(userData: z.infer<typeof insertUserSchema>): Promise<User> {
    await delay(800);
    const newUser = {
      ...userData,
      id: mockUsers.length + 1,
    };
    mockUsers.push(newUser);
    currentUserId = newUser.id;
    return newUser;
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await delay(700);
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  },

  // Plan functions
  async getPlans(): Promise<Plan[]> {
    await delay(800);
    return [...mockPlans];
  },

  // Switch functions
  async createSwitch(switchData: z.infer<typeof insertSwitchSchema>): Promise<Switch> {
    await delay(1000);
    const newSwitch = {
      ...switchData,
      id: mockSwitches.length + 1,
    };
    mockSwitches.push(newSwitch);
    return newSwitch;
  },

  async getUserSwitches(userId: number): Promise<Switch[]> {
    await delay(700);
    return mockSwitches.filter(s => s.userId === userId);
  }
};
