import type { Metadata } from 'next';
import { Box, Typography, Paper } from '@mui/material';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your GitHub Stats account to access the People Operations platform.',
  robots: { index: false, follow: false },
};

/**
 * Login page is a Server Component. The LoginForm inside is 'use client'.
 * This split keeps the page shell static (faster FCP) while the form hydrates.
 */
export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: 440,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: 'primary.main' }}
          >
            GitHub Stats
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to your workspace
          </Typography>
        </Box>
        <LoginForm />
      </Paper>
    </Box>
  );
}
