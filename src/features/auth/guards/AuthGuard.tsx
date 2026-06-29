'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/store';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Client-side auth guard.
 *
 * Why client-side and not middleware?
 * Middleware runs on the edge and doesn't have access to Redux (browser) state.
 * This guard reads from the in-memory Redux store and is the single source of
 * truth for auth state. The middleware (if added) would only check for the
 * presence of a refresh token cookie — a coarse first pass.
 *
 * isInitialized: prevents a flash-of-redirect while the app attempts to
 * rehydrate from a stored refresh token on first mount.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return null; // AppProviders handles the loading state
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
