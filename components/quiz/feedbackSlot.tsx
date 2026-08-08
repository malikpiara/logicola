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
 * The ghost: the tallest of the question's hints, unless the answer
 * explanation outweighs it. A hint belongs to a wrong pick and shows
 * while the question is live; the explanation shows once it's out — they
 * never coexist, which is what lets the slot size itself to the taller
 * of the two rather than to their sum.
 */
function ghostContent(question: Question): React.ReactNode {
  const hints = question.options
    .map(hintPartsOf)
    .filter((h): h is OptionHint => h !== undefined);
  if (hints.length === 0) {
    return question.answer ? (
      <p className='qfeed-answer'>
        <HintProse text={question.answer} />
      </p>
    ) : null;
  }
  const tallest = hints.reduce((a, b) => (weigh(b) > weigh(a) ? b : a));
  if (question.answer && question.answer.length > weigh(tallest)) {
    return (
      <p className='qfeed-answer'>
        <HintProse text={question.answer} />
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
  question: Question;
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
  question,
  liveHint,
  liveAnswer,
  motionKey,
}: FeedbackSlotProps) {
  // The ghost only changes with the question, but the slot re-renders on
  // every selection — don't re-rank eighteen hints per click.
  const ghost = useMemo(() => ghostContent(question), [question]);
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
