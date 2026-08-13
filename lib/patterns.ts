/**
 * The pattern engine — the pattern lab's generators, ported for the
 * app's decorative layers. Live in the app: **Camo · classic** (easy
 * sets) and **Camo · giant** (hard sets), per Malik 2026-08-07;
 * **Quilt · pixel** stays ported and fixture-locked as the dormant
 * alternative. Placement contract in docs/pixel-ui.md § Pattern
 * placement: the start screen wears the pattern around a clean panel,
 * the question screen banishes it to a 112px footer band, and mobile
 * question screens stay clean.
 *
 * Everything here is a pure string generator, deterministic in its seed —
 * parity with the lab is locked by tests against fixtures produced by
 * running the lab's own JavaScript (lib/__fixtures__/patterns-lab.json).
 */

/** Deterministic PRNG — the lab's mulberry32, bit for bit. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexTriple(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export interface Oklch {
  L: number;
  C: number;
  h: number;
}

export function hexToOklch(hex: string): Oklch {
  const [R, G, B] = hexTriple(hex).map((v) => srgbToLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    L,
    C: Math.hypot(a, b),
    h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
  };
}

/**
 * Perceptual distance in OKLab. RGB Euclidean underrates pairs like white
 * vs pastel-lavender (clearly distinct to the eye, numerically close in
 * RGB), which silently dropped Set J's hue from the lab's pools.
 */
export function perceptualDist(hexA: string, hexB: string): number {
  const A = hexToOklch(hexA);
  const B = hexToOklch(hexB);
  const ha = (A.h * Math.PI) / 180;
  const hb = (B.h * Math.PI) / 180;
  return Math.hypot(
    A.L - B.L,
    A.C * Math.cos(ha) - B.C * Math.cos(hb),
    A.C * Math.sin(ha) - B.C * Math.sin(hb)
  );
}

/**
 * The lab's pool filter, one gate for chips and quilt alike: an accent
 * must clear the surface comfortably (> 0.17) and not impersonate the ink
 * (> 0.09). Survivors sort by lightness contrast AGAINST THE INK, so the
 * first accent is always the pool's best value-partner for the fg.
 */
export function quiltAccentPool(
  surface: string,
  ink: string,
  candidates: readonly string[]
): string[] {
  const inkL = hexToOklch(ink).L;
  return candidates
    .filter(
      (c) => perceptualDist(c, surface) > 0.17 && perceptualDist(c, ink) > 0.09
    )
    .sort(
      (a, b) =>
        Math.abs(hexToOklch(b).L - inkL) - Math.abs(hexToOklch(a).L - inkL)
    );
}

/**
 * Whole-cell clearing. A shape either renders whole or not at all, never
 * sliced — pixel sprites cannot survive slicing. The hole itself may be a
 * rounded rect (the panel), and the sprites stair-step around its arcs.
 */
export interface ClearRect {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

export type QuiltTreatment = 'panel' | 'footer';

/** The question screen's footer band height (px), fixed by the contract. */
export const FOOTER_BAND_PX = 112;

/**
 * The centre clearing for a treatment at a given canvas size.
 *
 * Panel (start/end screens): the lab plate's construction (760px width
 * cap, whole-cell rounded hole, r=28), centred at 50% with a 560px
 * height cap on BOTH breakpoints. Two deliberate deviations from the
 * lab's desktop numbers (44% / 480px): the app's start content is truly
 * centred (the lab's sat high on a since-removed filler hack), and it
 * carries the always-visible level dial the lab never modelled — 480px
 * ran the plate's edge through the dial, the exact thing the plate
 * exists to prevent.
 *
 * Footer (question screens): everything except the bottom 112px strip is
 * cleared; the card must reserve 152px of bottom padding so the strip
 * underlines the card instead of running under the controls.
 */
export function clearRectFor(
  treatment: QuiltTreatment,
  w: number,
  h: number,
  mobile: boolean
): ClearRect {
  if (treatment === 'footer') {
    return { x: -1, y: -1, w: w + 2, h: h - FOOTER_BAND_PX + 1, r: 0 };
  }
  const pw = Math.min(760, w * 0.88);
  const ph = mobile ? Math.min(560, h * 0.74) : Math.min(560, h * 0.78);
  return { x: (w - pw) / 2, y: h * 0.5 - ph / 2, w: pw, h: ph, r: 28 };
}

/**
 * Exact rect vs rounded-rect intersection: a cell is hidden when it
 * overlaps the clearing's bounding box AND is not saved by sitting in a
 * square corner-notch beyond the corner arc.
 */
function hidden(
  clear: ClearRect | null,
  x: number,
  y: number,
  ww: number,
  hh: number
): boolean {
  if (!clear) return false;
  const c = clear;
  if (x >= c.x + c.w || x + ww <= c.x || y >= c.y + c.h || y + hh <= c.y)
    return false;
  if (!c.r) return true;
  if (x + ww > c.x + c.r && x < c.x + c.w - c.r) return true;
  if (y + hh > c.y + c.r && y < c.y + c.h - c.r) return true;
  const ccx = x + ww <= c.x + c.r + 0.01 ? c.x + c.r : c.x + c.w - c.r;
  const ccy = y + hh <= c.y + c.r + 0.01 ? c.y + c.r : c.y + c.h - c.r;
  const nx = Math.max(x, Math.min(ccx, x + ww));
  const ny = Math.max(y, Math.min(ccy, y + hh));
  return (nx - ccx) ** 2 + (ny - ccy) ** 2 <= c.r * c.r;
}

export interface QuiltPixOptions {
  w: number;
  h: number;
  /** The set's ink — the quilt's ~70% dominant colour. */
  ink: string;
  /** Pre-filtered accent pool (see quiltAccentPool). */
  pool: readonly string[];
  /** Cell scale multiplier. 1 on desktop, 0.6 on phones. */
  scale: number;
  seed: number;
  clear: ClearRect | null;
  /**
   * Probability a cell TRIES to be an accent. Defaults to 0.28, which is
   * what every quiz screen runs and what the fixtures are locked to —
   * omit it and nothing about the app's output changes.
   *
   * It exists for the brand covers (Malik, 2026-08-12), which want a far
   * denser field than a quiz card does. Note the number is not the share
   * you get: cells whose left or upper neighbour is already an accent are
   * rejected, so 0.28 measures ~21% of the artwork and the rule's own
   * ceiling is ~52%, not 100%.
   */
  rate?: number;
}

/**
 * Quilt · pixel: each cell is a 7×7 sprite grid and every shape is
 * rebuilt from whole pixels — midpoint-circle dots, corner-notched
 * squares, stair-stepped quarter-rounds. Rules shared by the quilt
 * family: one shape per cell, accent cells never sit orthogonally
 * adjacent, the rhythm holds at ~70% dominant / 30% accents.
 *
 * The rng is consumed for hidden cells too, so the visible composition
 * stays put when the centre treatment changes.
 */
export function quiltPixBody(opts: QuiltPixOptions): string {
  const { w, h, ink, pool, scale, seed, clear, rate = 0.28 } = opts;
  const rng = mulberry32(seed >>> 0);
  const t = 62 * scale;
  const pad = t * 0.09;
  const cell = t - pad * 2;
  const cols = Math.ceil(w / t) + 1;
  const rows = Math.ceil(h / t) + 1;
  const accent: boolean[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
  const P = 7;
  let out = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const left = j > 0 && accent[i][j - 1];
      const up = i > 0 && accent[i - 1][j];
      let fillCol = ink;
      if (pool.length && !left && !up && rng() < rate) {
        fillCol = pool[Math.floor(rng() * pool.length)];
        accent[i][j] = true;
      }
      const x = j * t + pad;
      const y = i * t + pad;

      const q = cell / P;
      const roll = rng();
      const fill: boolean[] = new Array(P * P);
      if (roll < 0.4) {
        // Rounded square: everything but the four corner pixels.
        for (let jj = 0; jj < P; jj++)
          for (let ii = 0; ii < P; ii++)
            fill[jj * P + ii] = !(
              (ii === 0 || ii === P - 1) &&
              (jj === 0 || jj === P - 1)
            );
      } else if (roll < 0.7) {
        // Chunky midpoint circle.
        const R = P / 2;
        for (let jj = 0; jj < P; jj++)
          for (let ii = 0; ii < P; ii++) {
            const dx = ii + 0.5 - P / 2;
            const dy = jj + 0.5 - P / 2;
            fill[jj * P + ii] = dx * dx + dy * dy <= R * R;
          }
      } else {
        // Stair-stepped quarter-round anchored at a random corner.
        const o = Math.floor(rng() * 4);
        const cx = o === 0 || o === 3 ? 0 : P;
        const cy = o === 0 || o === 1 ? 0 : P;
        for (let jj = 0; jj < P; jj++)
          for (let ii = 0; ii < P; ii++) {
            const dx = ii + 0.5 - cx;
            const dy = jj + 0.5 - cy;
            fill[jj * P + ii] = dx * dx + dy * dy <= P * P;
          }
      }
      let piece = `<g fill="${fillCol}" fill-opacity="1" shape-rendering="crispEdges">`;
      for (let jj = 0; jj < P; jj++) {
        let ii = 0;
        while (ii < P) {
          if (!fill[jj * P + ii]) {
            ii++;
            continue;
          }
          let len = 0;
          while (ii + len < P && fill[jj * P + ii + len]) len++;
          // +0.4 vertical overlap: same-fill rows may not meet exactly
          // after subpixel rounding, and a hairline seam breaks the sprite.
          piece += `<rect x="${x + ii * q}" y="${y + jj * q}" width="${len * q}" height="${q + 0.4}"/>`;
          ii += len;
        }
      }
      piece += '</g>';
      if (!hidden(clear, x, y, cell, cell)) out += piece;
    }
  }
  return out;
}

// ---- Pixel fields ---------------------------------------------------------
// Pure functions over a fat-pixel lattice (the lab's Camo family engine).

/**
 * Deterministic per-coordinate hash — colorAt must be pure (the RLE
 * renderer re-evaluates neighbours), so fields hash (u, v, seed) instead
 * of consuming a sequential rng.
 */
export function pixHash(u: number, v: number, seed: number): number {
  let x = (u * 374761393 + v * 668265263 + (seed | 0) * 971) | 0;
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

/**
 * Smoothstep-interpolated value noise over macro cells of `cell` lattice
 * pixels — the shared engine of the camo family.
 */
export function valueNoise(
  u: number,
  v: number,
  seed: number,
  cell: number
): number {
  const gx = Math.floor(u / cell);
  const gy = Math.floor(v / cell);
  const sm = (t: number) => t * t * (3 - 2 * t);
  const fx = sm((((u % cell) + cell) % cell) / cell);
  const fy = sm((((v % cell) + cell) % cell) / cell);
  const n00 = pixHash(gx, gy, seed);
  const n10 = pixHash(gx + 1, gy, seed);
  const n01 = pixHash(gx, gy + 1, seed);
  const n11 = pixHash(gx + 1, gy + 1, seed);
  return (
    n00 * (1 - fx) * (1 - fy) +
    n10 * fx * (1 - fy) +
    n01 * (1 - fx) * fy +
    n11 * fx * fy
  );
}

/**
 * Shared renderer for the pixel-field family. Evaluates colorAt(u, v)
 * over a fat-pixel lattice and merges same-coloured visible runs per
 * row, so a full card is hundreds of rects rather than tens of
 * thousands. Clearing happens per whole pixel — pixel patterns are
 * never sliced.
 */
function pixelLattice(
  w: number,
  h: number,
  q: number,
  a: number,
  clear: ClearRect | null,
  colorAt: (u: number, v: number) => string | null
): string {
  const cols = Math.ceil(w / q);
  const rows = Math.ceil(h / q);
  let out = `<g shape-rendering="crispEdges" fill-opacity="${a}">`;
  for (let v = 0; v < rows; v++) {
    let u = 0;
    while (u < cols) {
      const c = colorAt(u, v);
      if (!c || hidden(clear, u * q, v * q, q, q)) {
        u++;
        continue;
      }
      let len = 1;
      while (
        u + len < cols &&
        colorAt(u + len, v) === c &&
        !hidden(clear, (u + len) * q, v * q, q, q)
      )
        len++;
      out += `<rect x="${u * q}" y="${v * q}" width="${len * q}" height="${q + 0.4}" fill="${c}"/>`;
      u += len;
    }
  }
  return out + '</g>';
}

/**
 * Pixel fields run 1.7× more macro than their tuned bases (the lab's
 * render-time `sEff`); quilts are already cell-scaled.
 */
const PIXEL_FIELD_MACRO = 1.7;

/**
 * Camo · classic: thresholded value noise — the paint-program camo tile.
 * Camo · giant: the same field at coarser cells and a bigger pixel —
 * continents instead of patches — with the field's OPPOSITE extreme in
 * the accent, so the two families interlock. Classic dresses the easy
 * sets, giant the hard ones (Malik, 2026-08-07).
 */
export function camoBody(
  kind: 'camo' | 'camo-giant',
  opts: QuiltPixOptions
): string {
  const { w, h, ink, pool, scale, seed, clear } = opts;
  const s = PIXEL_FIELD_MACRO * scale;
  const c1 = pool[0] || ink;
  if (kind === 'camo') {
    const q = 10 * s;
    return pixelLattice(w, h, q, 1, clear, (u, v) => {
      if (valueNoise(u, v, seed, 6) > 0.58) return ink;
      if (valueNoise(u, v, seed + 31, 6) > 0.62) return c1;
      return null;
    });
  }
  const q = 12 * s;
  return pixelLattice(w, h, q, 1, clear, (u, v) => {
    const n = valueNoise(u, v, seed, 9);
    if (n > 0.63) return ink;
    if (n < 0.37) return c1;
    return null;
  });
}

// ---- Dispatch --------------------------------------------------------------

export type QuizPatternKind = 'quilt' | 'camo' | 'camo-giant';

export function patternBody(
  kind: QuizPatternKind,
  opts: QuiltPixOptions
): string {
  return kind === 'quilt' ? quiltPixBody(opts) : camoBody(kind, opts);
}

/** The full SVG document for a decorative layer of the given size. */
export function patternSvg(
  kind: QuizPatternKind,
  opts: QuiltPixOptions
): string {
  return `<svg width="${opts.w}" height="${opts.h}" viewBox="0 0 ${opts.w} ${opts.h}" style="display:block">${patternBody(kind, opts)}</svg>`;
}
