'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography, Divider, Alert } from '@mui/material';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const login = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((values) => login.mutate(values))}
      noValidate
      sx={{ width: '100%' }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              required
              errorMessage={errors.email?.message}
              slotProps={{
                htmlInput: {
                  'aria-required': 'true',
                  'aria-describedby': errors.email ? 'email-error' : undefined,
                },
              }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              errorMessage={errors.password?.message}
              slotProps={{
                htmlInput: {
                  'aria-required': 'true',
                  'aria-describedby': errors.password ? 'password-error' : undefined,
                },
              }}
            />
          )}
        />
      </Box>

      {login.isError && (
        <Alert severity="error" sx={{ mb: 2 }} role="alert">
          Invalid email or password.
        </Alert>
      )}

      <Button
        id="login-submit"
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        isLoading={login.isPending}
        loadingText="Signing in…"
      >
        Sign in
      </Button>

      <Divider sx={{ my: 3 }}>
        <Typography variant="caption" color="text.secondary">
          Demo credentials
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {[
          { email: 'admin@meridian.io', password: 'password123', role: 'Admin' },
          { email: 'manager@meridian.io', password: 'password123', role: 'Manager' },
          { email: 'employee@meridian.io', password: 'password123', role: 'Employee' },
        ].map(({ email, password, role }) => (
          <Button
            key={role}
            type="button"
            variant="outlined"
            size="small"
            fullWidth
            onClick={() => login.mutate({ email, password })}
            disabled={login.isPending}
          >
            Sign in as {role}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
