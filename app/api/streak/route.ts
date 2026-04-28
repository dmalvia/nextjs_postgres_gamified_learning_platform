import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ currentStreak: 0, longestStreak: 0 });
    }

    // Calculate streak based on completed lessons
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all completed lessons
    const { progress } = await import("@/db/schema");
    const completedLessons = await db.query.progress.findMany({
      where: (progress, { eq, and }) =>
        and(eq(progress.userId, user.id), eq(progress.completed, true)),
    });

    // Get unique dates when lessons were completed
    const completedDates = new Set<string>();
    completedLessons.forEach((lesson) => {
      if (lesson.completedAt) {
        const date = new Date(lesson.completedAt);
        date.setHours(0, 0, 0, 0);
        completedDates.add(date.toISOString());
      }
    });

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString();
      if (completedDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Update user's streak in database
    if (currentStreak !== user.currentStreak) {
      await db
        .update(users)
        .set({
          currentStreak: currentStreak,
          longestStreak: Math.max(currentStreak, user.longestStreak),
        })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({
      currentStreak,
      longestStreak: Math.max(currentStreak, user.longestStreak),
    });
  } catch (error) {
    console.log("[STREAK_GET]", error);
    return NextResponse.json({ currentStreak: 0, longestStreak: 0 });
  }
}
