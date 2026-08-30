/**
 * The marketing surfaces' theme + pattern kit. SERVER-ONLY (reads the
 * wordmark from disk) — import from server components exclusively.
 *
 * THE COLOUR SCHEME IS PROVISIONAL (Malik, 2026-08-14): tokens below are
 * the "Brand · inverted" lean (cream ground, deep teal ink) judged in
 * docs/marketing-lab.html. The primary-colour decision (Set L mint/plum
 * vs the 2008 original aqua/navy vs cream/green) is still open — when it
 * lands, THIS is the one file to edit; every marketing page derives from
 * these tokens. docs/brand-lab.html is the judging surface.
 *
 * Pattern recipe and construction decisions (locked in the lab,
 * 2026-08-13/14): nav shares the ground it sits on; the release hero is
 * a pattern field with a cleared centre and NO card; camo XL at the
 * pinned scale/seed; chips are square "abbreviation boxes" (the gem is
 * app-only); art corners take the sprite silhouette.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  patternBody,
  quiltAccentPool,
  perceptualDist,
  type QuizPatternKind,
  type ClearRect,
} from '@/lib/patterns';
import { spriteClip, ringBand } from '@/lib/pixel';

export const MARKETING_THEME = {
  /** The scheme ground (nav over hero, panels, hero field). */
  ground: '#EDEDE3',
  /** The scheme ink — pattern dominant, chips, buttons, rules. */
  ink: '#02302C',
  /** The type colour (titles, body, dates). Equals ink in this scheme. */
  type: '#02302C',
  /** The content region ground — decided: white (lab Content dial). */
  contentGround: '#ffffff',
  /** The pinned pattern recipe (lab: Brand inverted · camo XL). */
  pattern: {
    kind: 'camo-giant' as QuizPatternKind,
    scale: 1.94,
    seed: 99,
    rate: 0.75,
  },
};

/** Button colours per the lab rule: ink fill; type when it differs from
 *  the ink (brand green's 4.29:1 teal), else the scheme ground. */
export function themeButton() {
  const t = MARKETING_THEME;
  return { bg: t.ink, fg: t.type !== t.ink ? t.type : t.ground };
}

/* ---- pools (mirrors scripts/brand-assets.mjs) --------------------------- */

export const SETS = {
  A: { surface: '#FFABC6', ink: '#4A1040' },
  C: { surface: '#E7F099', ink: '#02302C' },
  J: { surface: '#E6ACF4', ink: '#1C3601' },
  L: { surface: '#CFF6DD', ink: '#3F0167' },
  N: { surface: '#9EDAFF', ink: '#4A1040' },
  Q: { surface: '#D9CCF9', ink: '#3E1060' },
  R: { surface: '#E4BDF7', ink: '#751100' },
};
const SURFACES = Object.values(SETS).map((s) => s.surface);
const INKS = [...new Set(Object.values(SETS).map((s) => s.ink))];
const ACCENTS = ['#674900', '#BD00AD', '#8D0381', '#745400', '#824616'];
/** Everything the product owns — the lab's pinned pool. */
const EVERYTHING = [...SURFACES, ...INKS, ...ACCENTS, '#FA6C5B', '#05A24B'];

/**
 * The covers' nine — `setsMix` ungated, as decided for the social
 * artwork and mirrored from `scripts/brand-assets.mjs`'s UNGATED set.
 *
 * It keeps the INK gate (a tile the dominant's own colour has no edge,
 * so it vanishes) and DROPS the ground gate. `quiltAccentPool`'s 0.17
 * floor exists to stop a pattern muddying a surface a student reads
 * against for twenty minutes; a cover and the footer band carry no
 * text, and a quilt tile is a shape with an edge and a gap around it.
 * Gated, seven of the nine fall out and the band reads impoverished —
 * which is the study-surface rule being applied to decoration.
 *
 * Derived, not written out, so a new set joins the covers and the band
 * by editing SETS alone (Malik, 2026-08-24).
 */
export function coverPool(ground: string, ink: string): string[] {
  return [...SURFACES, ...INKS].filter(
    (c) => c !== ink && c !== ground && perceptualDist(c, ink) > 0.09
  );
}

function themePool(): string[] {
  const t = MARKETING_THEME;
  return quiltAccentPool(
    t.ground,
    t.ink,
    EVERYTHING.filter((c) => c !== t.ink && c !== t.ground)
  );
}

/* ---- fields -------------------------------------------------------------- */

function latticeOffset(w: number, h: number, scale: number) {
  const t = 62 * scale;
  const span = (len: number) => Math.ceil(len / t) * t + t;
  return { ox: -(span(w) - w) / 2, oy: -(span(h) - h) / 2 };
}

export interface FieldOptions {
  seedOffset?: number;
  /** Smaller canvases take proportionally smaller cells (the LinkedIn
   *  cover's 0.6 move). */
  scaleMul?: number;
  clear?: ClearRect | null;
}

/** A pattern field as an inline SVG string, driven by the theme recipe. */
export function fieldSvg(
  w: number,
  h: number,
  opts: FieldOptions = {}
): string {
  const t = MARKETING_THEME;
  const scale = t.pattern.scale * (opts.scaleMul ?? 1);
  const seed = (t.pattern.seed + (opts.seedOffset ?? 0)) % 100;
  const { ox, oy } = latticeOffset(w, h, scale);
  const clear = opts.clear
    ? { ...opts.clear, x: opts.clear.x - ox, y: opts.clear.y - oy }
    : null;
  const body = patternBody(t.pattern.kind, {
    w: w - ox * 2,
    h: h - oy * 2,
    ink: t.ink,
    pool: themePool(),
    scale,
    seed,
    clear,
    rate: t.pattern.rate,
  });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" style="display:block;width:100%;height:100%">` +
    `<rect width="${w}" height="${h}" fill="${t.ground}"/>` +
    `<g transform="translate(${ox} ${oy})">${body}</g></svg>`
  );
}

/** Deterministic per-slug seed offset, so every post owns its artwork. */
export function slugSeed(slug: string): number {
  let a = 7;
  for (const ch of slug) a = (a * 31 + ch.charCodeAt(0)) | 0;
  return (a >>> 0) % 100;
}

/* ---- clips --------------------------------------------------------------- */

export const SPRITE_CLIP = spriteClip(0);
export const RING_BAND = ringBand('sprite', 2);

/* ---- the wordmark -------------------------------------------------------- */

const markSource = fs.readFileSync(
  path.join(process.cwd(), 'public/logicola-wordmark.svg'),
  'utf8'
);
const MARK_PATHS = [
  ...markSource.matchAll(/<path\s+d="([^"]+)"\s+fill="([^"]+)"/g),
].map((m) => [/^#f/i.test(m[2]) ? 'w' : 'g', m[1]] as const);
if (MARK_PATHS.length !== 16) {
  throw new Error(
    `public/logicola-wordmark.svg parsed to ${MARK_PATHS.length} paths, expected 16`
  );
}

/** The wordmark recoloured through its roles: body ink, knockout = the
 *  ground it sits on (the lettering is a hole, never white ink). */
export function markSvg(height: number, body: string, knock: string): string {
  const k = height / 190;
  const w = Math.round(265 * k);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${height}" viewBox="0 0 265 190" style="display:block" aria-hidden="true">` +
    MARK_PATHS.map(
      ([role, d]) => `<path d="${d}" fill="${role === 'g' ? body : knock}"/>`
    ).join('') +
    '</svg>'
  );
}

// Re-export for marketing pages that need distances (e.g. future pools).
export { perceptualDist };
