"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Flame, Calendar, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoaded: isUserLoaded } = useUser();

  // Sync user mutation
  const syncUserMutation = useMutation({
    mutationFn: async () => {
      console.log("🔄 Syncing user...");
      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to sync user");
      const data = await res.json();
      console.log("✅ User synced:", data);
      return data;
    },
  });

  const {
    data: stats,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["stats", user?.id],
    queryFn: async () => {
      console.log("📊 Fetching user stats...");
      const res = await fetch("/api/user/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: isUserLoaded && !!user,
  });

  // Sync user when component mounts or user changes
  useEffect(() => {
    if (isUserLoaded && user) {
      // First sync the user to database
      syncUserMutation.mutate(undefined, {
        onSuccess: () => {
          // Then fetch stats
          refetch();
        },
      });
    }
  }, [isUserLoaded, user?.id]);

  // Show loading state immediately to avoid white screen
  if (!isUserLoaded || isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-32 bg-white/20 rounded mt-2 animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName =
    stats?.username || user?.username || user?.firstName || "Learner";

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold">Welcome back, {displayName}! 👋</h1>
        <p className="text-purple-100 mt-1">
          Level {stats?.level || 1} · {stats?.totalXP?.toLocaleString() || 0} XP
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total XP</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats?.totalXP?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Badge variant="outline" className="mt-2">
              Level {stats?.level || 1}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Courses</p>
                <p className="text-3xl font-bold">
                  {stats?.coursesInProgress || 0}
                </p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {stats?.completedCourses > 0 && (
              <p className="text-xs text-green-600 mt-2">
                {stats.completedCourses} completed
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats?.currentStreak || 0}
                </p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today's Goal</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.todayCompleted || 0}/3
                </p>
                <p className="text-xs text-gray-500">lessons</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={stats?.todayProgress || 0} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentActivity.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {activity.courseTitle}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.completedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No activity yet</p>
              <p className="text-sm">Complete a lesson to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
