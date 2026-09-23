import { footerBandSvg } from '@/lib/footerBand';

/**
 * The footer band as an asset. Prerendered at build (force-static, the
 * feeds' pattern), so every page references one cacheable file instead
 * of carrying 47 KB of inline SVG in its HTML and its flight payload
 * (React pass, 2026-09-08). It is also in the offline precache
 * (scripts/generate-offline-manifest.mjs, STATIC_URLS).
 */
export const dynamic = 'force-static';

export function GET() {
  return new Response(footerBandSvg(), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
