'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { Avatar } from '@/shared/components/Avatar';
import type { GitHubConnection } from '../types/user.types';
import { useConnectionStats } from '../hooks/useConnectionStats';

interface ConnectionDetailModalProps {
  connection: GitHubConnection | null;
  open: boolean;
  onClose: () => void;
}

export function ConnectionDetailModal({ connection, open, onClose }: ConnectionDetailModalProps) {
  const { data: stats, isLoading } = useConnectionStats(connection?.login || null);

  if (!connection) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        User Details
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar name={connection.name || connection.login} src={connection.avatarUrl} size={80} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {connection.name || connection.login}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              @{connection.login}
            </Typography>
            {connection.bio && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {connection.bio}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          GitHub Contributions
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : stats ? (
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-around', textAlign: 'center' }}>
            <Box>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                {stats.pullRequests}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pull Requests
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                {stats.commits}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Commits
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 700 }}>
                {stats.issues}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Repositories
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography color="error">Failed to load statistics.</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
