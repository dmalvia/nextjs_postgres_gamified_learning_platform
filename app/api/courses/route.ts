import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { courses, enrollments, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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
      return NextResponse.json([]);
    }

    // Get all courses with enrollment status
    const allCourses = await db.query.courses.findMany({
      with: {
        lessons: true,
        enrollments: {
          where: eq(enrollments.userId, user.id),
        },
      },
    });

    // Transform courses for the frontend
    const formattedCourses = allCourses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      duration: course.duration,
      points: course.points,
      totalLessons: course.lessons.length,
      enrolled: course.enrollments.length > 0,
      progress: 0, // Calculate from completed lessons if needed
    }));

    return NextResponse.json(formattedCourses);
  } catch (error) {
    console.log("[COURSES_GET]", error);
    return NextResponse.json([]);
  }
}
