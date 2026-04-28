"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, CheckCircle } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  onEnrollChange?: (enrolled: boolean) => void;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function EnrollButton({
  courseId,
  isEnrolled: initialEnrolled,
  onEnrollChange,
  variant = "default",
  size = "default",
}: EnrollButtonProps) {
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsEnrolled(true);
        onEnrollChange?.(true);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to enroll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnenroll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsEnrolled(false);
        onEnrollChange?.(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to unenroll:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        onClick={handleUnenroll}
        disabled={isLoading}
        variant="outline"
        size={size}
        className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        Enrolled
      </Button>
    );
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={isLoading}
      variant={variant}
      size={size}
      className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <BookOpen className="h-4 w-4 mr-2" />
      )}
      Enroll Now
    </Button>
  );
}
