import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';
import Button from '../button';
import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

export function EndScreen({
  correctQuestionsCount,
  totalQuestionsCount,
  onClickTryAgain,
}: {
  correctQuestionsCount: number;
  totalQuestionsCount: number;
  onClickTryAgain: () => void;
}) {
  const scoreGood = correctQuestionsCount >= totalQuestionsCount / 1.5;

  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('quiz_completed', {
      correctQuestionsCount,
      totalQuestionsCount,
      scorePercentage: (correctQuestionsCount / totalQuestionsCount) * 100,
    });
  }, [correctQuestionsCount, posthog, totalQuestionsCount]);

  return (
    <>
      {scoreGood && <Fireworks autorun={{ speed: 1, duration: 5000 }} />}
      <section className='bg-rose-950 w-full h-full text-center m-auto p-0 text-white flex-col flex justify-center'>
        <h1 className='mb-2 text-3xl font-bold'>
          {scoreGood ? 'Hurray! Keep going!' : 'Oh no! Try again.'}
        </h1>
        <div className='font-bold'>
          You got {correctQuestionsCount}/{totalQuestionsCount} questions
          correctly.
        </div>

        <div>
          <Button className='mt-4' onClick={onClickTryAgain}>
            Try Again
          </Button>
        </div>
        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
