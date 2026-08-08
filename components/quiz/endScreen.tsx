import { TARGET_SCORE } from '@/lib/scoring';
import { GemButton } from './gemButton';
import { PatternLayer } from './patternLayer';
import type { QuizPatternKind } from '@/lib/patterns';
import { DEFAULT_QUIZ_MODE, scoreMode, type QuizMode } from './quizMode';

export function EndScreen({
  numOfCorrectQuestions,
  onTryAgain,
  mode = DEFAULT_QUIZ_MODE,
  score = 0,
  questionsTaken = 0,
  offerScoredRun = false,
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
        <h1 className='mb-3 text-4xl font-bold font-stretch'>{message}</h1>

        {mode.kind === 'score' ? (
          <div className='text-lg font-light'>
            <span className='font-normal' style={{ color: countColor }}>
              {score} points
            </span>{' '}
            at level {mode.level}, in {questionsTaken}{' '}
            {questionsTaken === 1 ? 'problem' : 'problems'}.
          </div>
        ) : (
          <div className='text-lg font-light'>
            You got{' '}
            <span className='font-normal' style={{ color: countColor }}>
              {numOfCorrectQuestions}/{mode.total}
            </span>{' '}
            questions correctly.
          </div>
        )}

        {/*
          Matches the start screen's CTA: the gem silhouette with the
          adaptive "ink" fill — the set's own foreground as the background,
          its surface as the label — so it inverts and clears contrast on
          every set's screen. Focus is the wrapper's band, not a ring: a
          clipped button paints no ring.
        */}
        <GemButton
          containerClassName='mx-auto mt-8 w-full max-w-[15rem]'
          className='hover:opacity-90'
          style={{ backgroundColor: foregroundColor, color: surfaceColor }}
          onClick={() => onTryAgain(mode)}
        >
          Try Again
        </GemButton>

        {/* Graduation: offered where someone has just proved they can do it. */}
        {offerScoredRun && mode.kind === 'count' && (
          <button
            type='button'
            onClick={() => onTryAgain(scoreMode())}
            className='mx-auto mt-5 cursor-pointer text-sm underline underline-offset-4 opacity-70 hover:opacity-100'
          >
            Ready for a scored run to {TARGET_SCORE}? →
          </button>
        )}
      </section>
    </>
  );
}
