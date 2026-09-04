import {
  camoBody,
  pixHash,
  pixelLattice,
  quiltPixBody,
  valueNoise,
} from '@/lib/patterns';

/**
 * The seventeen (Malik, 2026-09-02): every pattern the lab prototyped
 * for the start screens, ported from docs/pattern-lab.html's GEN table
 * for the release post's pattern gallery. Three ship, and come straight
 * from lib/patterns; the other fourteen are the lab's lattice
 * predicates verbatim, so the post shows the real rejects rather than
 * pictures of them. Pixel fields run the lab's 1.7× render macro so
 * they look as they did on the bench; the camos apply it themselves.
 * Each carries the lab's own one-line note, which the gallery shows on
 * hover.
 *
 * The lab's Duotone mode read a filtered accent pool; here the pool is
 * the set's one accent, which is what every shipped screen runs.
 */
export type Palette = { ink: string; accent: string };
export type LabPattern = {
  id: string;
  name: string;
  note: string;
  shipped?: true;
  body: (w: number, h: number, p: Palette, s: number, seed: number) => string;
};

const MACRO = 1.7;

/** Which sail of a pinwheel block a lattice pixel falls in, or -1. */
function pinQuad(u: number, v: number, P: number): number {
  const half = P / 2;
  const x = ((u % P) + P) % P;
  const y = ((v % P) + P) % P;
  const lx = x % half;
  const ly = y % half;
  const m = half - 1;
  if (x < half && y < half) return lx >= ly ? 0 : -1;
  if (x >= half && y < half) return lx + ly >= m ? 1 : -1;
  if (x >= half && y >= half) return ly >= lx ? 2 : -1;
  return lx + ly <= m ? 3 : -1;
}

type ColorAt = (u: number, v: number) => string | null;
const lattice = (w: number, h: number, q: number, colorAt: ColorAt) =>
  pixelLattice(w, h, q, 1, null, colorAt);

export const LAB_PATTERNS: LabPattern[] = [
  {
    id: 'quiltpix',
    name: 'Quilt · pixel',
    note: 'The mixed quilt pushed through an 8-bit rasterizer: the same shapes rebuilt from chunky pixels.',
    shipped: true,
    body: (w, h, p, s, seed) =>
      quiltPixBody({
        w,
        h,
        ink: p.ink,
        pool: [p.accent],
        scale: s,
        seed,
        clear: null,
      }),
  },
  {
    id: 'pxtruchet',
    name: 'Quarter rounds · pixel',
    note: 'Bauhaus quarter-discs re-rasterized, every arc a stair-step, orientation hashed per cell.',
    body: (w, h, p, s, seed) => {
      const P = 8;
      return lattice(w, h, 8 * s * MACRO, (u, v) => {
        const ci = Math.floor(u / P);
        const cj = Math.floor(v / P);
        const x = ((u % P) + P) % P;
        const y = ((v % P) + P) % P;
        const o = Math.floor(pixHash(ci, cj, seed) * 4);
        const cx = o === 0 || o === 3 ? 0 : P;
        const cy = o === 0 || o === 1 ? 0 : P;
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        if (dx * dx + dy * dy > P * P) return null;
        return pixHash(ci, cj, seed + 11) < 0.08 ? p.accent : p.ink;
      });
    },
  },
  {
    id: 'pxhound',
    name: 'Houndstooth',
    note: 'Real houndstooth: a 2/2 twill, four dark and four light threads in both warp and weft. The cloth’s structure, not a picture of it.',
    body: (w, h, p, s) =>
      lattice(w, h, 8 * s * MACRO, (u, v) => {
        const warpUp = (((u - v) % 4) + 4) % 4 < 2;
        const dark = warpUp ? u % 8 < 4 : v % 8 < 4;
        return dark ? p.ink : null;
      }),
  },
  {
    id: 'pxherring',
    name: 'Herringbone',
    note: 'Twill diagonals with the direction flipped every eight columns, straight off the loom draft.',
    body: (w, h, p, s) =>
      lattice(w, h, 8 * s * MACRO, (u, v) => {
        const d = Math.floor(u / 8) % 2 ? u + v : u - v;
        return ((d % 4) + 4) % 4 < 2 ? p.ink : null;
      }),
  },
  {
    id: 'pxpinwheel',
    name: 'Pinwheel · classic',
    note: 'Quarter-square triangles rotating around each junction: the classic quilt block at pixel resolution.',
    body: (w, h, p, s) =>
      lattice(w, h, 9 * s * MACRO, (u, v) =>
        pinQuad(u, v, 8) >= 0 ? p.ink : null
      ),
  },
  {
    id: 'pxpinduo',
    name: 'Pinwheel · duo',
    note: 'Opposite sails in ink, the crossing pair in the accent: the coloured windmill.',
    body: (w, h, p, s) =>
      lattice(w, h, 9 * s * MACRO, (u, v) => {
        const quad = pinQuad(u, v, 8);
        if (quad < 0) return null;
        return quad === 0 || quad === 2 ? p.ink : p.accent;
      }),
  },
  {
    id: 'pxpingiant',
    name: 'Pinwheel · giant',
    note: 'The same block at double period: statement scale, reads from across the room.',
    body: (w, h, p, s) =>
      lattice(w, h, 9 * s * MACRO, (u, v) =>
        pinQuad(u, v, 16) >= 0 ? p.ink : null
      ),
  },
  {
    id: 'pxkilim',
    name: 'Kilim diamonds',
    note: 'Concentric stepped diamonds, the woven medallion, rings cycling ink and accent.',
    body: (w, h, p, s) => {
      const SEQ = [p.ink, p.accent, p.accent, null, p.ink, null, p.ink, null];
      return lattice(w, h, 8 * s * MACRO, (u, v) => {
        const du = Math.abs((((u % 16) + 16) % 16) - 8);
        const dv = Math.abs((((v % 16) + 16) % 16) - 8);
        return SEQ[(du + dv) % SEQ.length]!;
      });
    },
  },
  {
    id: 'pxsteps',
    name: 'Andean steps',
    note: 'Stepped chevron bands descending a staircase in two colours.',
    body: (w, h, p, s) =>
      lattice(w, h, 8 * s * MACRO, (u, v) => {
        const t = Math.floor(u / 3) % 14;
        const tri = t < 7 ? t : 14 - t;
        const band = Math.floor((v + tri * 2) / 4) % 3;
        return [p.ink, p.accent, null][band]!;
      }),
  },
  {
    id: 'pxstatic',
    name: 'Mosaic static',
    note: 'Seeded random blocks held to disciplined proportions.',
    body: (w, h, p, s, seed) =>
      lattice(w, h, 14 * s * MACRO, (u, v) => {
        if (pixHash(u, v, seed) >= 0.42) return null;
        const r = pixHash(u + 7919, v + 104729, seed);
        return r < 0.5 ? p.ink : p.accent;
      }),
  },
  {
    id: 'pxzigzag',
    name: 'Pixel zigzag',
    note: 'The knit chevron redrawn at terminal resolution: chunky steps instead of smooth strokes.',
    body: (w, h, p, s) =>
      lattice(w, h, 8 * s * MACRO, (u, v) => {
        const tri = Math.abs((Math.floor(u / 2) % 8) - 4);
        return (v + tri) % 8 < 3 ? p.ink : null;
      }),
  },
  {
    id: 'pxstripes',
    name: 'Candy stripes',
    note: 'The 45° stripe rebuilt from pixel stairs: a two-colour barber pole, ink and accent alternating.',
    body: (w, h, p, s) =>
      lattice(w, h, 8 * s * MACRO, (u, v) => {
        const k = (((u + v) % 12) + 12) % 12;
        if (k < 4) return p.ink;
        if (k >= 6 && k < 10) return p.accent;
        return null;
      }),
  },
  {
    id: 'pxchecker',
    name: 'Checker · diamond',
    note: 'The checkerboard turned 45°: at pixel resolution the diamond edges stair-step, which is the whole point.',
    body: (w, h, p, s, seed) => {
      const P = 7;
      return lattice(w, h, 8 * s * MACRO, (u, v) => {
        const i = Math.floor((u + v) / P);
        const j = Math.floor((u - v) / P);
        if ((((i + j) % 2) + 2) % 2 === 0) return null;
        return pixHash(i, j, seed) < 0.07 ? p.accent : p.ink;
      });
    },
  },
  {
    id: 'pxcamo',
    name: 'Camo · classic',
    note: 'Thresholded value noise: the paint-program camo tile. Dresses the easy sets.',
    shipped: true,
    body: (w, h, p, s, seed) =>
      camoBody('camo', {
        w,
        h,
        ink: p.ink,
        pool: [p.accent],
        scale: s,
        seed,
        clear: null,
      }),
  },
  {
    id: 'pxcamogiant',
    name: 'Camo · giant',
    note: 'The same noise a scale up, continents instead of patches, the accent on the field’s opposite extreme. Dresses the hard sets.',
    shipped: true,
    body: (w, h, p, s, seed) =>
      camoBody('camo-giant', {
        w,
        h,
        ink: p.ink,
        pool: [p.accent],
        scale: s,
        seed,
        clear: null,
      }),
  },
  {
    id: 'pxcontour',
    name: 'Camo · contours',
    note: 'One noise field sliced into alternating elevation bands: an organic topographic map, accent on the peaks.',
    body: (w, h, p, s, seed) =>
      lattice(w, h, 10 * s * MACRO, (u, v) => {
        const band = Math.floor(valueNoise(u, v, seed, 7) * 7);
        if (band % 2 === 0) return null;
        return band >= 5 ? p.accent : p.ink;
      }),
  },
  {
    id: 'pxpebble',
    name: 'Camo · pebbles',
    note: 'Worley cell noise: every pebble grows from its own seeded point, so the spacing is organic, never gridlike.',
    body: (w, h, p, s, seed) => {
      const P = 6;
      return lattice(w, h, 9 * s * MACRO, (u, v) => {
        const gx = Math.floor(u / P);
        const gy = Math.floor(v / P);
        let best = Infinity;
        let bestCell = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const cx = gx + dx;
            const cy = gy + dy;
            const fx = cx * P + pixHash(cx, cy, seed) * P;
            const fy = cy * P + pixHash(cx, cy, seed + 7) * P;
            const d = Math.hypot(u + 0.5 - fx, v + 0.5 - fy);
            if (d < best) {
              best = d;
              bestCell = cx * 131 + cy;
            }
          }
        if (best >= 2.4) return null;
        return pixHash(bestCell, 3, seed) < 0.1 ? p.accent : p.ink;
      });
    },
  },
];
