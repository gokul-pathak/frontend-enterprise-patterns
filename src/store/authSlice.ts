import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AuthUser, AuthState } from '@/features/auth/types/auth.types';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
};

/**
 * Auth slice stores the decoded user + token in memory (not localStorage).
 *
 * Why memory-only? Storing JWTs in localStorage exposes them to XSS.
 * The refresh token lives in localStorage (acceptable tradeoff for persistence).
 * Production would use httpOnly cookies for the refresh token — see tokenUtils.ts.
 *
 * isInitialized: false until the app has attempted to rehydrate from a stored
 * refresh token on mount. Guards don't redirect until this is true.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setInitialized, logout } = authSlice.actions;
export default authSlice.reducer;
