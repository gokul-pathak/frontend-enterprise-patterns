import { getSession } from 'next-auth/react';
import type { DashboardData } from '../types/dashboard.types';

export async function getDashboardData(): Promise<DashboardData> {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error('Not authenticated with GitHub');
  }

  const query = `
    query {
      viewer {
        followers { totalCount }
        following { totalCount }
        repositories(privacy: PUBLIC) { totalCount }
        repositoriesContributedTo(privacy: PUBLIC) { totalCount }
      }
    }
  `;

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub data');
  }

  const { data } = await response.json();
  const viewer = data.viewer;

  return {
    stats: [
      {
        id: 'followers',
        label: 'Followers',
        value: viewer.followers.totalCount,
        change: 0,
        trend: 'neutral',
      },
      {
        id: 'following',
        label: 'Following',
        value: viewer.following.totalCount,
        change: 0,
        trend: 'neutral',
      },
      {
        id: 'public-repos',
        label: 'Public Repositories',
        value: viewer.repositories.totalCount,
        change: 0,
        trend: 'neutral',
      },
      {
        id: 'contributions',
        label: 'Contributed Repos',
        value: viewer.repositoriesContributedTo.totalCount,
        change: 0,
        trend: 'neutral',
      },
    ],
    recentActivity: [],
  };
}
