'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logout as logoutService } from '../api/authService';
import { logout as logoutAction } from '@/store/authSlice';
import { clearTokens } from '../utils/tokenUtils';
import { useAppDispatch } from '@/store';

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutService,
    onSettled: () => {
      // Always clean up, even if the server logout call fails.
      // An expired session on the client with stale server-side tokens is worse
      // than a mismatch.
      clearTokens();
      dispatch(logoutAction());
      queryClient.clear();
      router.push('/login');
    },
  });
}
