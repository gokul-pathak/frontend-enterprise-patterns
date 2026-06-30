import { Box, Typography } from '@mui/material';
import { Button } from '@/shared/components/Button';
import Link from 'next/link';
import { Lock as LockIcon } from '@mui/icons-material';

export const metadata = {
  title: 'Unauthorized',
  description: 'You do not have permission to view this page.',
};

export default function UnauthorizedPage() {
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
      <LockIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 2 }}>
        You don't have the necessary permissions to access this resource. Please log in with an
        authorized account or return to the dashboard.
      </Typography>
      <Link href="/dashboard" passHref legacyBehavior>
        <Button variant="contained">Back to Dashboard</Button>
      </Link>
    </Box>
  );
}
