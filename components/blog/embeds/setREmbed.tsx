'use client';

import { useState } from 'react';
import Quiz from '@/components/quiz';
import { getQuizScreenColors } from '@/components/quiz/quizColors';
import { EmbedFrame } from './embedFrame';
import { fallacyQuestions, generateSetR } from '@/content/sets/setR.generator';
import type { Question, SubSet } from '@/content/types';

/**
 * Set R inside a blog post (Malik, 2026-09-21: the Set R post's
 * screenshot of the drill becomes the drill). Same contract as
 * setQEmbed: this is `components/quiz` itself in `embedded` mode —
 * start screen, fixed 18-cell grid, up-to-three picks, hints, scored
 * run and end screen are the shipped ones. Only the bank differs: Set R
 * is generated, so each mount draws `count` fresh passages the way the
 * full-page drill does, and a reload draws again.
 *
 * `pick` here is a list of FALLACY CODES, not question ids (Set Q's
 * `pick` pins ids because Set Q is a static bank; Set R has no stable
 * ids, its passages are drawn). `data-pick="aa,sm"` yields one passage
 * per code, in that order, each still drawn at random from that
 * fallacy's variants — so a post can open on an appeal to authority
 * without pinning which one.
 *
 * Lives in its own chunk behind quizEmbed.tsx's client-side
 * `dynamic()`, the bundle contract: the Set R generator and its
 * passage corpus must never be statically reachable from shared code.
 */
export function SetREmbed({
  count,
  pick,
}: {
  count: number;
  /** Fallacy codes to show, in order (e.g. ['aa', 'sm']); overrides the draw. */
  pick?: string[];
}) {
  // One draw per mount, in a lazy initializer (the shape the Set Q
  // embed and generatedQuiz.tsx use). Safe: the island is ssr:false, so
  // no server draw exists to mismatch during hydration.
  const [subSet] = useState<SubSet>(() => {
    const n = Math.max(1, Math.min(count, 20));
    const pinned = pick?.length ? drawByCode(pick) : [];
    if (pinned.length) {
      const bank = generateSetR(undefined, 1).subSets[0]!;
      return { ...bank, questions: pinned };
    }
    return generateSetR(undefined, n).subSets[0]!;
  });

  return (
    <EmbedFrame surface={getQuizScreenColors(subSet).surfaceColor}>
      <Quiz subSet={subSet} embedded />
    </EmbedFrame>
  );
}

/**
 * One passage per requested code, in the requested order. The stream
 * shuffles all eighteen fallacies per cycle, so every code appears
 * within the first eighteen draws; unknown codes are skipped.
 */
function drawByCode(codes: string[]): Question[] {
  const wanted = new Set(codes);
  const found = new Map<string, Question>();
  const stream = fallacyQuestions();
  for (let i = 0; i < 18 && found.size < wanted.size; i++) {
    const question = stream.next().value as Question;
    // Ids are `gen.R.<code>.<n>` — see qid() in the generator.
    const code = question.id.split('.')[2]!;
    if (wanted.has(code) && !found.has(code)) found.set(code, question);
  }
  return codes.flatMap((code) => found.get(code) ?? []);
}
