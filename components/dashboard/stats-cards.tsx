import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Award, Flame, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalCourses?: number;
    completedCourses?: number;
    currentStreak?: number;
    points?: number;
    level?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Courses in Progress",
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Completed",
      value: stats?.completedCourses || 0,
      icon: Award,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Current Streak",
      value: `${stats?.currentStreak || 0} days`,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Total XP",
      value: stats?.points?.toLocaleString() || "0",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
