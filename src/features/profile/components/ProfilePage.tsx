'use client';

import { useEffect } from 'react';
import { Box, Skeleton, Alert, Typography } from '@mui/material';

import { PageHeader } from '@/shared/components/PageHeader';
import { Avatar } from '@/shared/components/Avatar';
import { ProfileForm } from './ProfileForm';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchProfile, saveProfile } from '@/store/profileSlice';
import type { ProfileFormValues } from '../schemas/profileSchema';

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const {
    data: profile,
    isLoading,
    isSaving,
    error: isError,
  } = useAppSelector((state) => state.profile);

  useEffect(() => {
    // Only fetch if we don't have data, or if you want to always refetch on mount.
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  function handleSubmit(values: ProfileFormValues) {
    dispatch(saveProfile(values));
  }

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Update your personal information and preferences."
        breadcrumbs={[{ label: 'GitHub Stats' }, { label: 'Profile' }]}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load your profile. Please refresh the page.
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
          <Skeleton variant="circular" width={80} height={80} />
          <Box>
            <Skeleton width={180} height={28} />
            <Skeleton width={120} height={20} sx={{ mt: 0.5 }} />
          </Box>
        </Box>
      )}

      {profile && (
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
          <Avatar name={profile.name} src={profile.avatarUrl} size={80} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.jobTitle} · {profile.department}
            </Typography>
          </Box>
        </Box>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      ) : (
        profile && (
          <ProfileForm defaultValues={profile} onSubmit={handleSubmit} isSubmitting={isSaving} />
        )
      )}
    </div>
  );
}
