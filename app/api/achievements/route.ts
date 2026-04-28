import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { userAchievements, users } from "@/db/schema";
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
      return new NextResponse("User not found", { status: 404 });
    }

    // Get all achievements with earned status
    const allAchievements = await db.query.achievements.findMany();

    const userAchievementsList = await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, user.id),
    });

    const earnedAchievementIds = new Set(
      userAchievementsList.map((ua) => ua.achievementId),
    );

    const achievementsWithStatus = allAchievements.map((achievement) => ({
      ...achievement,
      earned: earnedAchievementIds.has(achievement.id),
      earnedAt: userAchievementsList.find(
        (ua) => ua.achievementId === achievement.id,
      )?.earnedAt,
    }));

    return NextResponse.json(achievementsWithStatus);
  } catch (error) {
    console.log("[ACHIEVEMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
