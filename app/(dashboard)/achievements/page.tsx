"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Lock, CheckCircle } from "lucide-react";
import { AchievementBadge } from "@/components/common/achievement-badge";
import { AchievementsSkeleton } from "@/lib/skeleton";

export default function AchievementsPage() {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements");
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    },
  });

  const earnedCount = achievements?.filter((a: any) => a.earned).length || 0;
  const totalCount = achievements?.length || 0;
  const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  const earnedAchievements = achievements?.filter((a: any) => a.earned) || [];
  const lockedAchievements = achievements?.filter((a: any) => !a.earned) || [];

  if (isLoading) {
    return <AchievementsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-gray-500 mt-1">
          Track your milestones and accomplishments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{earnedCount}</p>
              <p className="text-sm text-gray-500">Earned</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-2xl font-bold">{lockedAchievements.length}</p>
              <p className="text-sm text-gray-500">Locked</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{progress.toFixed(0)}%</p>
              <p className="text-sm text-gray-500">Completion</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <span className="text-2xl font-bold text-purple-600 mb-2 block">
                {achievements?.reduce(
                  (acc: number, a: any) => acc + (a.earned ? a.points : 0),
                  0,
                )}
              </span>
              <p className="text-sm text-gray-500">
                Total XP from achievements
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {earnedCount}/{totalCount} Achievements
            </span>
            <span className="text-sm text-gray-500">
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Achievements</TabsTrigger>
          <TabsTrigger value="earned">Earned ({earnedCount})</TabsTrigger>
          <TabsTrigger value="locked">
            Locked ({lockedAchievements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2">
            {achievements?.map((achievement: any) => (
              <AchievementBadge key={achievement.id} {...achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earned">
          <div className="grid gap-4 md:grid-cols-2">
            {earnedAchievements.map((achievement: any) => (
              <AchievementBadge key={achievement.id} {...achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="locked">
          <div className="grid gap-4 md:grid-cols-2">
            {lockedAchievements.map((achievement: any) => (
              <AchievementBadge key={achievement.id} {...achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
