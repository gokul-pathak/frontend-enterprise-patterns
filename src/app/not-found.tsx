'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 4,
        textAlign: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 800, color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 360 }}>
        The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to
        view it.
      </Typography>
      <Button component={Link} href="/dashboard" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
}
