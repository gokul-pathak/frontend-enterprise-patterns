import { apiClient } from '@/lib/axios';
import type { UserProfile, UpdateProfilePayload } from '../types/profile.types';

import { getSession } from 'next-auth/react';

export async function getProfile(): Promise<UserProfile> {
  const session = await getSession();
  const username = session?.user?.name || 'admin';
  const login = session?.username || 'admin';

  // If we have a real GitHub login, we can fetch their profile
  if (session?.accessToken && session.accessToken.startsWith('gh')) {
    try {
      const { data } = await apiClient.get(`https://api.github.com/users/${login}`);
      return {
        id: String(data.id),
        name: data.name || data.login,
        email: data.email || `${data.login}@github.com`,
        phone: '',
        bio: data.bio || '',
        department: 'Engineering',
        jobTitle: 'Software Engineer',
        avatarUrl: data.avatar_url,
        address: { street: '', city: data.location || '', state: '', country: '', postalCode: '' },
        linkedIn: '',
        github: data.html_url || `https://github.com/${data.login}`,
      };
    } catch {
      // Fallback below
    }
  }

  // Fallback for Demo Account
  return {
    id: '1',
    name: username,
    email: `${login}@meridian.io`,
    phone: '555-0199',
    bio: 'Demo account for Meridian portfolio.',
    department: 'Engineering',
    jobTitle: 'Admin',
    avatarUrl: session?.user?.image || 'https://avatars.githubusercontent.com/u/9919?v=4',
    address: {
      street: '123 Tech Lane',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94105',
    },
    linkedIn: 'https://linkedin.com/in/demo',
    github: 'https://github.com/demo',
  };
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  // Simulate API update delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return the merged profile (mock update)
  const current = await getProfile();
  return { ...current, ...payload };
}
