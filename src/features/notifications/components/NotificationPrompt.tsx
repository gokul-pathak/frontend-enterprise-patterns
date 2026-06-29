'use client';

import { useState, useEffect } from 'react';
import { Alert, Button } from '@mui/material';
import { NotificationsActive as NotificationsActiveIcon } from '@mui/icons-material';

import { useFirebaseMessaging } from '../hooks/useFirebaseMessaging';

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { enableNotifications } = useFirebaseMessaging();

  useEffect(() => {
    // Only show prompt if they haven't made a choice yet
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        setShowPrompt(true);
      }
    }
  }, []);

  const handleEnable = async () => {
    await enableNotifications();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <Alert
      severity="info"
      icon={<NotificationsActiveIcon />}
      sx={{ mb: 3 }}
      action={
        <Button color="inherit" size="small" onClick={handleEnable}>
          Enable Now
        </Button>
      }
    >
      Stay up to date! Enable push notifications to get real-time alerts when team members join or depart.
    </Alert>
  );
}
