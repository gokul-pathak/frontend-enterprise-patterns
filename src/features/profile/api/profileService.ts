import { apiClient } from '@/lib/axios';
import type { UserProfile, UpdateProfilePayload } from '../types/profile.types';

export async function getProfile(): Promise<UserProfile> {
  const { data } = await apiClient.get<UserProfile>('/profile');
  return data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const { data } = await apiClient.patch<UserProfile>('/profile', payload);
  return data;
}
