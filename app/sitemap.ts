import type { MetadataRoute } from 'next';
import { quizCatalog } from '@/lib/quizCatalog';
import { SITE_URL } from '@/lib/site';

/**
 * Every canonical, indexable URL on the site.
 *
 * `/progress` is omitted (a personal view of local progress — nothing a
 * search result should land on) as is `/offline` (the service worker's
 * fallback shell). `lastModified` is deliberately absent: stamping it at
 * build time would churn on every deploy and tell crawlers the content
 * changed when it didn't.
 */
const staticRoutes = ['/', '/syllogistic', '/keyboard'];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...quizCatalog.map(({ quizPath }) => ({ url: `${SITE_URL}${quizPath}` })),
  ];
}
