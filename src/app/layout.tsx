import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Meridian — People Operations Platform',
    template: '%s | Meridian',
  },
  description:
    'Meridian is an internal HR and People Operations platform for managing your organization\'s team members, performance, and growth.',
  keywords: ['HR', 'people operations', 'team management', 'performance'],
  authors: [{ name: 'Meridian Engineering' }],
  openGraph: {
    type: 'website',
    siteName: 'Meridian',
    title: 'Meridian — People Operations Platform',
    description: 'Manage your organization\'s team with Meridian.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meridian — People Operations Platform',
    description: 'Manage your organization\'s team with Meridian.',
  },
  robots: {
    index: false, // Internal tool — don't index
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
