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
 * somewhere; everything else is the product.
 */
export function SetQEmbed({ count }: { count: number }) {
  // One draw per mount, in a lazy initializer (the shape
  // generatedQuiz.tsx uses — the purity lint permits impurity there).
  // Safe: the island is ssr:false, so no server draw exists to
  // mismatch during hydration.
  const [subSet] = useState<SubSet>(() => {
    const bank = setQ.subSets[0]!;
    const questions = [...bank.questions]
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
