import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { lessons } from "./lessons";

export const progress = pgTable(
  "progress",
  {
    id: text("id").primaryKey().default("gen_random_uuid()"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    completed: boolean("completed").default(false).notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => {
    return {
      uniqueProgress: uniqueIndex("unique_progress_idx").on(
        table.userId,
        table.lessonId,
      ),
    };
  },
);

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [progress.lessonId],
    references: [lessons.id],
  }),
}));
