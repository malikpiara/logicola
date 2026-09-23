import { withContentCollections } from '@content-collections/next';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // On since 2026-08 (it had been off since the repo's first commit in
  // 2024). The quiz is now dense with effects — document chrome, drawer
  // listeners, exit timeouts — and Strict Mode's dev-only double-invoke
  // is the cheapest harness for catching the ones that don't clean up.
  reactStrictMode: true,
  // Moved posts (2026-09-23). The Set R post was live at
  // /blog/set-r-informal-fallacies from the blog's launch until it was
  // unpublished on 2026-08-25, so the feed and the sitemap listed that
  // address. It returns at a shorter one; permanent, so old links and
  // any index entry follow it.
  async redirects() {
    return [
      {
        source: '/blog/set-r-informal-fallacies',
        destination: '/blog/informal-fallacies',
        permanent: true,
      },
    ];
  },
};

// Bundler-agnostic: the plugin runs the content builder (and, in dev, a
// file watcher) when Next loads this config — it never hooks webpack, so
// Turbopack is unaffected. Keep it outermost if other wrappers ever land
// here (it returns a Promise; other plugins may not expect one as input).
export default withContentCollections(nextConfig);
