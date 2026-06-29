import { QueryClient } from '@tanstack/react-query';

/**
 * Global React Query client configuration.
 *
 * staleTime 60s: Most of our data (user list, dashboard stats) changes infrequently.
 * Treating data as fresh for 60s eliminates redundant refetches on tab focus or
 * component remounts without sacrificing correctness.
 *
 * gcTime 5min: Keeps unused cache entries around long enough to serve instant
 * navigation back to previously visited pages.
 *
 * retry: false on 4xx — these are usually auth or validation errors.
 * The server won't return a different result on retry.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        // Don't retry client errors (4xx)
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
