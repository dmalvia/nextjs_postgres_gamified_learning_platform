"use client";

import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCard } from "@/components/common/course-card";

export default function CoursesPage() {
  const [search, setSearch] = useState("");

  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      return res.json();
    },
  });

  const filteredCourses = courses?.filter((course: any) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Explore Courses</h1>
        <p className="text-gray-500 mt-1">
          Discover courses and start learning today
        </p>
      </div>

      {/* Search Bar Only - No Filter Button */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Search courses..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-500">
              Failed to load courses. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </CardContent>
        </Card>
      ) : filteredCourses?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No courses found</p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Clear Search
              </button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing {filteredCourses.length} course
            {filteredCourses.length !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course: any) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
