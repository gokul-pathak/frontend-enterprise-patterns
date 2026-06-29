import { useQuery } from '@tanstack/react-query';
import { getGitHubUserProfile } from '../api/usersGraphQL';

export function useGitHubProfile(login: string | null) {
  return useQuery({
    queryKey: ['github-profile', login],
    queryFn: () => getGitHubUserProfile(login!),
    enabled: Boolean(login),
    staleTime: 10 * 60 * 1000, // GitHub profiles change infrequently; 10 min stale time
  });
}
