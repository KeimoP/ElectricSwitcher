import { pgTable, text, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  personalCode: text("personal_code").notNull(),
  currentProvider: text("current_provider"),
  currentPrice: numeric("current_price", { precision: 10, scale: 4 }),
  isSubscribed: boolean("is_subscribed").default(false),
});

export const electricityPlans = pgTable("electricity_plans", {
  id: serial("id").primaryKey(),
  provider: text("provider").notNull(),
  name: text("name").notNull(),
  pricePerKwh: numeric("price_per_kwh", { precision: 10, scale: 4 }).notNull(),
  contractLength: integer("contract_length").notNull(), // months
  fixedFee: numeric("fixed_fee", { precision: 10, scale: 2 }).notNull(),
  greenEnergy: boolean("green_energy").default(false),
});

export const planSwitches = pgTable("plan_switches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  fromPlanId: integer("from_plan_id").notNull(),
  toPlanId: integer("to_plan_id").notNull(),
  requestedAt: timestamp("requested_at").notNull(),
  status: text("status").notNull(), // pending, completed, failed
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, isSubscribed: true })
  .extend({
    personalCode: z.string().length(11),
    name: z.string().min(2),
  });

export const insertPlanSchema = createInsertSchema(electricityPlans).omit({ id: true });
export const insertSwitchSchema = createInsertSchema(planSwitches).omit({ id: true });

export type User = typeof users.$inferSelect;
export type ElectricityPlan = typeof electricityPlans.$inferSelect;
export type PlanSwitch = typeof planSwitches.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type InsertSwitch = z.infer<typeof insertSwitchSchema>;