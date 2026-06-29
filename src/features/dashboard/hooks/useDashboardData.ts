import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../api/dashboardService';

export const DASHBOARD_QUERY_KEY = ['dashboard'] as const;

/**
 * Dashboard data refreshes every 5 minutes in the background.
 * refetchInterval is more appropriate than manual invalidation here
 * because dashboard stats change continuously, not in response to user actions.
 */
export function useDashboardData() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardData,
    refetchInterval: 5 * 60 * 1000,
  });
}
