/**
 * Firebase initialization and FCM helpers.
 *
 * FCM Token Lifecycle:
 * 1. User grants notification permission
 * 2. getToken() returns a registration token for this browser/device
 * 3. Token is sent to our backend (/api/push/register) and stored against the user
 * 4. When the server pushes a notification, FCM delivers it to this token
 * 5. Tokens can expire or rotate. onTokenRefresh (not shown here but doc'd) handles renewal.
 *
 * Multiple devices:
 * Each browser/device gets its own FCM token. The backend maintains a list of
 * tokens per user and fans out to all of them.
 *
 * This module is only initialized client-side (Firebase SDK is browser-only).
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp() {
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;
  try {
    return getMessaging(getFirebaseApp());
  } catch {
    // Firebase messaging is not supported in this environment (e.g., no service worker)
    return null;
  }
}

/**
 * Safely requests notification permission, handling both Promise and Callback APIs.
 */
async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  
  return new Promise((resolve) => {
    try {
      const result = Notification.requestPermission((permission) => {
        resolve(permission);
      });
      if (result && typeof result.then === 'function') {
        result.then(resolve).catch(() => resolve('denied'));
      }
    } catch {
      resolve('denied');
    }
  });
}

/**
 * Requests notification permission and returns the FCM registration token.
 * Call this after a user gesture (button click) — browsers block permission prompts
 * that are not triggered by user interaction.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Request permission first so the browser prompt always appears,
    // even if Firebase isn't configured with env vars yet.
    const permission = await getNotificationPermission();
    if (permission !== 'granted') return null;

    const messaging = getFirebaseMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    return token;
  } catch {
    return null;
  }
}

/**
 * Subscribes to foreground messages (app is open and in focus).
 * Background messages are handled by the service worker (public/firebase-messaging-sw.js).
 */
export function onForegroundMessage(
  handler: (payload: { notification?: { title?: string; body?: string } }) => void,
): (() => void) | undefined {
  const messaging = getFirebaseMessaging();
  if (!messaging) return undefined;

  const unsubscribe = onMessage(messaging, handler);
  return unsubscribe;
}
