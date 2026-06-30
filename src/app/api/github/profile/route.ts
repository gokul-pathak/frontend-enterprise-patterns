import { NextResponse } from 'next/server';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const login = searchParams.get('login');

  if (!login) {
    return NextResponse.json({ error: 'Missing login parameter' }, { status: 400 });
  }

  // Use the securely stored server-side environment variable
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'GitHub token not configured on server' }, { status: 500 });
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: GET_GITHUB_USER, variables: { login } }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'GitHub API request failed' }, { status: response.status });
    }

    const json = await response.json();

    if (json.errors) {
      return NextResponse.json(
        { error: 'GitHub GraphQL error', details: json.errors },
        { status: 400 },
      );
    }

    return NextResponse.json({ user: json.data?.user ?? null });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
