'use client';

import { useAuthInit } from '@/features/auth/hooks/useAuthInit';
import { initTheme } from '@/store/themeSlice';
import { useAppDispatch } from '@/store';
import { useEffect } from 'react';

/**
 * Invisible component mounted inside AppProviders.
 * Runs side effects that need to happen before the app renders:
 * - Rehydrate auth state from refresh token
 * - Sync theme preference from localStorage
 *
 * Split from AppProviders to keep that file focused on composition.
 */
export function AuthInitializer() {
  const dispatch = useAppDispatch();

  // Initialize theme from localStorage / system preference
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  // Attempt to restore session from stored refresh token
  useAuthInit();

  return null;
}
