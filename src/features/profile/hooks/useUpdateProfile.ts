import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../api/profileService';
import { enqueueNotification } from '@/store/notificationsSlice';
import { useAppDispatch } from '@/store';
import { PROFILE_QUERY_KEY } from './useProfile';
import type { UpdateProfilePayload } from '../types/profile.types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (updatedProfile) => {
      // Optimistic cache update — no need to refetch, we already have the fresh data
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
      dispatch(enqueueNotification({ message: 'Profile updated successfully.', severity: 'success' }));
    },
    onError: () => {
      dispatch(enqueueNotification({ message: 'Failed to save profile changes.', severity: 'error' }));
    },
  });
}
