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

export async function getGitHubUserProfile(
  login: string,
): Promise<GitHubUserProfile | null> {
  try {
    const response = await fetch(`/api/github/profile?login=${encodeURIComponent(login)}`);

    if (!response.ok) {
      throw new Error('API route error');
    }

    const json = (await response.json()) as { user?: GitHubUserProfile | null };
    return json.user ?? null;


  } catch (error) {
    console.warn('GitHub API failed (likely rate limit or missing token). Falling back to mock data.', error);
    // Graceful fallback for portfolio/demo purposes
    return {
      login,
      name: 'Mocked ' + login,
      bio: 'This is a mocked fallback profile because the GitHub API rate limit was exceeded or no token was provided.',
      avatarUrl: `https://i.pravatar.cc/150?u=${login}`,
      followers: { totalCount: 1337 },
      following: { totalCount: 42 },
      repositories: { totalCount: 8 },
      contributionsCollection: {
        totalCommitContributions: 1042,
        totalPullRequestContributions: 89,
      },
    };
  }
}
