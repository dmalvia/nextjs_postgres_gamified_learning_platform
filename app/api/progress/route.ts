import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import {
  users,
  progress,
  lessons,
  courses,
  userAchievements,
  enrollments,
} from "@/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// Function to check and award achievements
async function checkAndAwardAchievements(userId: string) {
  console.log(`🏆 Checking achievements for user ${userId}`);

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return;

  // Get total lessons completed
  const completedLessonsResult = await db
    .select({ count: count() })
    .from(progress)
    .where(and(eq(progress.userId, userId), eq(progress.completed, true)));

  const lessonsCompleted = completedLessonsResult[0]?.count || 0;
  console.log(`📚 Lessons completed: ${lessonsCompleted}`);

  // Get completed courses
  const completedCoursesResult = await db
    .select({ count: count() })
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, userId), eq(enrollments.completed, true)),
    );

  const coursesCompleted = completedCoursesResult[0]?.count || 0;
  console.log(`🎓 Courses completed: ${coursesCompleted}`);

  // Get all achievements
  const allAchievements = await db.query.achievements.findMany();

  // Get already earned achievements
  const earnedAchievements = await db.query.userAchievements.findMany({
    where: eq(userAchievements.userId, userId),
  });

  const earnedIds = new Set(earnedAchievements.map((ea) => ea.achievementId));

  // Check each achievement
  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue;

    let shouldAward = false;
    const criteria = achievement.criteria as any;

    switch (criteria.type) {
      case "lessons_completed":
        if (lessonsCompleted >= criteria.count) {
          shouldAward = true;
          console.log(
            `✅ Achievement "${achievement.name}" earned! (${lessonsCompleted}/${criteria.count} lessons)`,
          );
        }
        break;
      case "courses_completed":
        if (coursesCompleted >= criteria.count) {
          shouldAward = true;
          console.log(
            `✅ Achievement "${achievement.name}" earned! (${coursesCompleted}/${criteria.count} courses)`,
          );
        }
        break;
      case "streak":
        if (user.currentStreak >= criteria.days) {
          shouldAward = true;
          console.log(
            `✅ Achievement "${achievement.name}" earned! (${user.currentStreak}/${criteria.days} days streak)`,
          );
        }
        break;
    }

    if (shouldAward) {
      await db.insert(userAchievements).values({
        userId: userId,
        achievementId: achievement.id,
        earnedAt: new Date(),
      });

      // Award achievement points
      await db
        .update(users)
        .set({
          points: sql`${users.points} + ${achievement.points}`,
        })
        .where(eq(users.id, userId));

      console.log(
        `🏆 Achievement unlocked: ${achievement.name} (+${achievement.points} XP)`,
      );
    }
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { lessonId, completed } = body;

    // Get user from database
    let user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get the lesson
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
    });

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 });
    }

    // Auto-enroll user
    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, user.id),
        eq(enrollments.courseId, lesson.courseId),
      ),
    });

    if (!existingEnrollment) {
      await db.insert(enrollments).values({
        userId: user.id,
        courseId: lesson.courseId,
        enrolledAt: new Date(),
        completed: false,
      });
    }

    // Update or create progress
    const existingProgress = await db.query.progress.findFirst({
      where: and(eq(progress.userId, user.id), eq(progress.lessonId, lessonId)),
    });

    if (existingProgress) {
      await db
        .update(progress)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
        })
        .where(
          and(eq(progress.userId, user.id), eq(progress.lessonId, lessonId)),
        );
    } else {
      await db.insert(progress).values({
        userId: user.id,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      });
    }

    // If lesson completed, award points, update streak, and check achievements
    if (completed) {
      // Award points
      const courseWithLessons = await db.query.courses.findFirst({
        where: eq(courses.id, lesson.courseId),
        with: {
          lessons: true,
        },
      });

      if (courseWithLessons) {
        const pointsPerLesson = Math.floor(
          courseWithLessons.points / courseWithLessons.lessons.length,
        );

        await db
          .update(users)
          .set({
            points: sql`${users.points} + ${pointsPerLesson}`,
          })
          .where(eq(users.id, user.id));

        console.log(`💰 Awarded ${pointsPerLesson} XP for completing lesson`);
      }

      // Update streak
      await updateUserStreak(user.id);

      // Check achievements
      await checkAndAwardAchievements(user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[PROGRESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function updateUserStreak(userId: string) {
  const completedLessons = await db.query.progress.findMany({
    where: and(eq(progress.userId, userId), eq(progress.completed, true)),
    orderBy: (progress, { desc }) => [desc(progress.completedAt)],
  });

  if (completedLessons.length === 0) return;

  // Get unique completion dates
  const uniqueDates = new Set<string>();
  completedLessons.forEach((lesson) => {
    if (lesson.completedAt) {
      const date = new Date(lesson.completedAt);
      date.setHours(0, 0, 0, 0);
      uniqueDates.add(date.toISOString());
    }
  });

  const sortedDates = Array.from(uniqueDates).sort().reverse();

  // Calculate streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastActivityDate = new Date(sortedDates[0]);
  lastActivityDate.setHours(0, 0, 0, 0);

  if (lastActivityDate >= yesterday) {
    streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diffDays =
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  await db
    .update(users)
    .set({
      currentStreak: streak,
      longestStreak: sql`GREATEST(${users.longestStreak}, ${streak})`,
      lastActive: new Date(),
    })
    .where(eq(users.id, userId));

  console.log(`🔥 Streak updated to ${streak} days`);
}
