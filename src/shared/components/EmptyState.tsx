'use client';

import { Box, Typography, SxProps, Theme } from '@mui/material';
import { Inbox as InboxIcon } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function EmptyState({ title, description, action, icon, sx }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: 8,
        textAlign: 'center',
        ...sx,
      }}
      role="status"
      aria-label={title}
    >
      <Box sx={{ color: 'text.disabled', fontSize: 64 }}>
        {icon ?? <InboxIcon fontSize="inherit" />}
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
