'use client';

/**
 * Client-side quiz mount for generated sets.
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
 * Set Q does NOT use this component — it stays on the server-rendered
 * static path through `<Quiz>` directly.
 *
 * Future infinite-drill mode (deferred follow-up) will consume the
 * per-subset iterators directly instead of taking a fixed `perSubset`
 * slice. The generator interface is forward-compatible.
 */

import { useState } from 'react';
import Quiz from '.';
import { getGenerator, type GeneratedSetKey } from '@/content/generators';

export interface QuizClientProps {
  setKey: GeneratedSetKey;
  subsetIndex: number;
  /**
   * Number of questions to draw per subset. Defaults to 10 to match
   * the existing fixed-length quiz UX. Override for tests or for the
   * future infinite-drill mode.
   */
  perSubset?: number;
  /**
   * Optional fixed seed. Production should leave this `undefined` so
   * each mount produces fresh questions via `Math.random`. Tests pass
   * a fixed seed for deterministic snapshots.
   */
  seed?: number;
}

export default function QuizClient({
  setKey,
  subsetIndex,
  perSubset = 10,
  seed,
}: QuizClientProps) {
  // useState's lazy initializer runs exactly once per mount. F5 →
  // remount → fresh draw. Soft-nav within session → same draw.
  const [subSet] = useState(() => {
    const generator = getGenerator(setKey);
    if (!generator) {
      throw new Error(
        `QuizClient: no generator registered for setKey "${setKey}". ` +
          'Register it in content/generators.ts.'
      );
    }
    const set = generator(seed, perSubset);
    const drawn = set.subSets[subsetIndex];
    if (!drawn) {
      throw new Error(
        `QuizClient: generated set "${setKey}" has no subset at index ${subsetIndex}.`
      );
    }
    return drawn;
  });

  return <Quiz subSet={subSet} />;
}
