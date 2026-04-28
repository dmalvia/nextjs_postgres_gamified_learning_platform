// Schema definition for achievements and user_achievements tables, and their relations.
// Each export is documented below.
import {
  pgTable,
  text,
  integer,
  timestamp,
  json,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users";

// Defines the "achievements" table, storing achievement details
// like name, description, icon, points, and criteria.
export const achievements = pgTable("achievements", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  points: integer("points").default(50).notNull(),
  criteria: json("criteria").notNull(),
});

// Defines the "user_achievements" table, linking users to achievements
// they've earned, with timestamps and uniqueness constraint.
export const userAchievements = pgTable(
  "user_achievements",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
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

// Sets up the relation: one achievement can be earned by many users (userAchievements).
export const achievementsRelations = relations(achievements, ({ many }) => ({
  users: many(userAchievements),
}));

// Sets up the relation: a user_achievement links to one user and one achievement.
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
