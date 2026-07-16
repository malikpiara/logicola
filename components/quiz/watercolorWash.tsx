'use client';

import { useEffect, useRef } from 'react';
import { mulberry32 } from '@/lib/rng';

/**
 * Soft procedural watercolor wash, rendered behind the start/end screens.
 * Aims for "abstract macro photograph of a flower, mid-century color field,
 * hazy, out of focus":
 *
 *   - the main forms are BLOOMS — translucent, tapered petals radiating from
 *     a shared centre, macro-scaled so a single flower fills a corner;
 *   - everything is heavily Gaussian-blurred, so silhouettes read as
 *     out-of-focus colour rather than hard shapes;
 *   - petals are plain alpha-layered (no multiply) so overlaps stay luminous
 *     instead of browning into mud;
 *   - colours are derived in HSL from the set's own `color`, shifting
 *     lightness toward the contrasting end and nudging hue a little, so the
 *     wash reads on any surface and layers colourfully;
 *   - an SVG fractal-noise displacement adds a final organic buckle;
 *   - film grain (static, blended over everything) keeps the strong colour
 *     reading photographic rather than synthetic.
 *
 * The wash is painted across four stacked canvases so it can move without
 * repainting the expensive blurred blobs: the colour fields and grain hold
 * still while the blooms and accents drift on very slow GPU-composited
 * transforms (`.wash-drift-a/b` in globals.css, disabled under
 * prefers-reduced-motion). Drifting layers are overscanned by 6% so their
 * edges never enter the frame.
 *
 * Blooms anchor toward the corners so the centre — where the heading and
 * button sit — stays calm. The composition is seeded (same seed, same
 * layout), so tuning `WashParams` changes the rendering without reshuffling
 * the arrangement. Decorative only, aria-hidden.
 */

const FILTER_ID = 'watercolor-bleed';
const BLOB_SEGMENTS = 24;
const TAU = Math.PI * 2;

/** The tunable character of the wash. Play with these via `WatercolorTuner`. */
export interface WashParams {
  /** Multiplies every pigment's opacity (overall wash strength). */
  intensity: number;
  /** How far pool lightness strays from the base colour (0–0.4). */
  contrast: number;
  /** Max hue rotation (deg) across the pigment palette. */
  hueDrift: number;
  /** How many petal blooms to compose (0–4). */
  bloomCount: number;
  /** Petals per bloom. */
  petalCount: number;
  /** Mean petal length as a fraction of the short viewport side. */
  bloomScale: number;
  /** Petal width relative to its length. */
  petalWidth: number;
  /** Mean blur (px) on bloom petals — the "in focus-ish" plane. */
  bloomBlur: number;
  /** Mean blur (px) on the background colour fields — the haze plane. */
  fieldBlur: number;
  /** SVG displacement strength — the paper-bleed edge wobble. */
  displacement: number;
  /**
   * Film-grain opacity (0–0.15). Grain is what makes strong colour read as
   * photographic rather than an AI-ish mesh gradient.
   */
  grain: number;
  /** RNG seed — same seed, same composition. */
  seed: number;
}

// Tuned after justinjay.wang/methods-for-random-gradients: presence comes
// from VALUE range (deep pools and bright glows), not hue spread — hue drift
// stays modest/analogous because wide hue rotation reads as an AI-ish pastel
// mesh (±24° on green still looks green, on magenta it spans pink→violet).
// Film grain is what lets the stronger colour read as photographic.
export const DEFAULT_WASH_PARAMS: WashParams = {
  intensity: 1.1,
  contrast: 0.2,
  hueDrift: 10,
  bloomCount: 3,
  petalCount: 6,
  bloomScale: 0.36,
  petalWidth: 0.5,
  bloomBlur: 20,
  fieldBlur: 42,
  displacement: 12,
  grain: 0.05,
  seed: 7,
};

// Bloom centres sit toward the corners, leaving the middle comparatively
// clear; background colour fields share the same edge bias.
const BLOOM_ANCHORS: Array<[number, number]> = [
  [0.14, 0.18],
  [0.86, 0.2],
  [0.16, 0.84],
  [0.84, 0.8],
];

const FIELD_ANCHORS: Array<[number, number]> = [
  [0.16, 0.2],
  [0.84, 0.18],
  [0.18, 0.82],
  [0.82, 0.8],
  [0.5, 0.08],
  [0.08, 0.52],
];

type Rgb = { r: number; g: number; b: number };
type Hsl = { h: number; s: number; l: number };
type Pt = [number, number];
type Pigment = { rgb: Rgb; alpha: number };
type Rng = () => number;

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rf = r / 255;
  const gf = g / 255;
  const bf = b / 255;
  const max = Math.max(rf, gf, bf);
  const min = Math.min(rf, gf, bf);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rf) h = ((((gf - bf) / d) % 6) + 6) % 6;
  else if (max === gf) h = (bf - rf) / d + 2;
  else h = (rf - gf) / d + 4;
  return { h: h * 60, s, l };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [rf, gf, bf] =
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x];
  return {
    r: Math.round((rf + m) * 255),
    g: Math.round((gf + m) * 255),
    b: Math.round((bf + m) * 255),
  };
}

function rgba({ r, g, b }: Rgb, alpha: number): string {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const rotateHue = (h: number, deg: number) => (h + deg + 360) % 360;

/**
 * Pigments derived in HSL: lightness moves toward the contrasting end (darker
 * pools on a light surface, lighter on a dark one) and the hue is nudged a
 * little each way, so layered washes stay colourful rather than muddy.
 *
 * The per-pigment factors are fractions of `contrast` / `hueDrift`, so the
 * tuner scales the whole palette coherently.
 */
function buildPigments(color: string, params: WashParams): Pigment[] {
  const hsl = rgbToHsl(hexToRgb(color));
  const dir = hsl.l > 0.5 ? -1 : 1;
  const sat = clamp01(hsl.s * 1.05 + 0.04);
  const shade = (dl: number, dh: number): Rgb =>
    hslToRgb({
      h: rotateHue(hsl.h, dh * params.hueDrift),
      s: sat,
      l: clamp01(hsl.l + dir * dl * params.contrast),
    });
  const alpha = (a: number) => clamp01(a * params.intensity);
  return [
    { rgb: shade(0.87, -0.58), alpha: alpha(0.22) },
    { rgb: shade(1.6, 0.5), alpha: alpha(0.17) },
    { rgb: shade(0.47, -0.21), alpha: alpha(0.24) },
    { rgb: shade(1.13, 1), alpha: alpha(0.15) },
    // Echo pigment: moves the OPPOSITE way on the value scale (a glow on
    // light surfaces, a shadow on dark), giving the wash the deep-and-bright
    // range of a photographed colour field instead of one-sided tinting.
    { rgb: shade(-1.1, 0.35), alpha: alpha(0.16) },
  ];
}

const midpoint = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

function shuffled<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/**
 * Trace (but don't fill) an irregular closed blob. A low-frequency wave gives
 * overall asymmetry and a mid-frequency wave adds a few soft petal lobes; the
 * two are correlated (smooth), then the polygon is smoothed into a curve.
 */
function traceBlob(
  ctx: CanvasRenderingContext2D,
  rng: Rng,
  cx: number,
  cy: number,
  radius: number
) {
  const harmonics = [
    {
      freq: 2 + Math.floor(rng() * 2),
      amp: 0.1 + rng() * 0.06,
      phase: rng() * TAU,
    },
    {
      freq: 5 + Math.floor(rng() * 2),
      amp: 0.08 + rng() * 0.05,
      phase: rng() * TAU,
    },
  ];
  const radiusAt = (t: number) => {
    let scale = 1;
    for (const h of harmonics) scale += h.amp * Math.sin(h.freq * t + h.phase);
    return radius * scale;
  };

  const pts: Pt[] = [];
  for (let i = 0; i < BLOB_SEGMENTS; i++) {
    const t = (i / BLOB_SEGMENTS) * TAU;
    const r = radiusAt(t);
    pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
  }

  ctx.beginPath();
  const start = midpoint(pts[BLOB_SEGMENTS - 1]!, pts[0]!);
  ctx.moveTo(start[0], start[1]);
  for (let i = 0; i < BLOB_SEGMENTS; i++) {
    const curr = pts[i]!;
    const end = midpoint(curr, pts[(i + 1) % BLOB_SEGMENTS]!);
    ctx.quadraticCurveTo(curr[0], curr[1], end[0], end[1]);
  }
  ctx.closePath();
}

type Layer = { ctx: CanvasRenderingContext2D; w: number; h: number };

function sizeLayer(canvas: HTMLCanvasElement): Layer | null {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return null;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

export function WatercolorWash({
  color,
  className,
  params = DEFAULT_WASH_PARAMS,
}: {
  color: string;
  className?: string;
  params?: WashParams;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldsRef = useRef<HTMLCanvasElement>(null);
  const bloomsRef = useRef<HTMLCanvasElement>(null);
  const accentsRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const fieldsCanvas = fieldsRef.current;
    const bloomsCanvas = bloomsRef.current;
    const accentsCanvas = accentsRef.current;
    const grainCanvas = grainRef.current;
    if (
      !container ||
      !fieldsCanvas ||
      !bloomsCanvas ||
      !accentsCanvas ||
      !grainCanvas
    ) {
      return;
    }

    const pigments = buildPigments(color, params);

    function paint() {
      const fields = sizeLayer(fieldsCanvas!);
      const blooms = sizeLayer(bloomsCanvas!);
      const accents = sizeLayer(accentsCanvas!);
      const grain = sizeLayer(grainCanvas!);
      if (!fields || !blooms || !accents || !grain) return;

      // Fresh seeded stream per paint: the same seed always produces the
      // same composition, so parameter tweaks don't reshuffle the layout.
      const rng = mulberry32(params.seed >>> 0);
      const pick = () => pigments[Math.floor(rng() * pigments.length)]!;
      const jitter = (span: number) => (rng() - 0.5) * span;
      const fill = (ctx: CanvasRenderingContext2D, pigment: Pigment) => {
        ctx.fillStyle = rgba(pigment.rgb, pigment.alpha);
        ctx.fill();
      };

      // Layer 1 (static): base colour + hazy colour fields — the
      // mid-century color-field backdrop the blooms sit on.
      fields.ctx.fillStyle = color;
      fields.ctx.fillRect(0, 0, fields.w, fields.h);
      const fieldsMin = Math.min(fields.w, fields.h);
      FIELD_ANCHORS.forEach(([ax, ay]) => {
        const pigment = pick();
        fields.ctx.save();
        fields.ctx.filter = `blur(${params.fieldBlur * (0.75 + rng() * 0.5)}px)`;
        traceBlob(
          fields.ctx,
          rng,
          fields.w * ax + jitter(fields.w * 0.1),
          fields.h * ay + jitter(fields.h * 0.1),
          fieldsMin * (0.24 + rng() * 0.18)
        );
        fill(fields.ctx, { rgb: pigment.rgb, alpha: pigment.alpha * 0.7 });
        fields.ctx.restore();
      });

      // Layer 2 (drifts): macro blooms — overlapping translucent petals
      // around a shared centre.
      blooms.ctx.clearRect(0, 0, blooms.w, blooms.h);
      const bloomsMin = Math.min(blooms.w, blooms.h);
      const drawPetal = (
        cx: number,
        cy: number,
        angle: number,
        length: number,
        pigment: Pigment
      ) => {
        blooms.ctx.save();
        blooms.ctx.translate(cx, cy);
        blooms.ctx.rotate(angle);
        blooms.ctx.scale(1, params.petalWidth * (0.8 + rng() * 0.4));
        blooms.ctx.filter = `blur(${params.bloomBlur * (0.72 + rng() * 0.6)}px)`;
        traceBlob(blooms.ctx, rng, length * 0.55, 0, length * 0.45);
        fill(blooms.ctx, pigment);
        blooms.ctx.restore();
      };
      const bloomSpots = shuffled(BLOOM_ANCHORS, rng).slice(
        0,
        Math.round(params.bloomCount)
      );
      bloomSpots.forEach(([ax, ay]) => {
        const cx = blooms.w * ax + jitter(blooms.w * 0.06);
        const cy = blooms.h * ay + jitter(blooms.h * 0.06);
        const petalCount = Math.round(params.petalCount);
        const baseAngle = rng() * TAU;
        const bloomScale = bloomsMin * params.bloomScale * (0.8 + rng() * 0.4);
        for (let i = 0; i < petalCount; i++) {
          drawPetal(
            cx,
            cy,
            baseAngle + (i / petalCount) * TAU + jitter(0.5),
            bloomScale * (0.8 + rng() * 0.5),
            pick()
          );
        }
      });

      // Layer 3 (drifts the other way): tiny out-of-focus accents, like
      // bokeh highlights.
      accents.ctx.clearRect(0, 0, accents.w, accents.h);
      const accentsMin = Math.min(accents.w, accents.h);
      for (let i = 0; i < 3; i++) {
        const pigment = pick();
        accents.ctx.save();
        accents.ctx.filter = `blur(${10 + rng() * 8}px)`;
        traceBlob(
          accents.ctx,
          rng,
          accents.w * (0.15 + rng() * 0.7),
          accents.h * (0.15 + rng() * 0.7),
          accentsMin * (0.03 + rng() * 0.05)
        );
        fill(accents.ctx, { rgb: pigment.rgb, alpha: pigment.alpha * 0.8 });
        accents.ctx.restore();
      }

      // Layer 4 (static, on top): film grain. Painted opaque here and
      // blended via CSS (mix-blend-mode: overlay + element opacity) so it
      // holds still over the drifting layers, like the grain of a film
      // still — fine luminance noise is what makes the colour read as
      // photographic rather than a synthetic gradient.
      grain.ctx.clearRect(0, 0, grain.w, grain.h);
      if (params.grain > 0) {
        const tile = document.createElement('canvas');
        tile.width = 128;
        tile.height = 128;
        const tileCtx = tile.getContext('2d');
        if (tileCtx) {
          const image = tileCtx.createImageData(128, 128);
          for (let i = 0; i < image.data.length; i += 4) {
            const v = Math.floor(rng() * 256);
            image.data[i] = v;
            image.data[i + 1] = v;
            image.data[i + 2] = v;
            image.data[i + 3] = 255;
          }
          tileCtx.putImageData(image, 0, 0);
          grain.ctx.fillStyle = grain.ctx.createPattern(tile, 'repeat')!;
          grain.ctx.fillRect(0, 0, grain.w, grain.h);
        }
      }
    }

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(container);
    return () => observer.disconnect();
  }, [color, params]);

  return (
    <div ref={containerRef} className={className} aria-hidden='true'>
      <svg width='0' height='0' className='absolute'>
        <filter
          id={FILTER_ID}
          x='-20%'
          y='-20%'
          width='140%'
          height='140%'
          colorInterpolationFilters='sRGB'
        >
          <feTurbulence
            type='fractalNoise'
            baseFrequency='0.02'
            numOctaves={4}
            seed={7}
            result='noise'
          />
          <feDisplacementMap
            in='SourceGraphic'
            in2='noise'
            scale={params.displacement}
            xChannelSelector='R'
            yChannelSelector='G'
          />
        </filter>
      </svg>
      {/* <canvas> is a replaced element: inset alone doesn't stretch it the
          way it does a div, so every layer needs explicit width/height. */}
      <canvas
        ref={fieldsRef}
        className='absolute inset-0 block h-full w-full'
        style={{ filter: `url(#${FILTER_ID})` }}
      />
      <canvas
        ref={bloomsRef}
        className='wash-drift-a absolute -inset-[6%] block h-[112%] w-[112%]'
        style={{ filter: `url(#${FILTER_ID})` }}
      />
      <canvas
        ref={accentsRef}
        className='wash-drift-b absolute -inset-[6%] block h-[112%] w-[112%]'
        style={{ filter: `url(#${FILTER_ID})` }}
      />
      <canvas
        ref={grainRef}
        className='absolute inset-0 block h-full w-full mix-blend-overlay'
        style={{ opacity: params.grain }}
      />
    </div>
  );
}
