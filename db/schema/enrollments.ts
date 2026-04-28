import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./users";
import { courses } from "./courses";

// Defines the "enrollments" table, linking users to courses they are enrolled in, with completion status and timestamps.
export const enrollments = pgTable(
  "enrollments",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
    completed: boolean("completed").default(false).notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => {
    return {
      uniqueEnrollment: uniqueIndex("unique_enrollment_idx").on(
        table.userId,
        table.courseId,
      ),
    };
  },
);

// Sets up the relations: an enrollment links to one user and one course.
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));
