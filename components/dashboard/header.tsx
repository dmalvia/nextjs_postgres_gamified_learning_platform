"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Flame, Award } from "lucide-react";
import { useState, useEffect } from "react";

export function DashboardHeader() {
  const { user } = useUser();

  // Don't use localStorage during SSR - only on client
  const [cachedStats, setCachedStats] = useState(null);

  // Load cached stats only on client side after mount
  useEffect(() => {
    const saved = localStorage.getItem("userStats");
    if (saved) {
      setCachedStats(JSON.parse(saved));
    }
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["stats", user?.id],
    queryFn: async () => {
      const res = await fetch("/api/user/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      localStorage.setItem("userStats", JSON.stringify(data));
      return data;
    },
    enabled: !!user,
    staleTime: 30000,
  });

  // Use stats from API, fallback to cached, then default values
  const displayStats = stats || cachedStats;
  const displayName =
    user?.username ||
    user?.firstName ||
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "Learner";

  // Default values that match what server would render
  const currentStreak = displayStats?.currentStreak ?? 0;
  const totalXP = displayStats?.totalXP ?? 0;
  const level = displayStats?.level ?? 1;

  return (
    <header className="bg-white dark:bg-gray-900 border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Hello, {displayName}! 👋</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Keep learning, keep growing
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Streak */}
          <div className="flex items-center gap-2">
            <Flame
              className={`h-5 w-5 ${currentStreak > 0 ? "text-orange-500" : "text-gray-400"}`}
            />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Current Streak</span>
              <span className="text-sm font-semibold">
                {currentStreak} day{currentStreak !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full">
            <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              {totalXP.toLocaleString()} XP
            </span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Level {level}
            </span>
          </div>

          {/* User Button */}
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
                userButtonTrigger:
                  "hover:ring-2 hover:ring-purple-500 hover:ring-offset-2 transition-all rounded-full",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
