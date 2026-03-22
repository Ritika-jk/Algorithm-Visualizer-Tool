import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProgressTable = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  algorithmId: text("algorithm_id").notNull(),
  sessionId: text("session_id").notNull(),
  completedSteps: integer("completed_steps").notNull().default(0),
  totalSteps: integer("total_steps").notNull().default(0),
  timeSpentSeconds: integer("time_spent_seconds").notNull().default(0),
  lastVisited: timestamp("last_visited").notNull().defaultNow(),
});

export const insertUserProgressSchema = createInsertSchema(userProgressTable).omit({ id: true });
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgressTable.$inferSelect;
