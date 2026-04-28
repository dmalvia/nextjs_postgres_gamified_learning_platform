import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { courses } from "./courses";
import { progress } from "./progress";

// Defines the "lessons" table, storing lesson details
// like title, content, video URL, order, and course association.
export const lessons = pgTable("lessons", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  videoUrl: text("video_url"), // Add this field for YouTube URLs
  order: integer("order").notNull(),
  courseId: text("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sets up the relations: a lesson belongs
// to one course and can have many progress records.
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  progress: many(progress),
}));
