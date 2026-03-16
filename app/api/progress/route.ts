import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users, progress, lessons, courses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { lessonId, completed } = body;

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update progress
    const existingProgress = await db.query.progress.findFirst({
      where: and(eq(progress.userId, user.id), eq(progress.lessonId, lessonId)),
    });

    let result;
    if (existingProgress) {
      result = await db
        .update(progress)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
        })
        .where(
          and(eq(progress.userId, user.id), eq(progress.lessonId, lessonId)),
        )
        .returning();
    } else {
      result = await db
        .insert(progress)
        .values({
          userId: user.id,
          lessonId,
          completed,
          completedAt: completed ? new Date() : null,
        })
        .returning();
    }

    // If lesson completed, award points
    if (completed) {
      const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
          course: true,
        },
      });

      if (lesson?.course) {
        const pointsPerLesson =
          lesson.course.points /
          (
            await db.query.lessons.findMany({
              where: eq(lessons.courseId, lesson.course.id),
            })
          ).length;

        await db
          .update(users)
          .set({
            points: sql`${users.points} + ${pointsPerLesson}`,
          })
          .where(eq(users.id, user.id));
      }
    }

    return NextResponse.json(result[0] || result);
  } catch (error) {
    console.log("[PROGRESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
