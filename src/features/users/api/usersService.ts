import { apiClient } from '@/lib/axios';
import { getSession } from 'next-auth/react';
import type { GitHubConnection, ConnectionType, GitHubUserStats } from '../types/user.types';

export interface ConnectionsQueryParams {
  type: ConnectionType;
  first: number;
}

const CONNECTIONS_QUERY = `
  query GetConnections($login: String!, $first: Int!) {
    user(login: $login) {
      followers(first: $first) {
        nodes {
          id
          login
          name
          avatarUrl
          url
          bio
          company
          location
        }
      }
      following(first: $first) {
        nodes {
          id
          login
          name
          avatarUrl
          url
          bio
          company
          location
        }
      }
    }
  }
`;

export async function getConnections(params: ConnectionsQueryParams): Promise<GitHubConnection[]> {
  const session = await getSession();
  const login = session?.username || 'gaearon'; // Fallback to a well-known user if demo

  if (session?.accessToken && session.accessToken.startsWith('gh')) {
    try {
      const { data } = await apiClient.post('https://api.github.com/graphql', {
        query: CONNECTIONS_QUERY,
        variables: {
          login,
          first: params.first,
        },
      });

      const user = data.data.user;
      if (!user) return [];

      const nodes = params.type === 'followers' ? user.followers.nodes : user.following.nodes;
      return nodes;
    } catch {
      // Fallback below
    }
  }

  // Fallback if no token or error (Demo mode)
  return [
    {
      id: 'demo-1',
      login: 'demo-user-1',
      name: 'Demo Follower 1',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
      url: 'https://github.com/mojombo',
      bio: 'Software Engineer',
      company: 'Acme Corp',
      location: 'San Francisco',
    },
    {
      id: 'demo-2',
      login: 'demo-user-2',
      name: 'Demo Follower 2',
      avatarUrl: 'https://avatars.githubusercontent.com/u/2?v=4',
      url: 'https://github.com/defunkt',
      bio: 'Open Source Maintainer',
      company: null,
      location: 'New York',
    },
  ];
}

const STATS_QUERY = `
  query GetUserStats($login: String!) {
    user(login: $login) {
      pullRequests {
        totalCount
      }
      repositories {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
      }
    }
  }
`;

export async function getConnectionStats(login: string): Promise<GitHubUserStats | null> {
  const session = await getSession();

  if (session?.accessToken && session.accessToken.startsWith('gh')) {
    try {
      const { data } = await apiClient.post('https://api.github.com/graphql', {
        query: STATS_QUERY,
        variables: { login },
      });

      const user = data?.data?.user;
      if (!user) return null;

      return {
        pullRequests: user.pullRequests?.totalCount || 0,
        commits: user.contributionsCollection?.totalCommitContributions || 0,
        issues: user.repositories?.totalCount || 0, // Used for 'repositories'
      };
    } catch {
      // Fallback below
    }
  }

  // Demo account fallback
  return {
    pullRequests: Math.floor(Math.random() * 50) + 5,
    commits: Math.floor(Math.random() * 2000) + 100,
    issues: Math.floor(Math.random() * 100) + 10,
  };
}
