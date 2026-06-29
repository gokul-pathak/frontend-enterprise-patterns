import { http, HttpResponse } from 'msw';
import type { UserProfile } from '@/features/profile/types/profile.types';

let mockProfile: UserProfile = {
  id: 'user-1',
  name: 'Alex Rivera',
  email: 'admin@meridian.io',
  phone: '+1 555 010 2030',
  bio: 'Engineering lead at Meridian. Passionate about distributed systems, developer experience, and building things that matter.',
  department: 'Engineering',
  jobTitle: 'Head of Engineering',
  avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  address: {
    street: '1234 Market St',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    postalCode: '94103',
  },
  linkedIn: 'https://linkedin.com/in/alexrivera',
  github: 'https://github.com/alexrivera',
};

export const profileHandlers = [
  http.get('/api/profile', () => {
    return HttpResponse.json(mockProfile);
  }),

  http.patch('/api/profile', async ({ request }) => {
    const updates = await request.json() as Partial<UserProfile>;
    mockProfile = { ...mockProfile, ...updates };
    return HttpResponse.json(mockProfile);
  }),
];
