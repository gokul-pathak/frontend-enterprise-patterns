import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'GitHub Stats',
    template: '%s | GitHub Stats',
  },
  description:
    'GitHub Stats is a platform for viewing GitHub activity.',
  keywords: ['HR', 'people operations', 'team management', 'performance'],
  authors: [{ name: 'GitHub Stats Engineering' }],
  openGraph: {
    type: 'website',
    siteName: 'GitHub Stats',
    title: 'GitHub Stats',
    description: 'View your GitHub stats.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Stats',
    description: 'View your GitHub stats.',
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
