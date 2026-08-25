/**
 * Pixel-treatment silhouette generators — the port of the pattern lab's
 * shape grammar (docs/pattern-lab.html, contract in docs/pixel-ui.md).
 *
 * The one rule: straight edges stay ruler-straight; ONLY curves rasterise,
 * as regular symmetric stairs. A corner is a quarter-circle of radius R
 * quantised onto a u-grid by midpoint sampling. R=24/u=4 yields the step
 * profile [16, 8, 4, 4, 0, 0] — four distinct stairs per corner.
 *
 * These are framework-free string generators. In React, compute once per
 * state and set via `style.clipPath` — never express one as a Tailwind
 * arbitrary value (both are far past the readable length).
 */

export type PixelShapeMode = 'sprite' | 'pixel';

/**
 * Sprite silhouette points. `inset` bakes in the footprint rule: a ringed
 * pill shrinks by the ring width so pill + ring occupy the same silhouette
 * as an unringed pill — selection changes an option's colour, never its
 * size.
 *
 * Emitted starting at the LEFT edge, mid-run, and ending on the same edge —
 * `ringBand()` relies on that to splice a hole in without a wedge.
 */
/** The quantised quarter-circle: per-row insets for one corner. */
function cornerProfile(R: number, u: number): number[] {
  const n = R / u;
  const prof: number[] = [];
  for (let k = 0; k < n; k++) {
    const dy = R - (k + 0.5) * u;
    const hw = Math.sqrt(R * R - dy * dy);
    prof.push(R - Math.min(R, Math.round(hw / u) * u));
  }
  return prof;
}

export function spritePts(inset: number, R = 24, u = 4): string[] {
  const n = R / u;
  const prof = cornerProfile(R, u);
  const i0 = inset;
  const L = (v: number) => `${v}px`;
  const M = (v: number) => `calc(100% - ${v}px)`; // mirrored (right / bottom) axis
  const pts: string[] = [];
  // top-left: up the stairs from (i0, i0+R) to (i0+prof[0], i0)
  pts.push(`${L(i0)} ${L(i0 + R)}`);
  for (let k = n - 1; k >= 1; k--)
    if (prof[k - 1] !== prof[k]) {
      pts.push(`${L(i0 + prof[k])} ${L(i0 + k * u)}`);
      pts.push(`${L(i0 + prof[k - 1])} ${L(i0 + k * u)}`);
    }
  pts.push(`${L(i0 + prof[0])} ${L(i0)}`);
  // top-right: mirror, down the stairs
  pts.push(`${M(i0 + prof[0])} ${L(i0)}`);
  for (let k = 1; k <= n - 1; k++)
    if (prof[k - 1] !== prof[k]) {
      pts.push(`${M(i0 + prof[k - 1])} ${L(i0 + k * u)}`);
      pts.push(`${M(i0 + prof[k])} ${L(i0 + k * u)}`);
    }
  pts.push(`${M(i0)} ${L(i0 + R)}`);
  // bottom-right
  pts.push(`${M(i0)} ${M(i0 + R)}`);
  for (let k = n - 1; k >= 1; k--)
    if (prof[k - 1] !== prof[k]) {
      pts.push(`${M(i0 + prof[k])} ${M(i0 + k * u)}`);
      pts.push(`${M(i0 + prof[k - 1])} ${M(i0 + k * u)}`);
    }
  pts.push(`${M(i0 + prof[0])} ${M(i0)}`);
  // bottom-left
  pts.push(`${L(i0 + prof[0])} ${M(i0)}`);
  for (let k = 1; k <= n - 1; k++)
    if (prof[k - 1] !== prof[k]) {
      pts.push(`${L(i0 + prof[k - 1])} ${M(i0 + k * u)}`);
      pts.push(`${L(i0 + prof[k])} ${M(i0 + k * u)}`);
    }
  pts.push(`${L(i0)} ${M(i0 + R)}`);
  return pts;
}

export function spriteClip(inset: number, R = 24, u = 4): string {
  return `polygon(${spritePts(inset, R, u).join(', ')})`;
}

/**
 * Pixel mode's chunky two-stair corner (the gem construction at pu=4).
 * Same vertex order and same start/end edge as `spritePts`, so
 * `ringBand()` serves both shape modes.
 */
export function pixelPts(inset: number, pu = 8): string[] {
  const i0 = inset;
  const L = (v: number) => `${v}px`;
  const M = (v: number) => `calc(100% - ${v}px)`;
  return [
    `${L(i0)} ${L(i0 + pu * 2)}`,
    `${L(i0 + pu)} ${L(i0 + pu * 2)}`,
    `${L(i0 + pu)} ${L(i0 + pu)}`,
    `${L(i0 + pu * 2)} ${L(i0 + pu)}`,
    `${L(i0 + pu * 2)} ${L(i0)}`,
    `${M(i0 + pu * 2)} ${L(i0)}`,
    `${M(i0 + pu * 2)} ${L(i0 + pu)}`,
    `${M(i0 + pu)} ${L(i0 + pu)}`,
    `${M(i0 + pu)} ${L(i0 + pu * 2)}`,
    `${M(i0)} ${L(i0 + pu * 2)}`,
    `${M(i0)} ${M(i0 + pu * 2)}`,
    `${M(i0 + pu)} ${M(i0 + pu * 2)}`,
    `${M(i0 + pu)} ${M(i0 + pu)}`,
    `${M(i0 + pu * 2)} ${M(i0 + pu)}`,
    `${M(i0 + pu * 2)} ${M(i0)}`,
    `${L(i0 + pu * 2)} ${M(i0)}`,
    `${L(i0 + pu * 2)} ${M(i0 + pu)}`,
    `${L(i0 + pu)} ${M(i0 + pu)}`,
    `${L(i0 + pu)} ${M(i0 + pu * 2)}`,
    `${L(i0)} ${M(i0 + pu * 2)}`,
  ];
}

/** The gem silhouette (NEW badge, primary CTAs): pixel corners on the 4px grid. */
export function gemClip(): string {
  return `polygon(${pixelPts(0, 4).join(', ')})`;
}

const shapePts = (mode: PixelShapeMode, inset: number, R = 24, pu = 8) =>
  mode === 'pixel' ? pixelPts(inset, pu) : spritePts(inset, R);

/**
 * A ring drawn as an actual BAND: the outer silhouette with the inner one
 * punched out, `evenodd`. Never a drop-shadow — `drop-shadow` traces the
 * alpha channel, so a fill-less pill gets its letterforms outlined instead
 * of its silhouette (see docs/pixel-ui.md, "Ringing a clipped shape").
 *
 * The hole is spliced in at 50% on the LEFT edge, where both silhouettes
 * run straight: the outgoing connector and the polygon's implicit closing
 * edge are then the same segment traversed twice, which has no area.
 * Splice anywhere else and a wedge appears.
 *
 * The band must be painted on a SIBLING layer of the clipped pill (the
 * wrapper's pseudo-element) — a clip on an ancestor deletes the label too.
 */
export function ringBand(
  mode: PixelShapeMode,
  w: number,
  R = 24,
  pu = 8
): string {
  const pts = [
    `0px 50%`,
    ...shapePts(mode, 0, R, pu),
    `0px 50%`,
    `${w}px 50%`,
    ...shapePts(mode, w, R, pu),
    `${w}px 50%`,
  ];
  return `polygon(evenodd, ${pts.join(', ')})`;
}

/**
 * A full-height side sheet's silhouette: stair-stepped corners on the
 * LEFT edge only (the right edge sits flush with the viewport — no
 * corners to rasterise). `leftInset` shifts just the left edge inward,
 * which is what draws the edge rule: paint the sheet's box in the rule
 * colour clipped to the OUTER silhouette, and clip the content layer to
 * the inner one (leftInset = rule width) — the stripe that remains
 * traces the staircase exactly, where a plain `border-left` would lose
 * its stroke on every stair (the documented clipped-border trap).
 */
export function sheetLeftPts(leftInset: number, R = 12, u = 4): string[] {
  const n = R / u;
  const prof = cornerProfile(R, u);
  const L = (v: number) => `${v}px`;
  const M = (v: number) => `calc(100% - ${v}px)`;
  const pts: string[] = [];
  // top-left: up the stairs from (leftInset, R) to (leftInset+prof[0], 0)
  pts.push(`${L(leftInset)} ${L(R)}`);
  for (let k = n - 1; k >= 1; k--)
    if (prof[k - 1] !== prof[k]) {
      pts.push(`${L(leftInset + prof[k])} ${L(k * u)}`);
      pts.push(`${L(leftInset + prof[k - 1])} ${L(k * u)}`);
    }
  pts.push(`${L(leftInset + prof[0])} 0%`);
  // square right corners
  pts.push(`100% 0%`);
  pts.push(`100% 100%`);
  // bottom-left: down the stairs, mirrored
  pts.push(`${L(leftInset + prof[0])} 100%`);
  for (let k = 1; k <= n - 1; k++)
    if (prof[k - 1] !== prof[k]) {
      pts.push(`${L(leftInset + prof[k - 1])} ${M(k * u)}`);
      pts.push(`${L(leftInset + prof[k])} ${M(k * u)}`);
    }
  pts.push(`${L(leftInset)} ${M(R)}`);
  return pts;
}

export function sheetLeftClip(leftInset: number, R = 12, u = 4): string {
  return `polygon(${sheetLeftPts(leftInset, R, u).join(', ')})`;
}

/**
 * Focus geometry. The focus mark is a 2px band OUTSIDE the silhouette with
 * a 2px surface gap — against selection's 4px band on the silhouette, so
 * the two marks differ in position and width as well as colour (WCAG 1.4.1).
 *
 * The gap is structural, not decoration: ink and accent sit only
 * 1.60–2.67:1 apart across the sets, below 1.4.11's 3:1, so the two marks
 * may never touch. Separated by surface, each is measured against the
 * surface instead. Never close it.
 */
export const FOCUS_W = 2;
export const FOCUS_GAP = 2;

/**
 * The focus band's radius grows by exactly the 4px it stands off, so it
 * stays concentric with the pill instead of tightening at the corners.
 */
export const focusR = (optR: number) => optR + FOCUS_GAP + FOCUS_W;

/**
 * The multi-select cursor mark shares focus's colour but sits ON the
 * silhouette — same meaning ("where I am"), different position. Full
 * strength, not a tint: the old ink@45% cursor measured 1.96–2.39:1
 * against the option's own fill and failed WCAG 1.4.11 on every set.
 */
export const CURSOR_W = 2;
