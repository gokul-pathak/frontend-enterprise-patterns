'use client';

import { useEffect } from 'react';

import { getTokens, isTokenExpired, refreshAccessToken, clearTokens, decodeJwtPayload } from '../utils/tokenUtils';
import { setCredentials, setInitialized } from '@/store/authSlice';
import { useAppDispatch } from '@/store';
import type { AuthUser } from '../types/auth.types';

/**
 * Runs once on app mount to rehydrate auth state from a stored refresh token.
 *
 * Flow:
 * 1. Check localStorage for a refresh token
 * 2. If present and we don't have a valid access token, call the refresh endpoint
 * 3. Decode the new access token to get user claims
 * 4. Dispatch setCredentials to populate Redux
 * 5. Always dispatch setInitialized so guards know the check is complete
 *
 * This hook is called in AppProviders, not in individual pages.
 */
export function useAuthInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function rehydrate() {
      const { refreshToken, accessToken } = getTokens();

      try {
        // Already have a valid access token (shouldn't happen on fresh load, but defensive)
        if (accessToken && !isTokenExpired(accessToken)) {
          const user = decodeJwtPayload<AuthUser>(accessToken);
          if (user) {
            dispatch(setCredentials({ user, accessToken }));
          }
          return;
        }

        if (!refreshToken) return;

        const newAccessToken = await refreshAccessToken();
        const user = decodeJwtPayload<AuthUser>(newAccessToken);

        if (user) {
          dispatch(setCredentials({ user, accessToken: newAccessToken }));
        }
      } catch {
        // Refresh failed — treat as logged out
        clearTokens();
      } finally {
        dispatch(setInitialized());
      }
    }

    rehydrate();
  }, [dispatch]);
}
