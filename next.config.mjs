import { withContentCollections } from '@content-collections/next';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // A static export since the move from Vercel to Cloudflare Workers
  // (Malik, 2026-09-24: Vercel's Hobby limits were exceeded). `next
  // build` writes the whole site to out/, which wrangler.jsonc serves as
  // static assets. Every page was already prerendered on Vercel, so
  // nothing that rendered per request is lost; the one route that ran
  // on the server, the newsletter POST, is now worker/index.ts, and the
  // moved-post redirect that lived here is in public/_redirects.
  output: 'export',
  // No image optimizer on a static host. The only next/image users are
  // the 305-byte logo and the two 45 KB phone shots in the new-logicola
  // post, so the originals ship as they are (2026-09-24).
  images: { unoptimized: true },
  // On since 2026-08 (it had been off since the repo's first commit in
  // 2024). The quiz is now dense with effects — document chrome, drawer
  // listeners, exit timeouts — and Strict Mode's dev-only double-invoke
  // is the cheapest harness for catching the ones that don't clean up.
  reactStrictMode: true,
};

// Bundler-agnostic: the plugin runs the content builder (and, in dev, a
// file watcher) when Next loads this config — it never hooks webpack, so
// Turbopack is unaffected. Keep it outermost if other wrappers ever land
// here (it returns a Promise; other plugins may not expect one as input).
export default withContentCollections(nextConfig);
