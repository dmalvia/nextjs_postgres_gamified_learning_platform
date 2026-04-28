import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max,
  className,
  showLabel,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("relative", className)}>
      <Progress value={percentage} className="h-2" />
      {showLabel && (
        <span className="absolute -top-6 right-0 text-xs text-gray-500">
          {value}/{max} XP
        </span>
      )}
    </div>
  );
}
