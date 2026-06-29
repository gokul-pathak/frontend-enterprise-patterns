import { useQuery } from '@tanstack/react-query';
import { getConnections, type ConnectionsQueryParams } from '../api/usersService';

export const USERS_QUERY_KEY = ['connections'] as const;

export function useConnections(params: ConnectionsQueryParams) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => getConnections(params),
    placeholderData: (prev) => prev,
  });
}
