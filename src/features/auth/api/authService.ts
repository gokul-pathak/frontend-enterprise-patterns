import { apiClient } from '@/lib/axios';
import type { LoginCredentials, LoginResponse, RefreshResponse } from '../types/auth.types';

/**
 * Auth service — plain async functions that wrap API calls.
 *
 * No React here. This is testable in isolation (just mock apiClient).
 * The useLogin/useLogout hooks are the React integration layer.
 */

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function refreshToken(token: string): Promise<RefreshResponse> {
  const { data } = await apiClient.post<RefreshResponse>('/auth/refresh', {
    refreshToken: token,
  });
  return data;
}

export async function getMe(): Promise<LoginResponse['user']> {
  const { data } = await apiClient.get<LoginResponse['user']>('/auth/me');
  return data;
}
