import React, { useMemo } from 'react';
import type { OptionHint, Question } from '@/content/types';
import { HintBlock, HintProse, hintPartsOf } from './hintBlock';

/**
 * The RESERVED feedback slot — the working default for feedback placement
 * (Malik, 2026-08-06; decision 4 in docs/redesign-handoff.md).
 *
 * The 2008 original anchors its answer palette to the bottom of a fixed
 * window and lets the discourse (question → attempt → response) accumulate
 * in the space above, so feedback appears ABOVE the options and the
 * options never move. Those are two properties, and this slot copies
 * both: the position, and the constant height — a learner who has settled
 * on "my answer is the third one down" doesn't have it slide out from
 * under the cursor the moment a hint appears.
 *
 * Constant height without a magic number: the tallest thing the slot
 * could hold for this question is rendered invisibly and sets the box,
 * and the live content floats over it. A `min-height` guess would either
 * waste space or let the long case push the options down anyway — the
 * one case the whole idea exists to prevent.
 */

/**
 * Rank hints by clause count first, then characters — a clause list is a
 * line each, so a three-clause hint outgrows a longer single paragraph.
 * (The lab's own approximation; still an approximation of measured height.)
 */
function weigh(hint: OptionHint): number {
  return (hint.clauses?.length ?? 0) * 1000 + hint.lead.length;
}

/**
 * The ghost: the tallest hint in the RUN, unless an answer explanation
 * outweighs it. A hint belongs to a wrong pick and shows while the
 * question is live; the explanation shows once it's out — they never
 * coexist, which is what lets the slot size itself to the taller of
 * the two rather than to their sum.
 *
 * Across the whole run, not per question (2026-08-24, Malik: "when we
 * go from question to question on Set A on desktop, there are height
 * layout shifts"). Sizing per question made the reservation itself the
 * shift: measured on Set A, the prompt and options never moved a pixel
 * while the slot alternated 24px ↔ 48px as each question's tallest
 * hint changed, moving everything below it on every advance. A slot
 * that holds still WITHIN a question but jumps BETWEEN them isn't
 * keeping the promise it exists for. Constant for the run costs the
 * short questions a line of blank space and is bounded by the 96px
 * desktop cap.
 */
function ghostContent(questions: Question[]): React.ReactNode {
  const hints = questions
    .flatMap((q) => q.options)
    .map(hintPartsOf)
    .filter((h): h is OptionHint => h !== undefined);
  const longestAnswer = questions
    .map((q) => q.answer)
    .filter((a): a is string => !!a)
    .reduce((a, b) => (b.length > a.length ? b : a), '');
  if (hints.length === 0) {
    return longestAnswer ? (
      <p className='qfeed-answer'>
        <HintProse text={longestAnswer} />
      </p>
    ) : null;
  }
  const tallest = hints.reduce((a, b) => (weigh(b) > weigh(a) ? b : a));
  if (longestAnswer && longestAnswer.length > weigh(tallest)) {
    return (
      <p className='qfeed-answer'>
        <HintProse text={longestAnswer} />
      </p>
    );
  }
  return (
    <div className='qfeed-hint'>
      <HintBlock hint={tallest} />
    </div>
  );
}

export interface FeedbackSlotProps {
  /**
   * Every question in the run, for sizing the ghost once. The shell
   * passes the shuffled bank; the slot reserves the tallest hint in it
   * so the reservation never changes between questions.
   */
  sizingQuestions: Question[];
  /** The hint under review — a wrong pick's gloss. Wins over the answer. */
  liveHint?: OptionHint;
  /** The answer explanation, once the solution is out. */
  liveAnswer?: string;
  /**
   * Remount key for the live content, so the entrance animation plays
   * when the CONTENT changes and never on unrelated re-renders.
   */
  motionKey: string;
}

export function FeedbackSlot({
  sizingQuestions,
  liveHint,
  liveAnswer,
  motionKey,
}: FeedbackSlotProps) {
  // Ranked ONCE per run now, not per question — the slot re-renders on
  // every selection and the bank can hold a hundred questions.
  const ghost = useMemo(() => ghostContent(sizingQuestions), [sizingQuestions]);
  return (
    <div className='qfeed'>
      <div className='qfeed-ghost' aria-hidden='true'>
        {ghost}
      </div>
      <div className='qfeed-live' aria-live='polite'>
        {liveHint ? (
          <div key={motionKey} className='qfeed-hint motion-answer-reveal'>
            <HintBlock hint={liveHint} />
          </div>
        ) : liveAnswer ? (
          <p key={motionKey} className='qfeed-answer motion-answer-reveal'>
            <HintProse text={liveAnswer} />
          </p>
        ) : null}
      </div>
    </div>
  );
}
