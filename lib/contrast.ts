/**
 * Colour measurement utilities for the quiz palette's accessibility gates.
 *
 * Two measures, because the gates need both and no contrast checker gives
 * the second: WCAG contrast scores a colour against the BACKGROUND, never
 * one foreground against another — which is how a palette once passed
 * every checker with an accent .03 OKLCH-L from its own ink (gate 3 in
 * docs/color-handoff.md exists because of that).
 */

function hexChannels(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

function linearize(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/** WCAG 2.x relative luminance of a hex colour. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexChannels(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.x contrast ratio between two hex colours (order-independent). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lighter, darker] = la >= lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * OKLab/OKLCH lightness of a hex colour. Gate 3 asks each accent to sit
 * ≥ ~0.10 OKLCH-L above its ink so the two dark foregrounds can never be
 * mistaken for one another — perceptual lightness, not contrast.
 */
export function oklchLightness(hex: string): number {
  const [r, g, b] = hexChannels(hex).map(linearize);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}
