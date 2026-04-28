import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get current user
    const currentUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, userId),
    });

    // Get top 100 users by points
    const leaderboardEntries = await db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        points: true,
        level: true,
        currentStreak: true,
      },
      orderBy: [desc(users.points)],
      limit: 100,
    });

    // Add rank to each entry
    const entriesWithRank = leaderboardEntries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    // Find current user's rank
    let userRank = null;
    let userPoints = 0;
    let userLevel = 1;
    let userStreak = 0;

    if (currentUser) {
      userRank = entriesWithRank.findIndex((e) => e.id === currentUser.id) + 1;
      userPoints = currentUser.points;
      userLevel = currentUser.level;
      userStreak = currentUser.currentStreak;
    }

    return NextResponse.json({
      entries: entriesWithRank,
      userRank: userRank || null,
      userPoints,
      userLevel,
      userStreak,
      totalUsers: leaderboardEntries.length,
    });
  } catch (error) {
    console.error("[LEADERBOARD_GET]", error);
    return NextResponse.json({
      entries: [],
      userRank: null,
      userPoints: 0,
      userLevel: 1,
      userStreak: 0,
    });
  }
}
