import type { MetadataRoute } from 'next';

/**
 * Dynamic sitemap. For an internal tool, most routes are behind auth
 * and not indexed. We include public-facing routes only.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  return [
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ];
}
