import Link from 'next/link';
import { TARGET_SCORE } from '@/lib/scoring';
import { GemButton, GemLink } from './gemButton';
import { PatternLayer } from './patternLayer';
import type { QuizPatternKind } from '@/lib/patterns';
import type { QuizCatalogEntry } from '@/lib/quizCatalog';
import { nextDrillLabel } from '@/lib/nextDrill';
import { DEFAULT_QUIZ_MODE, scoreMode, type QuizMode } from './quizMode';

/**
 * The end screen — and, since 2026-08-23, the only screen in the quiz
 * flow that answers "now what?".
 *
 * WHAT WAS WRONG. The screen offered Try Again and nothing else, and
 * ON PHONES that made a completed run a cul-de-sac. The quiz page
 * renders the site navbar inside `hidden lg:block`
 * (app/(quiz)/[...slugs]/page.tsx — deliberate: below lg the quiz is
 * full-bleed and the in-card ✕ is the exit), so a desktop learner can
 * always leave through the wordmark. A phone learner could not: the
 * ✕ lives in the question screen's sticky header, which the end screen
 * replaces, so reaching 100 points removed the only way out and left
 * the browser's Back button — which, on the first page of a session, is
 * no way out at all. Malik, 2026-08-23: give a finished quiz an exit,
 * and a way on to the harder one.
 *
 * The exit is rendered at EVERY width even though desktop has the
 * navbar. Two reasons: a terminal screen should state its own way
 * forward rather than make you go looking in the chrome for one, and
 * "All exercises" names the destination where the wordmark only implies
 * it. (The START screen still has the phone-width gap — it has no ✕
 * either. Out of scope for this pass; flagged in the handover.)
 *
 * THE HIERARCHY. One rule generates all four states: **the primary is
 * always the way forward, and "forward" is whatever is actually true.**
 *
 *   reached 100, a next drill exists   → primary: that drill
 *                                        quiet:   try again · all exercises
 *   reached 100, no next drill         → primary: all exercises
 *                                        quiet:   try again
 *   ran out of problems                → primary: try again
 *                                        quiet:   all exercises
 *   count mode (dormant)               → as above, plus the scored-run offer
 *
 * The graduated cases put Try Again in the quiet tier on purpose. Under
 * the 2008 economy reaching 100 IS completion — repeating the drill you
 * just completed is the lesser action, and making it the loudest thing
 * on the screen tells the learner the opposite of what the score says.
 * When the run fell short, the same rule puts it back on top.
 *
 * "All exercises" points at `/` because the homepage IS the catalogue
 * since 2026-08-17 — same destination as the question screen's ✕, so
 * the two exits cannot disagree about where out is.
 *
 * QUIET TIER = 80% INK, and that number is load-bearing (measured
 * 2026-08-23). The scored-run link shipped at `opacity-70`, which fails
 * WCAG AA on three of the seven sets — A 4.24:1, R 3.98:1, J 3.92:1
 * against the 4.5 floor. At 80% the worst set is J at 4.86:1 and every
 * other clears 4.9. Anything quieter than 80% has to be re-measured
 * against all seven inks, not eyeballed on Set L (which flatters at
 * 8.06:1 and would have hidden this).
 */

/**
 * The quiet tier. 80% ink (see the note above — it is a measured floor,
 * not a taste), underlined so it reads as a link at a glance, and an
 * explicit focus outline in `currentColor`: the set's ink is 7–12.7:1 on
 * its own surface, which clears 1.4.11 on every palette, where the UA's
 * default ring would be whatever the browser feels like painting on a
 * saturated background. Same shape as `.qexit:focus-visible` in
 * globals.css, so the two exits look focused the same way.
 */
const QUIET =
  'cursor-pointer text-sm underline underline-offset-4 opacity-80 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

export function EndScreen({
  numOfCorrectQuestions,
  onTryAgain,
  mode = DEFAULT_QUIZ_MODE,
  score = 0,
  questionsTaken = 0,
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

  // A scored run has no "out of" — it ends at 100 points, whenever that
  // lands. The only honest summary is the score, the level it was earned at,
  // and how many problems it took.
  const message =
    mode.kind === 'score'
      ? reachedTarget
        ? 'Exercise complete.'
        : 'Out of problems.'
      : numOfCorrectQuestions >= 5
        ? 'Hurray! Keep going!'
        : 'Oh no! Try again.';

  // Only a completed run graduates. Offering the HARD set to someone who
  // just exhausted the question bank without reaching 100 would be the
  // app misreading its own scoreboard.
  const graduated = mode.kind === 'score' && reachedTarget;
  const onward = graduated ? nextDrill : undefined;

  // The gem's adaptive ink, shared by every primary in the flow: the set's
  // foreground becomes the fill and its surface the label, so the button
  // clears contrast on all seven palettes without a per-set value.
  const primaryInk = {
    backgroundColor: foregroundColor,
    color: surfaceColor,
  };

  return (
    <>
      <section
        className='motion-enter max-w-7xl rounded-none lg:rounded-xl w-full h-dvh text-center m-auto p-0 flex-col flex justify-center relative isolate overflow-hidden'
        style={{ backgroundColor: surfaceColor, color: foregroundColor }}
      >
        {/* Same panel treatment as the start screen; the scatter
            reshuffles per visit. The end screen's fuller treatment pass
            remains deferred (redesign-handoff.md). */}
        <PatternLayer
          kind={patternKind}
          surface={surfaceColor}
          ink={foregroundColor}
          treatment='panel'
          className='pointer-events-none absolute inset-0 -z-10'
        />
        {/* px-10 below md, matching the start screen's 2026-08-21 fix: the
            cleared panel is 88% of the canvas, so at 375px the h1 ran under
            the pattern frame and off both edges — and the section is
            `overflow-hidden`, so it clipped rather than scrolled. "Exercise
            complete." at text-4xl is 300px of glyphs on a 375px screen; it
            only ever fit because nobody had reached the end screen on a
            phone. (Malik, 2026-08-23.) */}
        <h1 className='mb-3 px-10 text-4xl font-bold font-stretch md:px-6'>
          {message}
        </h1>

        {mode.kind === 'score' ? (
          <div className='px-10 text-lg font-light md:px-6'>
            <span className='font-normal' style={{ color: countColor }}>
              {score} points
            </span>{' '}
            at level {mode.level}, in {questionsTaken}{' '}
            {questionsTaken === 1 ? 'problem' : 'problems'}.
          </div>
        ) : (
          <div className='px-10 text-lg font-light md:px-6'>
            You got{' '}
            <span className='font-normal' style={{ color: countColor }}>
              {numOfCorrectQuestions}/{mode.total}
            </span>{' '}
            questions correctly.
          </div>
        )}

        {/* One action column, always in the same order: the gem, then the
            quiet tier. The stack is centred rather than pinned to the
            bottom — this screen is a full-height panel with a cleared
            middle, and the pattern owns the edges. */}
        <div className='mx-auto mt-8 flex w-full max-w-[15rem] flex-col items-center gap-5'>
          {onward ? (
            <GemLink
              href={onward.quizPath}
              containerClassName='w-full'
              className='hover:opacity-90'
              style={primaryInk}
            >
              {nextDrillLabel(onward)}
            </GemLink>
          ) : graduated ? (
            <GemLink
              href='/'
              containerClassName='w-full'
              className='hover:opacity-90'
              style={primaryInk}
            >
              All exercises
            </GemLink>
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

          {/* Try Again keeps its place in the column whichever tier it is
              in, so the button never moves between a graduated and a
              fallen-short run. */}
          {graduated && (
            <button
              type='button'
              onClick={() => onTryAgain(mode)}
              className={QUIET}
            >
              Try again
            </button>
          )}

          {/* The exit. Present on every state — that is the whole point of
              this screen's 2026-08-23 pass — and suppressed only where the
              primary gem is already "All exercises", which would make this
              the same link twice. */}
          {!(graduated && !onward) && (
            <Link href='/' className={QUIET}>
              All exercises
            </Link>
          )}

          {/* Graduation to the scored run: offered where someone has just
              proved they can do it. Only reachable in count mode, which no
              published set runs today (see quizMode). */}
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
    </>
  );
}
