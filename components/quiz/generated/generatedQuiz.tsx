'use client';

/**
 * Client-side quiz mount for generated sets — the shared half of the
 * per-set wrappers in this directory.
 *
 * Pre.4 architecture (notes/PHASE-1-WORKPLAN.md): generated sets
 * (everything except Set Q) run their generator client-side at mount
 * time so questions are freshly drawn each session. The page chrome
 * is still server-rendered and cached; only the question content is
 * client-generated.
 *
 * Re-roll cadence is **per page refresh** by design (Q5 in the
 * workplan):
 *   - `useState` with a function initializer runs once per component
 *     lifecycle, so soft-navigations within the session keep the
 *     same questions.
 *   - F5 / hard reload remounts the component → generator runs again
 *     → fresh questions.
 *
 * Set Q does NOT come through here — it stays on the server-rendered
 * static path through `<Quiz>` directly.
 *
 * WHY the per-set wrapper layer exists (bundle contract): the route
 * page must never reach a module that imports EVERY generator, or all
 * of them ship to every quiz page. Each wrapper in this directory is
 * its own `'use client'` entry importing exactly one generator, and
 * the server page picks the wrapper — so each page's HTML references
 * only its own set's chunk. Adding a generator here must never mean
 * importing it from shared client code.
 *
 * Future infinite-drill mode (deferred follow-up) will consume the
 * per-subset iterators directly instead of taking a fixed `perSubset`
 * slice. The generator interface is forward-compatible.
 */

import { useState } from 'react';
import Quiz from '..';
import type { Generator } from '@/content/generators';

/** The props a per-set wrapper accepts (and the page supplies). */
export interface GeneratedQuizProps {
  subsetIndex: number;
  /**
   * Number of questions to draw per subset. Defaults to 60 — see the
   * prototype note below. Override for tests or for the future
   * infinite-drill mode.
   */
  perSubset?: number;
  /**
   * Optional fixed seed. Production should leave this `undefined` so
   * each mount produces fresh questions via `Math.random`. Tests pass
   * a fixed seed for deterministic snapshots.
   */
  seed?: number;
}

interface GeneratedQuizInternalProps extends GeneratedQuizProps {
  /** The one generator this wrapper's chunk carries. */
  generate: Generator;
  /** For error messages only. */
  setKey: string;
}

export default function GeneratedQuiz({
  generate,
  setKey,
  subsetIndex,
  // PROTOTYPE SHORTCUT. A scored run has no fixed length — it ends at 100
  // points, which takes 13 problems at best and rather more with misses. The
  // honest fix is to consume the generator as the endless stream it already
  // is (see the "infinite-drill mode" note above). Until then we draw a pool
  // big enough that a scored run won't hit the bottom, and count mode simply
  // uses the first 10 of it. Cheap: these are template substitutions, not IO.
  perSubset = 60,
  seed,
}: GeneratedQuizInternalProps) {
  // useState's lazy initializer runs exactly once per mount. F5 →
  // remount → fresh draw. Soft-nav within session → same draw.
  const [subSet] = useState(() => {
    const set = generate(seed, perSubset);
    const drawn = set.subSets[subsetIndex];
    if (!drawn) {
      throw new Error(
        `GeneratedQuiz: generated set "${setKey}" has no subset at index ${subsetIndex}.`
      );
    }
    return drawn;
  });

  return <Quiz subSet={subSet} />;
}
