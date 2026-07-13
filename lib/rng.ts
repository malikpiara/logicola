/**
 * Pseudo-random number generator utilities for Logicola generators.
 *
 * The generator architecture wants two modes:
 *
 *   - **Production**: live random — generators called with no seed use
 *     `Math.random` so each page load draws fresh content.
 *   - **Tests**: deterministic — generators called with a fixed seed use
 *     `mulberry32(seed)` so snapshot tests stay stable.
 *
 * `mulberry32` is a minimal 32-bit PRNG with good statistical
 * properties (passes BigCrush's smaller batteries) and fits in a few
 * lines of code. It returns floats in [0, 1) just like `Math.random`,
 * so callers can use the result interchangeably.
 *
 * Reference: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
 */

/**
 * A function returning a float in [0, 1). Compatible with `Math.random`.
 */
export type Rng = () => number;

/**
 * Build a deterministic PRNG from a 32-bit seed. Same seed → same
 * sequence of values across every run, every machine, every Node /
 * browser version. Used in tests and anywhere else reproducibility
 * matters.
 *
 * @param seed any 32-bit integer (sign doesn't matter; non-integers
 *   are coerced via `>>> 0`)
 */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0;
  return function rng(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Return a deterministic PRNG if a seed is provided, otherwise
 * `Math.random`. The convenience helper Phase-1 generators all
 * delegate to:
 *
 * ```ts
 * export function* nextQuestion(seed?: number) {
 *   const rng = rngFromSeed(seed);
 *   while (true) {
 *     const i = Math.floor(rng() * pool.length);
 *     yield pool[i];
 *   }
 * }
 * ```
 *
 * `rngFromSeed(undefined)` returns the bare `Math.random` function so
 * production generators remain truly random.
 */
export function rngFromSeed(seed?: number): Rng {
  return seed != null ? mulberry32(seed) : Math.random;
}

/**
 * Convenience: pick a random element from a non-empty array using the
 * given Rng. Throws on empty input rather than returning `undefined`,
 * which forces the caller to provide content. This is the primary
 * lexicon-sampling primitive used by every generator.
 */
export function pickFrom<T>(rng: Rng, pool: readonly T[]): T {
  if (pool.length === 0) {
    throw new Error('pickFrom: pool is empty');
  }
  const i = Math.floor(rng() * pool.length);
  return pool[i]!;
}
