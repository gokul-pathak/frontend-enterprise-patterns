import type { Metadata } from 'next';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your organization: headcount, activity, and key metrics.',
};

export default function Page() {
  return <DashboardPage />;
}
