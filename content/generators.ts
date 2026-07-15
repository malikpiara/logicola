/**
 * Generator dispatcher — maps a setKey to the function that produces
 * its `Set` procedurally.
 *
 * Phase-1 generator architecture (per
 * notes/PHASE-1-WORKPLAN.md / PORT-PLAN.md):
 *
 *   - Each set's generator lives in `content/sets/setX.generator.ts`
 *     and exports `generateSetX(seed?: number, perSubset = 10): Set`.
 *   - `<QuizClient>` (a client component) receives a setKey as a prop
 *     and resolves the generator here, then calls it on mount with
 *     no seed to get live-random questions per page refresh.
 *   - Tests import generators directly and pass a fixed seed for
 *     deterministic snapshots — they don't go through this dispatcher.
 *
 * Set Q is **intentionally not in this dispatcher**: it's a flat list
 * of 60 hardcoded definitions with no template structure. Set Q
 * routes use the existing static path through `<Quiz>` directly.
 *
 * Generator entries are added as each set ships:
 *   T1.2 — generateSetN
 *   T1.3 — generateSetL
 *   T1.4 — generateSetJ
 *   T1.5 — generateSetA
 *   T1.6 — generateSetC
 *
 * To register a generator: import its module-level `generate*`
 * function and add it to the `generators` map below.
 */

import type { Set } from './types';
import { generateSetA } from './sets/setA.generator';
import { generateSetC } from './sets/setC.generator';
import { generateSetJ } from './sets/setJ.generator';
import { generateSetL } from './sets/setL.generator';
import { generateSetN } from './sets/setN.generator';
import { generateSetR } from './sets/setR.generator';

/**
 * Generator function signature. Every Phase-1 generator conforms.
 *
 * - `seed`: pass `undefined` for live random (production), a fixed
 *   number for deterministic output (tests).
 * - `perSubset`: how many questions to draw per subset. Defaults to
 *   10 to match the existing fixed-length quiz UX. The infinite-drill
 *   follow-up phase will consume the underlying iterators directly
 *   instead of going through this convenience wrapper.
 */
export type Generator = (seed?: number, perSubset?: number) => Set;

/**
 * The known set keys that can be generated. Add to this union when a
 * new generator is registered. Set Q is omitted because it's static.
 */
export type GeneratedSetKey =
  'setA' | 'setC' | 'setJ' | 'setL' | 'setN' | 'setR';

/**
 * Generator registry. Per-set entries are added as each generator
 * lands (T1.2..T1.6).
 */
const generators: Partial<Record<GeneratedSetKey, Generator>> = {
  setA: generateSetA, // T1.5 (May 9, 2026)
  setC: generateSetC, // T1.6 (May 10, 2026)
  setJ: generateSetJ, // T1.4 (May 10, 2026)
  setL: generateSetL, // T1.3 (May 10, 2026)
  setN: generateSetN, // T1.2 (May 10, 2026) — fixes P0 Rationality prompt-truncation bug
  setR: generateSetR, // Phase 2 (Jul 15, 2026) — Informal Fallacies, full 18-option taxonomy
};

/**
 * Look up a generator by setKey. Returns `undefined` if no generator
 * is registered for that key — callers must handle that case (the
 * route page falls back to the static `<Quiz>` path with an explicit
 * not-found if the catalog claimed the set was generated but no
 * generator exists).
 */
export function getGenerator(setKey: GeneratedSetKey): Generator | undefined {
  return generators[setKey];
}

/**
 * List which generators are currently registered. Useful for tests
 * that want to verify the registry has the expected entries.
 */
export function registeredSetKeys(): GeneratedSetKey[] {
  return Object.keys(generators) as GeneratedSetKey[];
}
