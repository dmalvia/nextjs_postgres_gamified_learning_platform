import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge classes for Shadcn UI
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Level calculations
export function calculateLevel(points: number): number {
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

export function calculateNextLevelPoints(points: number): number {
  const currentLevel = calculateLevel(points);
  const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
  return nextLevelPoints;
}

// Date formatting
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
