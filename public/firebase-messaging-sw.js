// Firebase Messaging Service Worker
// This file MUST be named firebase-messaging-sw.js and placed in /public/
//
// Background message handling:
// When the app is NOT in focus (minimized or closed), FCM delivers messages
// to this service worker. The service worker shows a native browser notification.
// Foreground messages are handled by onForegroundMessage() in src/lib/firebase.ts.

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase config must be duplicated here because service workers don't have
// access to the Next.js environment or module system.
// In a production setup, this file would be generated at build time with the
// real values injected.
firebase.initializeApp({
  apiKey: 'REPLACE_WITH_FIREBASE_API_KEY',
  authDomain: 'REPLACE_WITH_FIREBASE_AUTH_DOMAIN',
  projectId: 'REPLACE_WITH_FIREBASE_PROJECT_ID',
  storageBucket: 'REPLACE_WITH_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'REPLACE_WITH_FIREBASE_APP_ID',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title ?? 'Meridian';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/logo-192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
