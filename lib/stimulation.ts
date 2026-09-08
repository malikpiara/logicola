/**
 * The ColorMoods stimulation model — Ruxandra Duru's two-colour framework,
 * as ported into `docs/pattern-lab.html`'s Colour studio and used to derive
 * every set palette (see docs/color-system.md, "The recovered stimulation
 * setting").
 *
 * This is a port of a port: the lab holds the original hand-port of
 * colormoods.co's `generator.js`, and the curve constants below are that
 * file's, verbatim. The lab remains the reference — `lib/stimulation.test.ts`
 * pins this against the two scores `color-system.md` records for the sets
 * Malik made by hand before the model existed, which is what makes the
 * port checkable rather than merely plausible.
 *
 * It exists in `lib/` rather than inside the blog island because a figure
 * that computes its own numbers has to be verifiable, and a component is not
 * a place you can point a test at.
 */

function hexTriple(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/** HSL, with hue NaN for greys — the model relies on that signal. */
export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexTriple(hex).map((v) => v / 255) as [
    number,
    number,
    number,
  ];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [NaN, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return [h, s, l];
}

/** CIELAB L*, 0–100. */
export function labL(hex: string): number {
  const [r, g, b] = hexTriple(hex).map((v) => srgbToLinear(v / 255)) as [
    number,
    number,
    number,
  ];
  const Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  return Y > 0.008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y;
}

/**
 * Per-colour perceptual intensity: HSL saturation corrected by per-hue
 * max-intensity curves and by how far lightness sits from mid-value. This is
 * why a fully saturated navy is calm and a mid-value orange is loud, and it
 * is the reason "intensity" is not "saturation". Constants verbatim.
 */
export function duruIntensity(hex: string): number {
  const maxIntensities = [
    1.1, 0.9, 1.0, 0.99, 1.1, 0.99, 1.0, 0.9, 1.1, 1.0, 1.05, 0.98, 1.1,
  ];
  const lightnessCosCurve = [
    0.4, -0.2, 0.8, 0.5, 0.9, 0.8, 1, 0, 0.3, 0.5, 0.8, 0.5, 0.4,
  ];
  const darknessCosCurve = [0, -0.3, -0.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const saturationCosCurve = [0, 0, 0, 0, 0.5, 0, 0, 0, 0.2, 0.4, 0.5, 0, 0];
  const [H, S, L] = hexToHsl(hex);
  const hue = (Number.isNaN(H) ? 0 : H) / 180;
  const LD = L > 0.5 ? 2 * L - 1 : 1 - 2 * L;
  const cosHue = Math.cos(6 * Math.PI * hue);
  const iF = Math.floor(hue * 6);
  const iC = Math.ceil(hue * 6);
  const cosRange = Math.abs(maxIntensities[iF]! - maxIntensities[iC]!) / 2;
  const cosMid = Math.abs(maxIntensities[iF]! + maxIntensities[iC]!) / 2;
  const satDiff = Math.sin((Math.PI / 2) * S) - S;
  const sStart = saturationCosCurve[iF]! * satDiff + S;
  const sEnd = saturationCosCurve[iC]! * satDiff + S;
  const satCos =
    Math.abs(sStart + sEnd) / 2 + cosHue * (Math.abs(sStart - sEnd) / 2);
  const satMax = satCos * (cosMid + cosHue * cosRange);
  const ldCurve = L > 0.5 ? lightnessCosCurve : darknessCosCurve;
  const altFalse = 0.2 + (1 - LD) * (satMax - 0.2);
  const altDiff =
    0.2 + Math.cos((Math.PI / 2) * LD) * (satMax - 0.2) - altFalse;
  const aStart = ldCurve[iF]! * altDiff + altFalse;
  const aEnd = ldCurve[iC]! * altDiff + altFalse;
  return Math.abs(aStart + aEnd) / 2 + cosHue * (Math.abs(aStart - aEnd) / 2);
}

export interface Stimulation {
  /** Mean perceptual intensity of the pair — the ×4 term, and the dominant one. */
  sigma: number;
  /** CIELAB lightness gap, 0–1 — the ×2 term, and the vibration insurance. */
  dL: number;
  /** Circular hue distance, 0–2 where 1 is complementary — the ×1 term. */
  theta: number;
  /** The raw (4σ + 2ΔL + θ) / 7. */
  st: number;
  /** Vibration risk: intense + far hues + similar lightness. */
  vibr: number;
  /** What the studio displays: (1 − vibr)·st + vibr. */
  score: number;
}

/**
 * stimulation = (4·σ + 2·ΔL + 1·θ) / 7. The weights are the finding —
 * intensity dominates and hue distance matters least, which inverts what
 * classical colour theory spends its time on.
 */
export function stimulationOf(hexA: string, hexB: string): Stimulation {
  const i1 = duruIntensity(hexA);
  const i2 = duruIntensity(hexB);
  let h1 = hexToHsl(hexA)[0] / 180;
  let h2 = hexToHsl(hexB)[0] / 180;
  if (Number.isNaN(h1)) h1 = (Number.isNaN(h2) ? 0 : h2) + 0.1;
  if (Number.isNaN(h2)) h2 = h1 + 0.1;
  const sigma = (i1 + i2) / 2;
  const dL = Math.abs(labL(hexA) - labL(hexB)) / 100;
  const theta = Math.min(
    h1 - h2 < 0 ? h1 - h2 + 2 : h1 - h2,
    h2 - h1 < 0 ? h2 - h1 + 2 : h2 - h1
  );
  const st = (4 * sigma + 2 * dL + theta) / 7;

  // Three risk curves: rising in intensity, rising in hue distance, falling
  // fast in lightness gap — risk is effectively dead by ΔL ≈ 0.5.
  const VI = [0, 0, 0, 0, 0.1, 0.2, 0.3, 0.43, 0.55, 0.66, 0.83, 0.96, 1];
  const VH = [0, 0, 0.1, 0.2, 0.4, 0.55, 0.7, 0.8, 0.9, 0.975, 1];
  const VL = [1, 0.85, 0.65, 0.5, 0.2, 0.05, 0, 0, 0, 0, 0];
  const lerpAt = (arr: number[], x: number) => {
    const c = Math.max(0, Math.min(x, (arr.length - 1) / 10));
    const f = Math.floor(c * 10);
    return (
      arr[f]! +
      (c * 10 - f) *
        ((arr[Math.min(f + 1, arr.length - 1)] ?? arr[f]!) - arr[f]!)
    );
  };
  let vibr =
    1 -
    Math.sqrt(
      (1 - lerpAt(VI, sigma)) ** 2 +
        (1 - lerpAt(VH, theta)) ** 2 +
        (1 - lerpAt(VL, dL)) ** 2
    );
  if (vibr < 0) vibr = 0;

  return { sigma, dL, theta, st, vibr, score: (1 - vibr) * st + vibr };
}

/**
 * OKLCH hue, 0–360. The temperature zones below key off THIS and not HSL
 * hue — they are perceptual regions, and the two hue scales disagree enough
 * that swapping them silently reclassifies colours (it put a navy and an
 * orchid in the same zone on the first attempt).
 */
export function oklchHue(hex: string): number {
  const [R, G, B] = hexTriple(hex).map((v) => srgbToLinear(v / 255)) as [
    number,
    number,
    number,
  ];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
}

/** Duru's three temperature regions; a duotone should share one. */
export function temperatureOf(hex: string): 'warm' | 'lukewarm' | 'cool' {
  const h = oklchHue(hex);
  if (h >= 25 && h < 110) return 'warm';
  if ((h >= 110 && h < 165) || h >= 325 || h < 25) return 'lukewarm';
  return 'cool';
}

/** HSL → hex, for sweeping candidate colours. */
export function hslToHex(h: number, s: number, l: number): string {
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c =
      l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return '#' + f(0) + f(8) + f(4);
}

export interface Suggestion {
  hex: string;
  score: number;
  vibr: number;
  /** WCAG contrast against the fixed colour. */
  contrast: number;
  /** CIELAB lightness gap against the fixed colour, 0–1. */
  dL: number;
}

/** WCAG relative-luminance contrast ratio. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, b2] = hexTriple(hex).map((v) => srgbToLinear(v / 255)) as [
      number,
      number,
      number,
    ];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b2;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x! + 0.05) / (y! + 0.05);
}

/** OKLCH chroma — how far from grey, perceptually. */
export function oklchChroma(hex: string): number {
  const [R, G, B] = hexTriple(hex).map((v) => srgbToLinear(v / 255)) as [
    number,
    number,
    number,
  ];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return Math.hypot(a, b);
}

/**
 * The floors a candidate must clear before its score is even consulted.
 * Measured off the seven shipped sets rather than chosen: their ink-on-surface
 * contrast runs 7.0–12.7 and their ΔL runs 0.57–0.78, so a generator that can
 * return 1.21:1 at ΔL 0.07 — as the first version did — is not proposing a
 * palette, it is proposing an unreadable screen that happens to score well.
 *
 * Stimulation is a *taste* metric. It says nothing about legibility, and on
 * this product legibility is a release blocker, so it gets checked first.
 */
export const FLOORS = { contrast: 4.5, dL: 0.5 } as const;

/**
 * Sweep bands, also measured off the shipped sets.
 *
 * The surface band is the interesting one. LogiCola's surfaces are PASTELS,
 * and a pastel is not a desaturated colour — it is a fully saturated hue
 * pushed light. Measured: HSL saturation 0.68–1.00 at HSL lightness
 * 0.77–0.89, which lands at OKLCH chroma 0.05–0.12. Sweeping low HSL
 * saturation (the first version started at 0.12) produces muddy greys that
 * are the opposite of the house style, so the band starts high and the
 * chroma cap keeps the result a tint rather than a poster colour.
 *
 * Inks are dark and chromatic, never near-black: HSL L 0.10–0.24 at
 * saturation 0.60–1.00, which is OKLCH L 0.28–0.36.
 */
const BANDS = {
  ink: { L: [0.1, 0.24], S: [0.6, 1.0], maxChroma: 0.2 },
  surface: { L: [0.76, 0.9], S: [0.65, 1.0], maxChroma: 0.14 },
} as const;

/**
 * ColorMoods' generation strategy with this product's structure, ported from
 * the lab's `suggestPartners` and then tightened: fix one colour, sweep HSL
 * within the measured bands, reject anything that fails the legibility floors
 * or buzzes, then rank by nearness to the target score and dedupe
 * perceptually so the list isn't eight shades of one colour.
 *
 * `dist` is injected so this module stays free of the pattern engine; callers
 * pass `perceptualDist` from lib/patterns.
 */
export function suggestPartners(
  fixedHex: string,
  target: number,
  mode: 'ink' | 'surface',
  dist: (a: string, b: string) => number,
  limit = 8
): Suggestion[] {
  const band = BANDS[mode];
  const all: (Suggestion & { d: number })[] = [];
  for (let h = 0; h < 360; h += 6) {
    for (let si = 0; si < 6; si++) {
      for (let li = 0; li < 7; li++) {
        const hex = hslToHex(
          h,
          band.S[0] + ((band.S[1] - band.S[0]) * si) / 5,
          band.L[0] + ((band.L[1] - band.L[0]) * li) / 6
        );
        if (oklchChroma(hex) > band.maxChroma) continue;
        const m = stimulationOf(fixedHex, hex);
        if (m.vibr > 0.25) continue;
        if (m.dL < FLOORS.dL) continue;
        const c = contrastRatio(fixedHex, hex);
        if (c < FLOORS.contrast) continue;
        all.push({
          hex,
          d: Math.abs(m.score - target),
          score: m.score,
          vibr: m.vibr,
          contrast: c,
          dL: m.dL,
        });
      }
    }
  }
  all.sort((a, b) => a.d - b.d);
  const picked: Suggestion[] = [];
  for (const c of all) {
    if (picked.length >= limit) break;
    if (picked.every((p) => dist(p.hex, c.hex) > 0.09)) {
      picked.push({
        hex: c.hex,
        score: c.score,
        vibr: c.vibr,
        contrast: c.contrast,
        dL: c.dL,
      });
    }
  }
  return picked;
}
