/**
 * Canonical origin for the deployed site.
 *
 * Shared by the root layout's `metadataBase`, `app/robots.ts` and
 * `app/sitemap.ts` so the three can't drift apart — a sitemap advertising
 * a different origin than the canonical tags is a self-inflicted
 * duplicate-content signal.
 */
export const SITE_URL = 'https://logicola.org';
