'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { login } from '../api/authService';
import { setCredentials } from '@/store/authSlice';
import { setTokens } from '../utils/tokenUtils';
import { enqueueNotification } from '@/store/notificationsSlice';
import { useAppDispatch } from '@/store';
import type { LoginCredentials } from '../types/auth.types';

/**
 * Encapsulates the full login side-effect chain:
 * 1. Call authService.login()
 * 2. Persist tokens
 * 3. Hydrate Redux auth state
 * 4. Navigate to dashboard
 *
 * Using useMutation instead of manual useState gives us isLoading, error,
 * and retry for free, and keeps the component a pure presentation layer.
 */
export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      setTokens(data.tokens.accessToken, data.tokens.refreshToken);
      dispatch(setCredentials({ user: data.user, accessToken: data.tokens.accessToken }));
      router.push('/dashboard');
    },
    onError: () => {
      dispatch(
        enqueueNotification({
          message: 'Invalid email or password. Please try again.',
          severity: 'error',
        }),
      );
    },
  });
}
