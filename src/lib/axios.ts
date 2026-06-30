import axios, { InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

/**
 * Axios instance for all REST API calls.
 *
 * Automatically attaches the NextAuth session accessToken to outgoing requests
 * if one exists.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // If we are on the client side, we can fetch the session
  if (typeof window !== 'undefined') {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }
  return config;
});
