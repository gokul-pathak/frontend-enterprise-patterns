import { redirect } from 'next/navigation';

/**
 * Root page redirects authenticated users to /dashboard.
 * The AuthGuard in the dashboard layout handles unauthenticated access.
 */
export default function RootPage() {
  redirect('/dashboard');
}
