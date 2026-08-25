import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Open to every crawler, including the AI ones (GPTBot, ClaudeBot,
 * PerplexityBot, Google-Extended, CCBot).
 *
 * This is a deliberate choice rather than an omission. The exercise data
 * lives in a public, MIT-licensed repo, so a per-bot `Disallow` here would
 * signal an intent it couldn't actually enforce. The bet is that the tool
 * — interactive drilling with instant feedback — is the thing worth
 * finding, and the passages alone aren't a substitute for it.
 *
 * `/offline` is excluded: it's the service worker's fallback shell, not a
 * page anyone should reach from search.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/offline'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
