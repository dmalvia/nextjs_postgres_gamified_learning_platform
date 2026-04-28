import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users, enrollments, progress } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { calculateLevel, calculateNextLevelPoints } from "@/lib/utils";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get Clerk user for username
    const clerkUser = await currentUser();
    const username =
      clerkUser?.username ||
      clerkUser?.firstName ||
      clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "Learner";

    // Get DB user
    const dbUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!dbUser) {
      return NextResponse.json({
        username,
        level: 1,
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        nextLevelPoints: 1000,
        coursesInProgress: 0,
        completedCourses: 0,
        totalLessonsCompleted: 0,
        todayProgress: 0,
        todayCompleted: 0,
        remainingToday: 3,
        recentActivity: [],
      });
    }

    // Get enrollments
    const allEnrollments = await db.query.enrollments.findMany({
      where: eq(enrollments.userId, dbUser.id),
    });

    const completedCourses = allEnrollments.filter((e) => e.completed).length;
    const coursesInProgress = allEnrollments.filter((e) => !e.completed).length;

    // Get completed lessons
    const completedLessons = await db.query.progress.findMany({
      where: and(eq(progress.userId, dbUser.id), eq(progress.completed, true)),
      with: {
        lesson: {
          with: {
            course: true,
          },
        },
      },
      orderBy: (progress, { desc }) => [desc(progress.completedAt)],
    });

    const totalLessonsCompleted = completedLessons.length;

    // Calculate today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCompleted = completedLessons.filter((p) => {
      if (!p.completedAt) return false;
      const completedDate = new Date(p.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;

    const dailyGoal = 3;
    const todayProgress = Math.min(
      Math.round((todayCompleted / dailyGoal) * 100),
      100,
    );
    const remainingToday = Math.max(dailyGoal - todayCompleted, 0);

    // Recent activity (last 5)
    const recentActivity = completedLessons.slice(0, 5).map((p) => ({
      id: p.id,
      title: p.lesson.title,
      courseTitle: p.lesson.course.title,
      completedAt: p.completedAt,
    }));

    const level = calculateLevel(dbUser.points);
    const nextLevelPoints = calculateNextLevelPoints(dbUser.points);

    return NextResponse.json({
      // User info
      username,
      // Stats from user/stats
      level,
      totalXP: dbUser.points,
      nextLevelPoints,
      currentStreak: dbUser.currentStreak,
      longestStreak: dbUser.longestStreak,
      totalLessonsCompleted,
      // Stats from unified
      coursesInProgress,
      completedCourses,
      // Today's progress
      todayProgress,
      todayCompleted,
      remainingToday,
      // Activity
      recentActivity,
    });
  } catch (error) {
    console.error("[UNIFIED_STATS]", error);
    return NextResponse.json({
      username: "Learner",
      level: 1,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      nextLevelPoints: 1000,
      coursesInProgress: 0,
      completedCourses: 0,
      totalLessonsCompleted: 0,
      todayProgress: 0,
      todayCompleted: 0,
      remainingToday: 3,
      recentActivity: [],
    });
  }
}
