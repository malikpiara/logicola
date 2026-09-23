/**
 * The island keys — the `data-island` values a post may write. A plain
 * module (no 'use client') so the server page can validate markers
 * against it while the components themselves stay behind the client
 * `next/dynamic` boundary in ./islands.tsx (React pass, 2026-09-08).
 */
export const ISLAND_KEYS = [
  'before-after',
  'silhouettes',
  'damage-bar',
  'colour-studio',
  'pastel-random',
  'pattern-gallery',
  'clip',
  'phone-states',
  'install',
  'template-roll',
  'material-shapes',
] as const;

export type IslandKey = (typeof ISLAND_KEYS)[number];

export function isIslandKey(key: string): key is IslandKey {
  return (ISLAND_KEYS as readonly string[]).includes(key);
}
