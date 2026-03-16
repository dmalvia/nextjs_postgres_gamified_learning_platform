import {
  pgTable,
  text,
  integer,
  timestamp,
  json,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const achievements = pgTable("achievements", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  points: integer("points").default(50).notNull(),
  criteria: json("criteria").notNull(),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: text("id").primaryKey().default("gen_random_uuid()"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: text("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueUserAchievement: uniqueIndex("unique_user_achievement_idx").on(
        table.userId,
        table.achievementId,
      ),
    };
  },
);

export const achievementsRelations = relations(achievements, ({ many }) => ({
  users: many(userAchievements),
}));

export const userAchievementsRelations = relations(
  userAchievements,
  ({ one }) => ({
    user: one(users, {
      fields: [userAchievements.userId],
      references: [users.id],
    }),
    achievement: one(achievements, {
      fields: [userAchievements.achievementId],
      references: [achievements.id],
    }),
  }),
);
