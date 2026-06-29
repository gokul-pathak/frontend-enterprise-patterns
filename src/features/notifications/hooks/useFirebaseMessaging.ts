'use client';

import { useEffect, useCallback } from 'react';
import { requestNotificationPermission, onForegroundMessage } from '@/lib/firebase';
import { enqueueNotification } from '@/store/notificationsSlice';
import { useAppDispatch } from '@/store';
import { apiClient } from '@/lib/axios';

/**
 * Manages the full FCM integration lifecycle:
 * 1. Request notification permission
 * 2. Get FCM token and register it with the backend
 * 3. Listen for foreground messages and show them as in-app toasts
 *
 * Called from the notification bell component, not on app mount,
 * because permission requests must be triggered by a user gesture.
 */
export function useFirebaseMessaging() {
  const dispatch = useAppDispatch();

  const enableNotifications = useCallback(async () => {
    const token = await requestNotificationPermission();
    
    // Even if token generation fails (e.g. Firebase not configured),
    // we still want the demo UI to reflect the granted permission.
    if (Notification.permission === 'granted') {
      if (token) {
        // Register token with backend
        try {
          await apiClient.post('/push/register', { token, platform: 'web' });
        } catch {
          // Non-fatal — the app works without push
        }
      }
      
      dispatch(enqueueNotification({
        message: token ? 'Push notifications enabled.' : 'Notification permission granted (Firebase not configured).',
        severity: 'success',
      }));
    }
  }, [dispatch]);

  // Subscribe to foreground messages (app is open and focused)
  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? 'New notification';
      const body = payload.notification?.body;
      dispatch(enqueueNotification({
        message: body ? `${title}: ${body}` : title,
        severity: 'info',
      }));
    });

    return () => {
      unsubscribe?.();
    };
  }, [dispatch]);

  return { enableNotifications };
}
