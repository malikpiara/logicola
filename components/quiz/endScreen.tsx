import { TARGET_SCORE } from '@/lib/scoring';
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
}: {
  numOfCorrectQuestions: number;
  onTryAgain: (mode?: QuizMode) => void;
  /** PROTOTYPE — see ./quizMode. `count` has a denominator; `score` doesn't. */
  mode?: QuizMode;
  score?: number;
  questionsTaken?: number;
  offerScoredRun?: boolean;
  surfaceColor?: string;
  countColor?: string;
  foregroundColor?: string;
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
        className='motion-enter max-w-7xl rounded-xl w-full h-screen text-center m-auto p-0 flex-col flex justify-center'
        style={{ backgroundColor: surfaceColor, color: foregroundColor }}
      >
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
          Matches the start screen's CTA: shallow `corner-shape` notch
          (rounded-[9px] sets the depth) rhyming with the Logicola
          cartridge corner, plus the adaptive "ink" fill — the set's own
          foreground as the background, its surface as the label — so it
          inverts and clears contrast on every set's screen.
        */}
        <button
          type='button'
          onClick={() => onTryAgain(mode)}
          style={{ backgroundColor: foregroundColor, color: surfaceColor }}
          className='corner-notch motion-button mx-auto mt-8 w-full max-w-[15rem] rounded-[9px] px-7 py-2.5 text-base font-semibold font-stretch hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
        >
          Try Again
        </button>

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

        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
