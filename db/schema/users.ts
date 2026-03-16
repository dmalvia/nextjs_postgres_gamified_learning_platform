import {
  pgTable,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { enrollments } from "./enrollments";
import { progress } from "./progress";
import { userAchievements } from "./achievements";
import { organizationMembers } from "./organizations";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().default("gen_random_uuid()"),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull().unique(),
    name: text("name"),
    username: text("username").unique(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),

    // Gamification
    points: integer("points").default(0).notNull(),
    level: integer("level").default(1).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    longestStreak: integer("longest_streak").default(0).notNull(),
    lastActive: timestamp("last_active"),
  },
  (table) => {
    return {
      clerkIdIdx: uniqueIndex("clerk_id_idx").on(table.clerkId),
      emailIdx: uniqueIndex("email_idx").on(table.email),
      usernameIdx: uniqueIndex("username_idx").on(table.username),
    };
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  achievements: many(userAchievements),
  progress: many(progress),
  organizationMembers: many(organizationMembers),
}));
