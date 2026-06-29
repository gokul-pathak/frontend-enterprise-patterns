import { useQuery } from '@tanstack/react-query';
import { getConnectionStats } from '../api/usersService';

export const CONNECTION_STATS_QUERY_KEY = ['connection-stats'] as const;

export function useConnectionStats(login: string | null) {
  return useQuery({
    queryKey: [...CONNECTION_STATS_QUERY_KEY, login],
    queryFn: () => {
      if (!login) return null;
      return getConnectionStats(login);
    },
    enabled: !!login,
  });
}
