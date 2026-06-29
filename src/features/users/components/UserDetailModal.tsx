'use client';

import {
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Commit as CommitIcon,
  MergeType as MergeTypeIcon,
} from '@mui/icons-material';

import { Modal } from '@/shared/components/Modal';
import { Avatar } from '@/shared/components/Avatar';
import { useGitHubProfile } from '../hooks/useGitHubProfile';
import type { User } from '../types/user.types';

interface UserDetailModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

/**
 * User detail modal that combines our internal REST data (the User object)
 * with GitHub GraphQL data (contribution stats).
 *
 * This is the practical demonstration of "why GraphQL here":
 * - We need nested, relationship-rich data (contributions, followers, repos)
 * - We query exactly the fields we need
 * - The GitHub REST API would require 3 separate calls to get this data
 */
export function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  // Derive GitHub login from email domain convention (demo assumption)
  const githubLogin = user.email.split('@')[0];
  const { data: ghProfile, isLoading: ghLoading, isError: ghError } = useGitHubProfile(
    open ? githubLogin : null,
  );

  return (
    <Modal open={open} onClose={onClose} title="Team Member" maxWidth="sm">
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Avatar name={user.name} src={user.avatarUrl} size={64} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {user.email}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Chip label={user.role} size="small" variant="outlined" color="primary" />
            <Chip
              label={user.status}
              size="small"
              color={user.status === 'active' ? 'success' : 'error'}
            />
          </Box>
        </Box>
      </Box>

      <List dense disablePadding sx={{ mb: 2 }}>
        <ListItem disableGutters>
          <ListItemText primary="Department" secondary={user.department} />
        </ListItem>
        {user.manager && (
          <ListItem disableGutters>
            <ListItemText primary="Reports to" secondary={user.manager} />
          </ListItem>
        )}
        <ListItem disableGutters>
          <ListItemText
            primary="Member since"
            secondary={new Date(user.joinedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <GitHubIcon fontSize="small" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          GitHub Activity (GraphQL)
        </Typography>
      </Box>

      {ghLoading && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={100} height={60} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={60} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={60} sx={{ borderRadius: 1 }} />
        </Box>
      )}

      {ghError && (
        <Alert severity="info" variant="outlined">
          GitHub profile unavailable. Add a NEXT_PUBLIC_GITHUB_TOKEN to enable this.
        </Alert>
      )}

      {ghProfile && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { icon: <CommitIcon />, label: 'Commits', value: ghProfile.contributionsCollection.totalCommitContributions },
            { icon: <MergeTypeIcon />, label: 'PRs', value: ghProfile.contributionsCollection.totalPullRequestContributions },
            { icon: <GitHubIcon />, label: 'Repos', value: ghProfile.repositories.totalCount },
          ].map(({ icon, label, value }) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 1.5,
                minWidth: 90,
              }}
            >
              {icon}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{value.toLocaleString()}</Typography>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
          ))}
        </Box>
      )}

      {!ghLoading && !ghError && !ghProfile && (
        <Alert severity="info" variant="outlined">
          No GitHub profile found for <strong>{githubLogin}</strong>.
        </Alert>
      )}
    </Modal>
  );
}
