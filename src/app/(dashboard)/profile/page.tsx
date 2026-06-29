import type { Metadata } from 'next';
import { ProfilePage } from '@/features/profile/components/ProfilePage';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Manage your personal information, address, and online profiles.',
};

export default function Page() {
  return <ProfilePage />;
}
