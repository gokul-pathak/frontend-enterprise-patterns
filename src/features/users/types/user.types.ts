export interface GitHubConnection {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
}

export interface GitHubUserStats {
  pullRequests: number;
  commits: number;
  issues: number;
}

export type ConnectionType = 'followers' | 'following';
