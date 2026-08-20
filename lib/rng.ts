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

/**
 * Recently-drawn memory, keyed rng → pool → recent picks. WeakMaps on both
 * levels: pools are module-level arrays (stable identities), and in
 * production every generator shares `Math.random` itself as the key, so
 * freshness deliberately persists across quiz mounts in one session — a
 * retry does not reset the "recently seen" window. Deterministic test rngs
 * are distinct objects, so seeds stay isolated from each other.
 */
const recentByRng = new WeakMap<Rng, WeakMap<readonly unknown[], unknown[]>>();

/**
 * `pickFrom` with perceived randomness (Malik, 2026-08-20).
 *
 * Uniform independent draws are statistically fine and experientially
 * broken: with 10 questions drawing from a 77-noun pool, some word repeats
 * within a 3-question window in 18% of quizzes — user testing caught
 * "diabetic" twice in 3 questions. What users read as random is spread, not
 * independence (the reason Spotify rewrote shuffle). So this draws
 * uniformly but redraws while the candidate is among the last `window`
 * accepted picks from the same pool.
 *
 * - `window` defaults to min(12, ⌊pool/2⌋) — small pools degrade gracefully
 *   (a 2-entry pool just alternates) and 12 covers the densest 3-question
 *   span of any template.
 * - `reject` filters candidates without destroying pool identity — the
 *   letter-avoidance helpers previously built filtered copies, which would
 *   defeat the memory. Rejected candidates are never recorded.
 * - Falls back in two stages (ignore recency, then ignore everything
 *   except emptiness) so a hostile combination can stall but never throw.
 *
 * Same seed still means the same quiz; only the sequence changed, which is
 * what the snapshots pin.
 */
export function pickFresh<T>(
  rng: Rng,
  pool: readonly T[],
  opts?: { window?: number; reject?: (item: T) => boolean }
): T {
  if (pool.length === 0) {
    throw new Error('pickFresh: pool is empty');
  }
  const reject = opts?.reject;
  if (pool.length === 1) return pool[0]!;

  let pools = recentByRng.get(rng);
  if (!pools) {
    pools = new WeakMap();
    recentByRng.set(rng, pools);
  }
  let recent = pools.get(pool) as T[] | undefined;
  if (!recent) {
    recent = [];
    pools.set(pool, recent);
  }
  const window = opts?.window ?? Math.min(12, Math.floor(pool.length / 2));

  let pick: T | undefined;
  for (let tries = 0; tries < 24; tries++) {
    const candidate = pool[Math.floor(rng() * pool.length)]!;
    if (reject?.(candidate)) continue;
    if (recent.includes(candidate)) continue;
    pick = candidate;
    break;
  }
  if (pick === undefined) {
    // Recency is a nicety; the reject predicate is a correctness rule.
    for (let tries = 0; tries < 24 && pick === undefined; tries++) {
      const candidate = pool[Math.floor(rng() * pool.length)]!;
      if (!reject?.(candidate)) pick = candidate;
    }
  }
  if (pick === undefined) pick = pickFrom(rng, pool);

  recent.push(pick);
  if (recent.length > window) recent.shift();
  return pick;
}

function recentFor<T>(rng: Rng, pool: readonly T[]): T[] {
  let pools = recentByRng.get(rng);
  if (!pools) {
    pools = new WeakMap();
    recentByRng.set(rng, pools);
  }
  let recent = pools.get(pool) as T[] | undefined;
  if (!recent) {
    recent = [];
    pools.set(pool, recent);
  }
  return recent;
}

/**
 * Register `item` in `pool`'s recently-drawn memory WITHOUT drawing it —
 * for fixed content that QUOTES a pool word ("Strong are the Tyrells"
 * quotes the adjective `strong`). Without this, a quoted word and a
 * drawn word can sit two questions apart and the student sees exactly
 * the repetition pickFresh exists to prevent; the memory doesn't care
 * whether a word arrived by draw or by quotation, and now neither does
 * the code (Malik's call, 2026-08-21).
 */
export function noteUsed<T>(rng: Rng, pool: readonly T[], item: T): void {
  const recent = recentFor(rng, pool);
  recent.push(item);
  const window = Math.min(12, Math.floor(pool.length / 2));
  if (recent.length > window) recent.shift();
}

/** The read side of noteUsed: is `item` in the pool's recent window? */
export function isRecent<T>(rng: Rng, pool: readonly T[], item: T): boolean {
  return recentFor(rng, pool).includes(item);
}
