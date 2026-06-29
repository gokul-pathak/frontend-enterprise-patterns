'use client';

import { Box, Typography } from '@mui/material';
import { Button } from '@/shared/components/Button';
import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Caught by App Error Boundary:', error);
  }, [error]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" color="error" gutterBottom sx={{ fontWeight: 700 }}>
        Something went wrong!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        An unexpected error occurred in the application. Our engineering team has been notified.
      </Typography>
      <Button variant="contained" onClick={() => reset()}>
        Try again
      </Button>
    </Box>
  );
}
