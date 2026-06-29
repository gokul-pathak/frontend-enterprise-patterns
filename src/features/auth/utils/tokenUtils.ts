/**
 * Token utilities — encode/decode/store JWT tokens.
 *
 * Storage strategy:
 * - Access token: memory only (Redux store). Lost on page refresh, recovered via refresh flow.
 * - Refresh token: localStorage. Survives page refresh. NOT httpOnly (limitation of this
 *   client-side demo). In production, use httpOnly cookies set by the server.
 *
 * This is a deliberate, documented tradeoff — not an oversight.
 */

const REFRESH_TOKEN_KEY = 'meridian_refresh_token';

export interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

let inMemoryAccessToken: string | null = null;

export function getTokens(): StoredTokens {
  return {
    accessToken: inMemoryAccessToken,
    refreshToken:
      typeof window !== 'undefined' ? localStorage.getItem(REFRESH_TOKEN_KEY) : null,
  };
}

export function setTokens(accessToken: string, refreshToken: string): void {
  inMemoryAccessToken = accessToken;
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  inMemoryAccessToken = null;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  inMemoryAccessToken = token;
}

/**
 * Decodes a JWT payload without verifying the signature.
 * Signature verification MUST happen on the server. This is only for reading
 * claims (user data, expiry) on the client.
 */
export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload<{ exp: number }>(token);
  if (!payload?.exp) return true;
  // 30s buffer to account for clock skew
  return Date.now() >= (payload.exp - 30) * 1000;
}

/**
 * Calls the refresh endpoint and updates the in-memory access token.
 * Called automatically by the Axios response interceptor on 401.
 */
export async function refreshAccessToken(): Promise<string> {
  const { refreshToken } = getTokens();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    throw new Error('Token refresh failed');
  }

  const data = (await response.json()) as { accessToken: string };
  setAccessToken(data.accessToken);
  return data.accessToken;
}
