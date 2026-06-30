'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grid, Card, CardContent, Typography, Divider, Box } from '@mui/material';

import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { profileSchema, type ProfileFormValues } from '../schemas/profileSchema';
import type { UserProfile } from '../types/profile.types';

/**
 * Why React Hook Form?
 * RHF uses uncontrolled inputs by default. This means state updates on every
 * keystroke don't trigger a full component re-render — critical for a form
 * with 12+ fields. MUI's TextField is wrapped to integrate with the ref-based
 * API via the Input component.
 *
 * Why Zod?
 * The schema is the single source of truth for both TypeScript types and
 * runtime validation. Zod's z.infer<typeof profileSchema> gives us the form
 * value type for free, keeping the type and validation logic in sync.
 */

interface ProfileFormProps {
  defaultValues: UserProfile;
  onSubmit: (values: ProfileFormValues) => void;
  isSubmitting: boolean;
}

export function ProfileForm({ defaultValues, onSubmit, isSubmitting }: ProfileFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues.name,
      phone: defaultValues.phone,
      bio: defaultValues.bio,
      department: defaultValues.department,
      jobTitle: defaultValues.jobTitle,
      address: defaultValues.address,
      linkedIn: defaultValues.linkedIn,
      github: defaultValues.github,
    },
  });

  // Reset form when the server data changes (e.g., after a successful save)
  useEffect(() => {
    reset({
      name: defaultValues.name,
      phone: defaultValues.phone,
      bio: defaultValues.bio,
      department: defaultValues.department,
      jobTitle: defaultValues.jobTitle,
      address: defaultValues.address,
      linkedIn: defaultValues.linkedIn,
      github: defaultValues.github,
    });
  }, [defaultValues, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Full name"
                    required
                    errorMessage={errors.name?.message}
                    slotProps={{ htmlInput: { 'aria-required': 'true' } }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Phone number"
                    type="tel"
                    errorMessage={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Job title"
                    required
                    errorMessage={errors.jobTitle?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Department"
                    required
                    errorMessage={errors.department?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Bio"
                    multiline
                    rows={3}
                    errorMessage={errors.bio?.message}
                    helperText={
                      !errors.bio?.message
                        ? 'A brief introduction visible to your team.'
                        : undefined
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Address
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Street address"
                    errorMessage={errors.address?.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <Input {...field} label="City" errorMessage={errors.address?.city?.message} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="address.state"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="State / Province"
                    errorMessage={errors.address?.state?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="address.country"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Country"
                    errorMessage={errors.address?.country?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="address.postalCode"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Postal code"
                    errorMessage={errors.address?.postalCode?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Online Profiles
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="linkedIn"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="LinkedIn URL"
                    type="url"
                    placeholder="https://linkedin.com/in/yourhandle"
                    errorMessage={errors.linkedIn?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="github"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="GitHub URL"
                    type="url"
                    placeholder="https://github.com/yourhandle"
                    errorMessage={errors.github?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          type="button"
          variant="outlined"
          disabled={!isDirty || isSubmitting}
          onClick={() => reset()}
        >
          Discard changes
        </Button>
        <Button
          type="submit"
          variant="contained"
          isLoading={isSubmitting}
          loadingText="Saving…"
          disabled={!isDirty}
        >
          Save changes
        </Button>
      </Box>
    </Box>
  );
}
