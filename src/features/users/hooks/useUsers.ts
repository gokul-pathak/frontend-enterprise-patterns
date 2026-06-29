import { useQuery } from '@tanstack/react-query';
import { getUsers, type UsersQueryParams } from '../api/usersService';

export const usersQueryKey = (params: UsersQueryParams) => ['users', params] as const;

export function useUsers(params: UsersQueryParams) {
  return useQuery({
    queryKey: usersQueryKey(params),
    queryFn: () => getUsers(params),
    placeholderData: (prev) => prev, // Keep old data visible while new page loads
  });
}
