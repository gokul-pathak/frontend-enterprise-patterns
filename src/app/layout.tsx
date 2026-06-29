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
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'GitHub Stats',
    title: 'GitHub Stats',
    description: 'View your GitHub stats.',
    url: '/',
    images: [
      {
        url: '/og-image.jpg', // Mock OG image
        width: 1200,
        height: 630,
        alt: 'GitHub Stats Open Graph Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub Stats',
    description: 'View your GitHub stats.',
    images: ['/twitter-image.jpg'], // Mock Twitter image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AppProviders>
          {/* JSON-LD Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'GitHub Stats',
                url: 'https://githubstats.example.com',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://githubstats.example.com/search?q={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
