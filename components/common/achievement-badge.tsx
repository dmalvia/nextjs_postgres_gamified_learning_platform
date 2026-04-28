import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  className?: string;
}

export function AchievementBadge({
  name,
  description,
  icon,
  earned,
  earnedAt,
  className,
}: AchievementBadgeProps) {
  return (
    <Card
      className={cn(
        "p-4 flex items-center gap-4 transition-all",
        earned
          ? "bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          : "opacity-50",
        className,
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
          earned
            ? "bg-linear-to-br from-yellow-400 to-orange-400"
            : "bg-gray-200 dark:bg-gray-800",
        )}
      >
        {icon}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        {earned && earnedAt && (
          <p className="text-xs text-gray-400 mt-1">
            Earned on {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {earned && <Award className="h-5 w-5 text-yellow-500" />}
    </Card>
  );
}
