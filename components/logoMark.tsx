import { WORDMARK_PATHS, WORDMARK_VIEWBOX } from '@/lib/wordmarkPaths';

/**
 * The can, as a component — replaces the bar's text wordmark (Malik,
 * 2026-08-17: "let's try replacing the LogiCola text with our logo").
 * Pure render, usable from server and client components alike; the
 * footer keeps its server-side markSvg, both verified against the same
 * public asset (see lib/wordmarkPaths.ts).
 *
 * `knockout` is the ground the can sits on — the lettering is a hole,
 * never white ink (the brand lab's rule). It accepts a CSS var so the
 * navbar's conditional ground (mint on the landing, white elsewhere)
 * flows through without re-rendering: pass 'var(--nav-ground)'.
 */
export function LogoMark({
  height = 36,
  body,
  knockout,
}: {
  height?: number;
  body: string;
  knockout: string;
}) {
  const width = Math.round((WORDMARK_VIEWBOX.w / WORDMARK_VIEWBOX.h) * height);
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      viewBox={`0 0 ${WORDMARK_VIEWBOX.w} ${WORDMARK_VIEWBOX.h}`}
      style={{ display: 'block' }}
      aria-hidden='true'
    >
      {WORDMARK_PATHS.map(([role, d], i) => (
        <path key={i} d={d} fill={role === 'g' ? body : knockout} />
      ))}
    </svg>
  );
}
