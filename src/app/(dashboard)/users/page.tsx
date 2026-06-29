import type { Metadata } from 'next';
import { UsersPage } from '@/features/users/components/UsersPage';

export const metadata: Metadata = {
  title: 'Connections',
  description: 'View your GitHub followers and following list.',
};

export default function Page() {
  return <UsersPage />;
}
