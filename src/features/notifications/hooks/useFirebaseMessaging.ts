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
    if (!token) return;

    // Register token with backend
    // The backend stores this token against the user's account for push delivery
    try {
      await apiClient.post('/push/register', { token, platform: 'web' });
      dispatch(enqueueNotification({
        message: 'Push notifications enabled.',
        severity: 'success',
      }));
    } catch {
      // Non-fatal — the app works without push
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
