import type { Metadata } from 'next';
import { UsersPage } from '@/features/users/components/UsersPage';

export const metadata: Metadata = {
  title: 'People',
  description: 'Manage your organization\'s members, roles, and access levels.',
};

export default function Page() {
  return <UsersPage />;
}
