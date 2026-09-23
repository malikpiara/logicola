import { SETS, coverPool } from '@/lib/marketingTheme';
import { patternBody } from '@/lib/patterns';

/**
 * The footer band, as a module so one prerendered route can serve it
 * (app/footer-band.svg/route.ts) and the footer can reference it as an
 * <img>. Moved out of components/footer.tsx on the React pass,
 * 2026-09-08; the recipe and its reasoning are unchanged and follow.
 */
const GROUND = SETS.L.surface; // #CFF6DD, Set L mint — the footer's ground
const INK = SETS.L.ink; // #3F0167, Set L plum — the footer's type

/** The band: 1600×56 once, `slice`-cropped at any viewport so the
 *  features keep their proportion instead of squeezing (the LinkedIn
 *  cover's lesson).
 *
 *  THE COVER RECIPE, AT A ROW AND A THIRD (Malik, 2026-08-24, from
 *  docs/footer-band-lab.html). The band was camo at 0.35 reading a
 *  single magenta — camo takes only `pool[0]`, so two colours and a
 *  ground was the most it could ever show. It now runs the quilt the
 *  social covers run, on the nine, at rate 0.75: the page's last object
 *  and a profile's first object are the same pattern.
 *
 *  0.72 IS A CROP, DELIBERATELY. A cell is `62 × scale` and rows lay
 *  from y=0, so whole-row scales are the family `h / (62 × N)` — 0.90
 *  for one row, 0.45 for two. Both were judged and both lost: one row
 *  of 56px shapes reads as a border rather than a quilt (a quilt needs
 *  a second axis before the eye sees a field), and two rows shrink the
 *  cell to 28px, well under the covers' own. 0.74 keeps a 46px cell and
 *  carries 1.21 rows, so the second row shows as a 10px sliver. The cut
 *  lands on the band's BOTTOM edge — the bottom of the page — where a
 *  pattern running off-canvas is what a cover does anyway.
 *
 *  SHAPE SIZE AND SECOND-ROW VISIBILITY ARE ONE DIAL, pulling opposite
 *  ways: the sliver is `56 − 62 × scale`, so every pixel of cell costs
 *  a pixel of row two. It closes entirely at 0.90 — which is the
 *  one-row border again — and the cell falls below the covers' own
 *  register under ~0.70. 0.74 sits where both still read. Wanting
 *  bigger shapes AND more of row two means raising the band's HEIGHT,
 *  which is the one thing the original brief fixed (Malik, 2026-08-24).
 *
 *  Seed 45 is the covers' seed, and it is fixed forever: a short window
 *  onto a large-featured field is largely decided by its seed, so this
 *  number is part of the design, not an arbitrary default. */
export function footerBandSvg(): string {
  const body = patternBody('quilt', {
    w: 1600,
    h: 56,
    ink: INK,
    pool: coverPool(GROUND, INK),
    scale: 0.74,
    seed: 45,
    clear: null,
    rate: 0.75,
  });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="56" viewBox="0 0 1600 56" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:56px">` +
    `<rect width="1600" height="56" fill="${GROUND}"/>` +
    body +
    '</svg>'
  );
}
