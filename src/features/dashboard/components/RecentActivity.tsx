'use client';

import { List, ListItem, ListItemText, ListItemAvatar, Typography, Box, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

import { Avatar } from '@/shared/components/Avatar';
import { EmptyState } from '@/shared/components/EmptyState';
import type { ActivityItem } from '../types/dashboard.types';

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  if (items.length === 0) {
    return <EmptyState title="No recent activity" description="Actions will appear here as your team works." />;
  }

  return (
    <List disablePadding>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          divider={index < items.length - 1}
          alignItems="flex-start"
          sx={{ px: 0, py: 1.5 }}
        >
          <ListItemAvatar sx={{ minWidth: 44 }}>
            <Avatar name={item.userName} src={item.userAvatar} size={36} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.userName}
                </Typography>
                <Chip label={item.action} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.25 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.target}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap', ml: 1 }}>
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
