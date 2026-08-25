'use client';

import { useState } from 'react';
import { TARGET_SCORE } from '@/lib/scoring';
import { GemButton, GemLink } from './gemButton';
import { PatternLayer } from './patternLayer';
import { CountUp } from './countUp';
import { praiseFor } from './praise';
import { ScreenExit } from './screenExit';
import type { QuizPatternKind } from '@/lib/patterns';
import type { QuizCatalogEntry } from '@/lib/quizCatalog';
import { nextDrillLabel } from '@/lib/nextDrill';
import { DEFAULT_QUIZ_MODE, scoreMode, type QuizMode } from './quizMode';

/**
 * The end screen — the receipt, decided in docs/endscreen-lab.html over
 * several passes with Malik on 2026-08-23. The lab keeps every alternative
 * that lost, and why.
 *
 * WHAT WAS WRONG ORIGINALLY. The screen offered Try Again and nothing else,
 * and ON PHONES that made a completed run a cul-de-sac: the quiz page
 * renders the site navbar inside `hidden lg:block`, so a desktop learner
 * can always leave through the wordmark, but the phone's only ✕ lives in
 * the question screen's sticky header — which this screen replaces.
 * Reaching 100 removed the only way out.
 *
 * THE EXIT IS THE CORNER ✕ (lab § 2, option b). The same glyph and the same
 * corner as the question screen, so nothing new has to be learned and the
 * exit never disappears at any point in a run. It also frees the action
 * column to be about the DRILL only: the ✕ owns leaving, the column owns
 * what to do next.
 *
 * THE RECEIPT IS ROWS, NOT COLUMNS (lab § 1, R4). Measured against the
 * three-column version at 390px: the columns fit with nothing to spare —
 * "FIRST TRY" rendered 97px wide inside a 96.7px column — where a row has
 * 280px for its label. Rows also SCALE, which is what let the ambiguous
 * "18 of 22" become a labelled "SOLVED FIRST TRY 18/22" — the ambiguity was
 * the bare label, not the ratio. And with the numbers counting, a
 * right-aligned value is
 * the only stable one: centred, it grew in both directions and shimmied for
 * the whole animation (measured 3.6px left, 3.7px right; right-aligned, 0).
 *
 * SOLVED FIRST TRY is the figure that makes this a receipt rather than a
 * tally. `ScoreState.solvedClean` has carried the docstring "Problems
 * solved first try — for the end screen" since the scoring port and was
 * used nowhere until now: the app computed run quality and discarded it, so
 * a 20-for-20 run and a 40-for-60 run produced identical screens.
 *
 * THE HEADLINE IS GENSLER'S (see ./praise). Only on a run that reached the
 * target — praise over "Out of problems." would be congratulating someone
 * for exhausting the question bank.
 */

/**
 * The quiet tier. 80% ink, and that number is a measured floor rather than
 * a taste: the previous "Ready for a scored run" link shipped at
 * `opacity-70`, which fails WCAG AA on three of the seven sets (A 4.24:1,
 * R 3.98, J 3.92). At 80% the worst set is J at 4.86. Anything quieter has
 * to be re-measured against all seven inks, not eyeballed on Set L, which
 * flatters at 12.67:1 and is exactly how the old failure survived.
 */
const QUIET =
  'cursor-pointer text-sm underline underline-offset-4 opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

export function EndScreen({
  numOfCorrectQuestions,
  onTryAgain,
  mode = DEFAULT_QUIZ_MODE,
  score = 0,
  questionsTaken = 0,
  solvedClean = 0,
  offerScoredRun = false,
  nextDrill,
  surfaceColor = '#431407',
  countColor = '#fdba74',
  foregroundColor = '#ffffff',
  patternKind = 'camo',
}: {
  numOfCorrectQuestions: number;
  onTryAgain: (mode?: QuizMode) => void;
  /** See ./quizMode. `count` has a denominator; `score` doesn't. */
  mode?: QuizMode;
  score?: number;
  questionsTaken?: number;
  /** Problems solved first try — `ScoreState.solvedClean`. */
  solvedClean?: number;
  offerScoredRun?: boolean;
  /**
   * The next drill in THIS set, when there is one — see lib/nextDrill.
   * Resolved by the parent so this stays a presentational component.
   */
  nextDrill?: QuizCatalogEntry;
  surfaceColor?: string;
  countColor?: string;
  foregroundColor?: string;
  /** Which pattern dresses the card — camo classic (easy) or giant (hard). */
  patternKind?: QuizPatternKind;
}) {
  const reachedTarget = score >= TARGET_SCORE;
  const graduated = mode.kind === 'score' && reachedTarget;

  // Rolled once per mount, like the pattern's scatter: a re-render must not
  // swap the headline out from under someone mid-read.
  const [praiseSeed] = useState(() => Math.floor(Math.random() * 0x100000));

  const message = graduated
    ? praiseFor(praiseSeed)
    : mode.kind === 'score'
      ? 'Out of problems.'
      : numOfCorrectQuestions >= 5
        ? 'Hurray! Keep going!'
        : 'Oh no! Try again.';

  // Only a completed run graduates. Offering the HARD set to someone who
  // just exhausted the question bank without reaching 100 would be the app
  // misreading its own scoreboard.
  const onward = graduated ? nextDrill : undefined;

  // The gem's adaptive ink, shared by every primary in the flow: the set's
  // foreground becomes the fill and its surface the label, so the button
  // clears contrast on all seven palettes without a per-set value.
  const primaryInk = { backgroundColor: foregroundColor, color: surfaceColor };

  return (
    <section
      className='motion-enter max-w-7xl rounded-none lg:rounded-xl w-full h-dvh text-center m-auto p-0 flex-col flex justify-center relative isolate overflow-hidden'
      style={
        {
          backgroundColor: surfaceColor,
          color: foregroundColor,
          // Published so the exit chip can paint an OPAQUE surface ground
          // beneath itself — see `.qexit-chip` in globals.css.
          '--screen-surface': surfaceColor,
        } as React.CSSProperties
      }
    >
      {/* The pattern frames a clean panel and never sits under text; the
          scatter reshuffles per visit. */}
      <PatternLayer
        kind={patternKind}
        surface={surfaceColor}
        ink={foregroundColor}
        treatment='panel'
        className='pointer-events-none absolute inset-0 -z-10'
      />

      <ScreenExit label='Exit and return to all exercises' />

      {/* px-10 below md: the cleared panel is 88% of the canvas, so at 375px
          a text-4xl headline ran under the pattern frame and off both edges
          — and the section is `overflow-hidden`, so it clipped rather than
          scrolled. */}
      <h1 className='mb-3 px-10 text-4xl font-bold font-stretch md:px-6'>
        {message}
      </h1>

      {mode.kind === 'score' ? (
        <dl className='qreceipt mx-auto w-full max-w-[17.5rem] px-10 text-left md:px-6'>
          <div>
            <dt>Points</dt>
            <dd style={{ color: countColor }}>
              <CountUp value={score} order={0} />
            </dd>
          </div>
          {/* ONE ratio row, not two separate figures (Malik, 2026-08-23).
              Split, the two numbers made the reader do the arithmetic; as
              "18/22" the shortfall is the thing you see, which is what
              makes it an argument for going again rather than a tally.
              The earlier ambiguity was never the ratio — it was the label
              "FIRST TRY" leaving both halves unexplained. Named in full,
              the denominator reads as what it is.

              Only the NUMERATOR counts. The denominator is the frame the
              achievement climbs inside, so it is there from the first
              frame; animating it would make the target itself look
              unsettled. */}
          <div>
            <dt>Solved first try</dt>
            <dd>
              <CountUp value={solvedClean} order={1} />
              <span className='qratio'>/{questionsTaken}</span>
            </dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>
              <CountUp value={mode.level} order={2} />
            </dd>
          </div>
        </dl>
      ) : (
        <div className='px-10 text-lg font-light md:px-6'>
          You got{' '}
          <span className='font-normal' style={{ color: countColor }}>
            {numOfCorrectQuestions}/{mode.total}
          </span>{' '}
          questions correctly.
        </div>
      )}

      {/* One action column, about the DRILL — the ✕ above owns leaving. */}
      <div className='mx-auto mt-8 flex w-full max-w-[15rem] flex-col items-center gap-3'>
        {onward ? (
          <>
            <GemLink
              href={onward.quizPath}
              containerClassName='w-full'
              className='hover:opacity-90'
              style={primaryInk}
            >
              {nextDrillLabel(onward)}
            </GemLink>
            {/* A true GHOST — no fill and no border, so there is no
                component boundary for 1.4.11 to measure and the control is
                identified by its label, which clears 1.4.3 against every
                set's surface at 7.04:1 or better. The outline version this
                replaced was mislabelled a ghost (Malik, 2026-08-23). */}
            <GemButton
              containerClassName='w-full'
              className='qghost'
              onClick={() => onTryAgain(mode)}
            >
              Try again
            </GemButton>
          </>
        ) : (
          <GemButton
            containerClassName='w-full'
            className='hover:opacity-90'
            style={primaryInk}
            onClick={() => onTryAgain(mode)}
          >
            Try Again
          </GemButton>
        )}

        {/* Graduation to the scored run: only reachable in count mode, which
            no published set runs today (see quizMode). */}
        {offerScoredRun && mode.kind === 'count' && (
          <button
            type='button'
            onClick={() => onTryAgain(scoreMode())}
            className={QUIET}
          >
            Ready for a scored run to {TARGET_SCORE}? →
          </button>
        )}
      </div>
    </section>
  );
}
