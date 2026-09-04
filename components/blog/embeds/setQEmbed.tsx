'use client';

import { useState } from 'react';
import Quiz from '@/components/quiz';
import { setQ } from '@/content/sets/setQ';
import type { SubSet } from '@/content/types';

/**
 * Set Q inside a blog post — the REAL quiz (Malik, 2026-08-24: "the
 * quiz embed should essentially be the Quiz with the same design with
 * the starting screen and everything"). Not a re-implementation: this
 * renders `components/quiz` itself in its `embedded` mode, so the
 * start screen, the scored run, the verdict choreography, the hints
 * and the end screen are all the shipped ones, byte for byte. What
 * `embedded` changes is scope only — no OS chrome takeover, no
 * favicon swap, no body scroll lock, no viewport-fixed sheet — see
 * QuizProps.
 *
 * The bank is trimmed to `count` questions so a post-sized taste ends
 * somewhere; everything else is the product. `pick` (2026-09-02) pins
 * named questions instead of drawing — the release post puts the
 * exact question a bug report cited in front of the reader, with the
 * multi-answer states live, where a screenshot pair used to stand in.
 */
export function SetQEmbed({
  count,
  pick,
}: {
  count: number;
  /** Question ids to show, in order (e.g. ['3.29']); overrides the draw. */
  pick?: string[];
}) {
  // One draw per mount, in a lazy initializer (the shape
  // generatedQuiz.tsx uses — the purity lint permits impurity there).
  // Safe: the island is ssr:false, so no server draw exists to
  // mismatch during hydration.
  const [subSet] = useState<SubSet>(() => {
    const bank = setQ.subSets[0]!;
    const pinned = pick
      ?.map((id) => bank.questions.find((q) => q.id === id))
      .filter((q) => q !== undefined);
    const questions = pinned?.length
      ? pinned
      : [...bank.questions]
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.max(1, Math.min(count, 20)));
    return { ...bank, questions };
  });

  return (
    <div className='not-prose lx-quiz-embed'>
      <Quiz subSet={subSet} embedded />
    </div>
  );
}
