/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // On since 2026-08 (it had been off since the repo's first commit in
  // 2024). The quiz is now dense with effects — document chrome, drawer
  // listeners, exit timeouts — and Strict Mode's dev-only double-invoke
  // is the cheapest harness for catching the ones that don't clean up.
  reactStrictMode: true,
};

export default nextConfig;
