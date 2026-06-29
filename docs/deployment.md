# Deployment Guide

This document outlines the requirements and considerations for deploying Meridian to a production environment.

## 1. Hosting Environment
Meridian is a Next.js 16 application using the App Router. It can be deployed to any platform that supports Node.js or Docker, but is optimized for platforms with native Next.js support like:
- **Vercel** (Recommended: Zero configuration, Edge caching, built-in CI/CD)
- **AWS Amplify** or **AWS ECS/EKS** (Requires Dockerizing or SST)
- **Google Cloud Run** (Requires Dockerizing)

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

## 2. Environment Variables
In production, you must supply the following environment variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | The base URL of your backend REST API. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase config variable. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase config variable. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase config variable. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase config variable. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase config variable. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase config variable. |
| `GITHUB_GRAPHQL_TOKEN` | (Server-side) Token for the GitHub GraphQL API integration. |

## 3. Firebase Cloud Messaging (FCM) Requirements

Meridian uses FCM for push notifications. To make this work in production, you must address the Service Worker.

### The Service Worker Problem
The file `public/firebase-messaging-sw.js` runs outside the React context and cannot access `process.env` natively in the browser. 

Currently, the file uses placeholder strings:
```javascript
firebase.initializeApp({
  apiKey: 'REPLACE_WITH_FIREBASE_API_KEY',
  // ...
});
```

### Deployment Solutions

**Option A: Build-time Injection (Recommended)**
Use a script in your CI/CD pipeline to inject the real environment variables into `firebase-messaging-sw.js` just before running `npm run build`. 
Example `package.json` script:
```json
"prebuild": "node scripts/inject-firebase-config.js"
```

**Option B: API Route Proxy**
Instead of hardcoding credentials, the service worker can fetch its configuration from a Next.js Route Handler (e.g., `/api/config/firebase`) on initialization.

## 4. Security Considerations
- **JWT Storage:** The application currently stores the access token in memory (Redux) and the refresh token in `localStorage`. For production, the refresh token **must** be moved to an `httpOnly` cookie set by the server to prevent XSS attacks. The Next.js API routes (or backend) would read this cookie to issue new access tokens.
- **CORS:** Ensure your backend API is configured with strict CORS rules allowing requests only from your production frontend domain.
