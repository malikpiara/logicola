import { Footer } from '@/components/footer';
import { MARKETING_THEME } from '@/lib/marketingTheme';

/**
 * The marketing chrome (blog + release notes), separate from the (site)
 * group: these pages carry their own nav (per-page, since the active
 * state differs) and the design ported from docs/marketing-lab.html on
 * 2026-08-14. The three --mk-* variables carry the provisional scheme
 * from lib/marketingTheme.ts — the colour decision is deferred, and
 * swapping it never touches this file.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = MARKETING_THEME;
  return (
    <div
      style={
        {
          background: t.contentGround,
          '--mk-ground': t.ground,
          '--mk-ink': t.ink,
          '--mk-type': t.type,
          '--mk-surface': t.contentGround,
        } as React.CSSProperties
      }
    >
      {children}
      <Footer />
    </div>
  );
}
