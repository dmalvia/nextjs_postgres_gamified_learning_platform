import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
  className?: string;
}

export function StreakDisplay({ streak, className }: StreakDisplayProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <div className="relative">
        <Flame
          className={`h-5 w-5 ${streak > 0 ? "text-orange-500" : "text-gray-400"}`}
        />
        {streak > 0 && (
          <span className="absolute -top-2 -right-2 text-xs font-bold text-orange-500">
            {streak}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Current Streak</span>
        <span className="text-sm font-semibold">
          {streak} day{streak !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
