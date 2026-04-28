import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  duration: number;
  progress?: number;
  points: number;
}

export function CourseCard({
  id,
  title,
  description,
  thumbnail,
  duration,
  progress = 0,
  points,
}: CourseCardProps) {
  // Default thumbnail if none provided
  const imageUrl =
    thumbnail && !thumbnail.includes("example.com")
      ? thumbnail
      : "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop";

  return (
    <Link href={`/courses/${id}`}>
      <Card
        className={cn(
          "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden",
          "p-0", // Remove all padding from Card
        )}
      >
        {/* Image Container - Fixed aspect ratio, no extra padding */}
        <div className="relative w-full aspect-video overflow-hidden bg-linear-to-br from-purple-600 to-indigo-600">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Optional: Add a subtle overlay for better text contrast if needed */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
            {description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{points} XP</span>
            </div>
          </div>
        </CardContent>

        {progress > 0 && (
          <CardFooter className="p-4 pt-0">
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="text-purple-600 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
