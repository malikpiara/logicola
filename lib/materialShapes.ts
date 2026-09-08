/**
 * Material's shape library, drawn from its own definitions (Malik,
 * 2026-09-07). The release post's Material figure started as a sampled
 * picture and the thin shapes died twice — once in the sampling, once on
 * the grid. This is a port of androidx's `MaterialShapes` (AOSP, Apache
 * 2.0): every one of the 35 shapes is one of four constructions — a
 * regular polygon, a star, a rectangle, or a short list of points
 * repeated around a centre (mirrored or not) — with a rounding radius
 * per vertex. The port reproduces the constructions and the corner
 * rounding as circular arcs with the library's edge-length clamping.
 * The one omission is the "smoothing" flank some corners carry, which
 * moves a curve by less than a grid cell at the sizes the post draws.
 *
 * Pure: no DOM. `rasterise` is a supersampled scanline fill so the
 * island can redraw the whole library on a dial step without a canvas,
 * and so a test can pin a shape's grid.
 */
export type Pt = readonly [number, number];

interface Shape {
  pts: Pt[];
  rs: number[];
}

const R15 = 0.15;
const R20 = 0.2;
const R30 = 0.3;
const R50 = 0.5;
const R100 = 1;

const rad = (deg: number) => (deg * Math.PI) / 180;

function rot(p: Pt, deg: number, c: Pt = [0, 0]): Pt {
  const a = rad(deg);
  const x = p[0] - c[0];
  const y = p[1] - c[1];
  return [
    x * Math.cos(a) - y * Math.sin(a) + c[0],
    x * Math.sin(a) + y * Math.cos(a) + c[1],
  ];
}

function regular(n: number, rounding = 0, per?: number[]): Shape {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n;
    pts.push([Math.cos(a), Math.sin(a)]);
  }
  return { pts, rs: per ?? Array(n).fill(rounding) };
}

function rectangle(w: number, h: number, per: number[]): Shape {
  const l = -w / 2;
  const t = -h / 2;
  const r = w / 2;
  const b = h / 2;
  return {
    pts: [
      [r, b],
      [l, b],
      [l, t],
      [r, t],
    ],
    rs: per,
  };
}

function star(n: number, inner: number, rounding: number): Shape {
  const pts: Pt[] = [];
  const rs: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n;
    pts.push([Math.cos(a), Math.sin(a)]);
    rs.push(rounding);
    const b = (Math.PI / n) * (2 * i + 1);
    pts.push([inner * Math.cos(b), inner * Math.sin(b)]);
    rs.push(rounding);
  }
  return { pts, rs };
}

type PNR = readonly [Pt, number];

/** androidx's `customPolygon` + `doRepeat`, including the mirrored variant. */
function custom(
  pnr: readonly PNR[],
  reps: number,
  mirroring = false,
  center: Pt = [0.5, 0.5]
): Shape {
  const pts: Pt[] = [];
  const rs: number[] = [];
  if (mirroring) {
    const angles = pnr.map(
      ([p]) => (Math.atan2(p[1] - center[1], p[0] - center[0]) * 180) / Math.PI
    );
    const dists = pnr.map(([p]) =>
      Math.hypot(p[0] - center[0], p[1] - center[1])
    );
    const actual = reps * 2;
    const section = 360 / actual;
    for (let it = 0; it < actual; it++) {
      for (let index = 0; index < pnr.length; index++) {
        const i = it % 2 === 0 ? index : pnr.length - 1 - index;
        if (i > 0 || it % 2 === 0) {
          const deg =
            section * it +
            (it % 2 === 0 ? angles[i]! : section - angles[i]! + 2 * angles[0]!);
          const a = rad(deg);
          pts.push([
            Math.cos(a) * dists[i]! + center[0],
            Math.sin(a) * dists[i]! + center[1],
          ]);
          rs.push(pnr[i]![1]);
        }
      }
    }
  } else {
    for (let k = 0; k < pnr.length * reps; k++) {
      const [p, r] = pnr[k % pnr.length]!;
      pts.push(rot(p, (Math.floor(k / pnr.length) * 360) / reps, center));
      rs.push(r);
    }
  }
  return { pts, rs };
}

function transform(s: Shape, fn: (p: Pt) => Pt): Shape {
  return { pts: s.pts.map(fn), rs: s.rs };
}

const norm = (v: Pt): Pt => {
  const l = Math.hypot(v[0], v[1]);
  return l ? [v[0] / l, v[1] / l] : [0, 0];
};

/**
 * Replace each rounded vertex with a circular arc tangent to both edges.
 * The cut along each edge is r·cot(θ/2); when two cuts would overrun an
 * edge they are scaled down together, as the library does.
 */
function outline(s: Shape, samples = 12): Pt[] {
  const { pts, rs } = s;
  const n = pts.length;
  const cuts: number[] = [];
  const geo: { d1: Pt; d2: Pt; cos: number }[] = [];
  for (let i = 0; i < n; i++) {
    const v = pts[i]!;
    const p = pts[(i + n - 1) % n]!;
    const q = pts[(i + 1) % n]!;
    const d1 = norm([p[0] - v[0], p[1] - v[1]]);
    const d2 = norm([q[0] - v[0], q[1] - v[1]]);
    const cos = Math.max(-1, Math.min(1, d1[0] * d2[0] + d1[1] * d2[1]));
    const sin = Math.sqrt(Math.max(0, 1 - cos * cos));
    const r = rs[i]!;
    cuts.push(sin > 1e-3 && r > 0 ? (r * (cos + 1)) / sin : 0);
    geo.push({ d1, d2, cos });
  }
  const allowed = cuts.slice();
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const L = Math.hypot(pts[i]![0] - pts[j]![0], pts[i]![1] - pts[j]![1]);
    const tot = cuts[i]! + cuts[j]!;
    if (tot > L && tot > 0) {
      const f = L / tot;
      allowed[i] = Math.min(allowed[i]!, cuts[i]! * f);
      allowed[j] = Math.min(allowed[j]!, cuts[j]! * f);
    }
  }
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const v = pts[i]!;
    const { d1, d2, cos } = geo[i]!;
    const c = allowed[i]!;
    if (c <= 1e-6) {
      out.push(v);
      continue;
    }
    const p1: Pt = [v[0] + d1[0] * c, v[1] + d1[1] * c];
    const p2: Pt = [v[0] + d2[0] * c, v[1] + d2[1] * c];
    const half = Math.acos(cos) / 2;
    const rr = c * Math.tan(half);
    const bis = norm([d1[0] + d2[0], d1[1] + d2[1]]);
    const k = rr / Math.sin(half);
    const cx = v[0] + bis[0] * k;
    const cy = v[1] + bis[1] * k;
    const a1 = Math.atan2(p1[1] - cy, p1[0] - cx);
    const a2 = Math.atan2(p2[1] - cy, p2[0] - cx);
    let da = a2 - a1;
    while (da > Math.PI) da -= 2 * Math.PI;
    while (da < -Math.PI) da += 2 * Math.PI;
    for (let t = 0; t <= samples; t++) {
      const a = a1 + (da * t) / samples;
      out.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
  }
  return out;
}

/** Fit the outline into the unit square, longest side to 1, centred. */
function normalise(poly: Pt[]): Pt[] {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX;
  const h = Math.max(...ys) - minY;
  const s = 1 / Math.max(w, h);
  const ox = (1 - w * s) / 2;
  const oy = (1 - h * s) / 2;
  return poly.map((p) => [(p[0] - minX) * s + ox, (p[1] - minY) * s + oy]);
}

const P = (x: number, y: number, r = 0): PNR => [[x, y], r];

const DEFS: readonly [string, () => Shape][] = [
  ['Circle', () => regular(10, R100)],
  ['Square', () => rectangle(1, 1, [R30, R30, R30, R30])],
  [
    'Slanted',
    () => custom([P(0.926, 0.97, 0.189), P(-0.021, 0.967, 0.187)], 2),
  ],
  [
    'Arch',
    () => transform(regular(4, 0, [R100, R100, R20, R20]), (p) => rot(p, -135)),
  ],
  [
    'Fan',
    () =>
      custom(
        [
          P(1.004, 1, 0.148),
          P(0, 1, 0.151),
          P(0, -0.003, 0.148),
          P(0.978, 0.02, 0.803),
        ],
        1
      ),
  ],
  [
    'Arrow',
    () =>
      custom(
        [
          P(0.5, 0.892, 0.313),
          P(-0.216, 1.05, 0.207),
          P(0.499, -0.16, 0.215),
          P(1.225, 1.06, 0.211),
        ],
        1
      ),
  ],
  ['Semicircle', () => rectangle(1.6, 1, [R20, R20, R100, R100])],
  [
    'Oval',
    () =>
      transform(
        transform(regular(8, R100), (p) => [p[0], p[1] * 0.64]),
        (p) => rot(p, -45)
      ),
  ],
  [
    'Pill',
    () =>
      custom(
        [P(0.961, 0.039, 0.426), P(1.001, 0.428), P(1, 0.609, 1)],
        2,
        true
      ),
  ],
  ['Triangle', () => transform(regular(3, R20), (p) => rot(p, -90))],
  ['Diamond', () => custom([P(0.5, 1.096, 0.151), P(0.04, 0.5, 0.159)], 2)],
  [
    'Clamshell',
    () =>
      custom(
        [P(0.171, 0.841, 0.159), P(-0.02, 0.5, 0.14), P(0.17, 0.159, 0.159)],
        2
      ),
  ],
  [
    'Pentagon',
    () =>
      custom(
        [P(0.5, -0.009, 0.172), P(1.03, 0.365, 0.164), P(0.828, 0.97, 0.169)],
        1,
        true
      ),
  ],
  [
    'Gem',
    () =>
      custom(
        [
          P(0.499, 1.023, 0.241),
          P(-0.005, 0.792, 0.208),
          P(0.073, 0.258, 0.228),
          P(0.433, 0, 0.491),
        ],
        1,
        true
      ),
  ],
  ['Sunny', () => star(8, 0.8, R15)],
  [
    'Very sunny',
    () => custom([P(0.5, 1.08, 0.085), P(0.358, 0.843, 0.085)], 8),
  ],
  [
    '4-sided cookie',
    () => custom([P(1.237, 1.236, 0.258), P(0.5, 0.918, 0.233)], 4),
  ],
  [
    '6-sided cookie',
    () => custom([P(0.723, 0.884, 0.394), P(0.5, 1.099, 0.398)], 6),
  ],
  ['7-sided cookie', () => transform(star(7, 0.75, R50), (p) => rot(p, -90))],
  ['9-sided cookie', () => transform(star(9, 0.8, R50), (p) => rot(p, -90))],
  ['12-sided cookie', () => transform(star(12, 0.8, R50), (p) => rot(p, -90))],
  [
    'Ghost-ish',
    () =>
      custom(
        [P(0.5, 0, 1), P(1, 0, 1), P(1, 1.14, 0.254), P(0.575, 0.906, 0.253)],
        1,
        true
      ),
  ],
  [
    '4-leaf clover',
    () => custom([P(0.5, 0.074), P(0.725, -0.099, 0.476)], 4, true),
  ],
  ['8-leaf clover', () => custom([P(0.5, 0.036), P(0.758, -0.101, 0.209)], 8)],
  ['Burst', () => custom([P(0.5, -0.006, 0.006), P(0.592, 0.158, 0.006)], 12)],
  [
    'Soft burst',
    () => custom([P(0.193, 0.277, 0.053), P(0.176, 0.055, 0.053)], 10),
  ],
  ['Boom', () => custom([P(0.457, 0.296, 0.007), P(0.5, -0.051, 0.007)], 15)],
  [
    'Soft boom',
    () =>
      custom(
        [
          P(0.733, 0.454),
          P(0.839, 0.437, 0.532),
          P(0.949, 0.449, 0.439),
          P(0.998, 0.478, 0.174),
        ],
        16,
        true
      ),
  ],
  [
    'Flower',
    () =>
      custom(
        [P(0.37, 0.187), P(0.416, 0.049, 0.381), P(0.479, 0.001, 0.095)],
        8,
        true
      ),
  ],
  [
    'Puffy',
    () =>
      transform(
        custom(
          [
            P(0.5, 0.053),
            P(0.545, -0.04, 0.405),
            P(0.67, -0.035, 0.426),
            P(0.717, 0.066, 0.574),
            P(0.722, 0.128),
            P(0.777, 0.002, 0.36),
            P(0.914, 0.149, 0.66),
            P(0.926, 0.289, 0.66),
            P(0.881, 0.346),
            P(0.94, 0.344, 0.126),
            P(1.003, 0.437, 0.255),
          ],
          2,
          true
        ),
        (p) => [p[0], p[1] * 0.742]
      ),
  ],
  [
    'Puffy diamond',
    () =>
      custom(
        [P(0.87, 0.13, 0.146), P(0.818, 0.357), P(1, 0.332, 0.853)],
        4,
        true
      ),
  ],
  [
    'Pixel circle',
    () =>
      custom(
        [
          P(0.5, 0),
          P(0.704, 0),
          P(0.704, 0.065),
          P(0.843, 0.065),
          P(0.843, 0.148),
          P(0.926, 0.148),
          P(0.926, 0.296),
          P(1, 0.296),
        ],
        2,
        true
      ),
  ],
  [
    'Pixel triangle',
    () =>
      custom(
        [
          P(0.11, 0.5),
          P(0.113, 0),
          P(0.287, 0),
          P(0.287, 0.087),
          P(0.421, 0.087),
          P(0.421, 0.17),
          P(0.56, 0.17),
          P(0.56, 0.265),
          P(0.674, 0.265),
          P(0.675, 0.344),
          P(0.789, 0.344),
          P(0.789, 0.439),
          P(0.888, 0.439),
        ],
        1,
        true
      ),
  ],
  [
    'Bun',
    () =>
      custom(
        [P(0.796, 0.5), P(0.853, 0.518, 1), P(0.992, 0.631, 1), P(0.968, 1, 1)],
        2,
        true
      ),
  ],
  [
    'Heart',
    () =>
      custom(
        [
          P(0.5, 0.268, 0.016),
          P(0.792, -0.066, 0.958),
          P(1.064, 0.276, 1),
          P(0.501, 0.946, 0.129),
        ],
        1,
        true
      ),
  ],
];

export interface MaterialShape {
  /** Material's own name for the shape. */
  name: string;
  /** Dense outline, normalised into the unit square (longest side 1). */
  outline: Pt[];
}

/** The library in Material's own display order, 35 shapes. */
export const MATERIAL_SHAPES: readonly MaterialShape[] = DEFS.map(
  ([name, build]) => ({ name, outline: normalise(outline(build())) })
);

/**
 * Coverage rasteriser: `n` cells across the unit square, `k`×`k` samples
 * per cell along even-odd scanlines. A cell is filled when at least
 * `threshold` of its samples fall inside the outline. Pure and fast
 * enough to redraw the library on every dial step.
 *
 * The threshold is Material's own (Malik, 2026-09-08: "what is Google's
 * pixel circle doing?"). Their Pixel circle is hand-drawn stairs whose
 * runs are 0.204, 0.139, 0.083 and 0.074 of the width — the midpoint
 * circle at 14 cells, with every stair corner on the true circle. A
 * plain centre-sampled circle at 14 cells comes out thinner at the
 * shoulders (6·8·10·12 rows against their 6·10·12·12). Filling a cell
 * when about a third of it is covered reproduces their profile row for
 * row (any threshold from 0.15 to 0.35 does; 0.35 is the conservative
 * end), so the same rule draws every other shape the way they drew that
 * one. `tidy` then removes stray single cells and fills one-cell
 * notches, which is what a pixel artist does by hand — the difference
 * between a staircase and a jaggy.
 */
export function rasterise(
  poly: readonly Pt[],
  n: number,
  threshold = 0.35,
  k = 4,
  tidy = true
): boolean[][] {
  const R = n * k;
  const cov: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const m = poly.length;
  for (let sy = 0; sy < R; sy++) {
    const y = (sy + 0.5) / R;
    const xs: number[] = [];
    for (let i = 0; i < m; i++) {
      const a = poly[i]!;
      const b = poly[(i + 1) % m]!;
      if (a[1] <= y !== b[1] <= y) {
        xs.push(a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]));
      }
    }
    xs.sort((p, q) => p - q);
    const row = cov[Math.floor(sy / k)]!;
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const from = Math.max(0, Math.ceil(xs[i]! * R - 0.5));
      const to = Math.min(R - 1, Math.floor(xs[i + 1]! * R - 0.5));
      for (let sx = from; sx <= to; sx++) row[Math.floor(sx / k)]! += 1;
    }
  }
  const full = k * k;
  const grid = cov.map((row) => row.map((c) => c / full >= threshold));
  return tidy ? tidyGrid(grid) : grid;
}

/**
 * One pass of pixel-artist cleanup: a filled cell with at most one filled
 * neighbour among its eight is a stray and goes; an empty cell with three
 * filled neighbours among its four is a one-cell notch in a wall and is
 * filled. Eight-way for strays so a diagonal spike survives.
 */
export function tidyGrid(grid: readonly boolean[][]): boolean[][] {
  const n = grid.length;
  const at = (y: number, x: number) =>
    y >= 0 && y < n && x >= 0 && x < n && grid[y]![x]! ? 1 : 0;
  return grid.map((row, y) =>
    row.map((v, x) => {
      const n8 =
        at(y - 1, x - 1) +
        at(y - 1, x) +
        at(y - 1, x + 1) +
        at(y, x - 1) +
        at(y, x + 1) +
        at(y + 1, x - 1) +
        at(y + 1, x) +
        at(y + 1, x + 1);
      const n4 = at(y - 1, x) + at(y + 1, x) + at(y, x - 1) + at(y, x + 1);
      if (v && n8 <= 1) return false;
      if (!v && n4 >= 3) return true;
      return v;
    })
  );
}

/** One SVG path for a grid, horizontal runs merged so the DOM stays small. */
export function gridToPath(grid: readonly boolean[][], cell: number): string {
  let d = '';
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      let w = 0;
      while (x + w < row.length && row[x + w]) w++;
      d += `M${x * cell} ${y * cell}h${w * cell}v${cell}h${-w * cell}z`;
      x += w;
    }
  });
  return d;
}

/** The smooth outline as an SVG path at `size` px. */
export function outlineToPath(poly: readonly Pt[], size: number): string {
  return (
    poly
      .map(
        (p, i) =>
          `${i ? 'L' : 'M'}${(p[0] * size).toFixed(2)} ${(p[1] * size).toFixed(2)}`
      )
      .join('') + 'Z'
  );
}
