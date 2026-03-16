import { achievements } from "./schema/achievements";
import { courses } from "./schema/courses";
import { lessons } from "./schema/lessons";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seed() {
  console.log("Seeding database...");

  // Insert achievements
  await db
    .insert(achievements)
    .values([
      {
        name: "First Steps",
        description: "Complete your first lesson",
        icon: "🚀",
        points: 50,
        criteria: { type: "lessons_completed", count: 1 },
      },
      {
        name: "Quick Learner",
        description: "Complete 5 lessons",
        icon: "📚",
        points: 100,
        criteria: { type: "lessons_completed", count: 5 },
      },
      {
        name: "Course Master",
        description: "Complete your first course",
        icon: "🎓",
        points: 200,
        criteria: { type: "courses_completed", count: 1 },
      },
      {
        name: "Streak Starter",
        description: "Maintain a 7-day streak",
        icon: "🔥",
        points: 150,
        criteria: { type: "streak", days: 7 },
      },
      {
        name: "Social Butterfly",
        description: "Join an organization",
        icon: "🦋",
        points: 75,
        criteria: { type: "join_organization" },
      },
    ])
    .onConflictDoNothing();

  // Insert courses with lessons
  const webDevCourse = await db
    .insert(courses)
    .values({
      title: "Web Development Fundamentals",
      description: "Learn the basics of HTML, CSS, and JavaScript",
      difficulty: "beginner",
      duration: 120,
      points: 500,
    })
    .returning();

  await db.insert(lessons).values([
    {
      title: "Introduction to HTML",
      content: "Learn the structure of web pages...",
      order: 1,
      courseId: webDevCourse[0].id,
    },
    {
      title: "Styling with CSS",
      content: "Make your pages beautiful...",
      order: 2,
      courseId: webDevCourse[0].id,
    },
    {
      title: "JavaScript Basics",
      content: "Add interactivity to your sites...",
      order: 3,
      courseId: webDevCourse[0].id,
    },
  ]);

  const reactCourse = await db
    .insert(courses)
    .values({
      title: "React.js Essentials",
      description: "Build modern web applications with React",
      difficulty: "intermediate",
      duration: 180,
      points: 750,
    })
    .returning();

  await db.insert(lessons).values([
    {
      title: "React Components",
      content: "Understanding component-based architecture...",
      order: 1,
      courseId: reactCourse[0].id,
    },
    {
      title: "State and Props",
      content: "Managing data in React...",
      order: 2,
      courseId: reactCourse[0].id,
    },
    {
      title: "Hooks Deep Dive",
      content: "Master React hooks...",
      order: 3,
      courseId: reactCourse[0].id,
    },
    {
      title: "Routing with React Router",
      content: "Navigate between pages...",
      order: 4,
      courseId: reactCourse[0].id,
    },
  ]);

  console.log("Seeding complete!");
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
