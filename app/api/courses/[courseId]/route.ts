import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { courses, lessons, progress, users, enrollments } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }, // ← Change type to Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Await params to get courseId
    const { courseId } = await params;

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get course with lessons
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId), // ← Use courseId from awaited params
      with: {
        lessons: {
          orderBy: (lessons, { asc }) => [asc(lessons.order)],
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if user is enrolled
    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, user.id),
        eq(enrollments.courseId, courseId), // ← Use courseId from awaited params
      ),
    });

    // Get progress for each lesson if enrolled
    let lessonsWithProgress = course.lessons;
    if (enrollment) {
      const lessonIds = course.lessons.map((l) => l.id);
      const userProgress = await db.query.progress.findMany({
        where: and(
          eq(progress.userId, user.id),
          inArray(progress.lessonId, lessonIds),
        ),
      });

      lessonsWithProgress = course.lessons.map((lesson) => ({
        ...lesson,
        completed: userProgress.some(
          (p) => p.lessonId === lesson.id && p.completed,
        ),
      }));
    } else {
      lessonsWithProgress = course.lessons.map((lesson) => ({
        ...lesson,
        completed: false,
      }));
    }

    return NextResponse.json({
      ...course,
      lessons: lessonsWithProgress,
      enrolled: !!enrollment,
      completed: enrollment?.completed || false,
    });
  } catch (error) {
    console.log("[COURSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
