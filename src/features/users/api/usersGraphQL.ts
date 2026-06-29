/**
 * GraphQL integration using the GitHub public API.
 *
 * Why GraphQL for this specific use case?
 * We're showing a user's GitHub contribution history — a nested, graph-shaped
 * data structure (user -> repositories -> contributions). Fetching this with
 * REST would require multiple round-trips or a bloated response. GraphQL lets
 * us request exactly the fields we need in one request.
 *
 * Why REST for the main users list?
 * Our own user list is a flat, predictable collection. REST with pagination
 * handles it perfectly. No need for the overhead of GraphQL.
 *
 * Token: reads from NEXT_PUBLIC_GITHUB_TOKEN. If empty, the app falls back
 * gracefully without erroring the whole page.
 */

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: { totalCount: number };
  contributionsCollection: {
    totalCommitContributions: number;
    totalPullRequestContributions: number;
  };
}

const GET_GITHUB_USER = `
  query GetGitHubUser($login: String!) {
    user(login: $login) {
      login
      name
      bio
      avatarUrl
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(privacy: PUBLIC) {
        totalCount
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
      }
    }
  }
`;

export async function getGitHubUserProfile(
  login: string,
): Promise<GitHubUserProfile | null> {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: GET_GITHUB_USER, variables: { login } }),
    });

    if (!response.ok) return null;

    const json = (await response.json()) as { data?: { user: GitHubUserProfile | null } };
    return json.data?.user ?? null;
  } catch {
    return null;
  }
}
