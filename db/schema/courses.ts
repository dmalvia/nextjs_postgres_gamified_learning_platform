import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { lessons } from "./lessons";
import { enrollments } from "./enrollments";

export const courses = pgTable("courses", {
  id: text("id").primaryKey().default("gen_random_uuid()"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail"),
  difficulty: text("difficulty").default("beginner").notNull(),
  duration: integer("duration").notNull(),
  points: integer("points").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  lessons: many(lessons),
  enrollments: many(enrollments),
}));
