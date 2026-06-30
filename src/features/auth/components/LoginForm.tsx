'use client';

import { Box, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { Button } from '@/shared/components/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useState } from 'react';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    await signIn('github', { callbackUrl: '/dashboard' });
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await signIn('credentials', {
      username: 'admin',
      password: 'password',
      callbackUrl: '/dashboard',
    });
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
        Sign in with your GitHub account to access the dashboard and view your real GitHub
        statistics.
      </Typography>

      <Button
        id="github-login-submit"
        variant="contained"
        fullWidth
        size="large"
        startIcon={<GitHubIcon />}
        onClick={handleGitHubLogin}
        isLoading={isLoading}
        loadingText="Redirecting to GitHub…"
        sx={{
          backgroundColor: '#24292e',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1b1f23',
          },
        }}
      >
        Sign in with GitHub
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        Don't want to set up GitHub OAuth right now?
      </Typography>

      <Button
        id="demo-login-submit"
        variant="outlined"
        fullWidth
        size="large"
        onClick={handleDemoLogin}
        disabled={isLoading}
      >
        Sign in with Demo Account
      </Button>
    </Box>
  );
}
