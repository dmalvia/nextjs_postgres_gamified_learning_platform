"use client";

// This file defines a React provider
// component that sets up a React Query client
// for the app, configures default query options,
// and automatically clears cached queries
// when the authenticated user changes.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: true,
            refetchOnMount: true,
          },
        },
      }),
  );

  // Clear cache when user changes
  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries();
      queryClient.clear();
    }
  }, [user?.id, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
