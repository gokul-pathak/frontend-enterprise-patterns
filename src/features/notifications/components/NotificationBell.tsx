'use client';

import { useState } from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import { Notifications as NotificationsIcon, NotificationsActive as NotificationsActiveIcon } from '@mui/icons-material';

import { useFirebaseMessaging } from '../hooks/useFirebaseMessaging';

export function NotificationBell() {
  const [enabled, setEnabled] = useState(
    typeof window !== 'undefined' && Notification.permission === 'granted',
  );
  const { enableNotifications } = useFirebaseMessaging();

  async function handleClick() {
    if (!enabled) {
      await enableNotifications();
      setEnabled(Notification.permission === 'granted');
    }
  }

  return (
    <Tooltip title={enabled ? 'Notifications enabled' : 'Enable push notifications'}>
      <IconButton
        onClick={handleClick}
        aria-label={enabled ? 'Notifications enabled' : 'Enable push notifications'}
        color={enabled ? 'primary' : 'default'}
        id="notification-bell"
      >
        <Badge color="error" variant="dot" invisible={!enabled}>
          {enabled ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
