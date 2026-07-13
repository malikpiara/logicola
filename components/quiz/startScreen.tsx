import { Button } from '../ui/button';

interface StartScreenProps {
  onStartQuiz: () => void;
  surfaceColor?: string;
  countColor?: string;
  foregroundColor?: string;
}

export function StartScreen({
  onStartQuiz,
  surfaceColor = '#431407',
  countColor = '#fdba74',
  foregroundColor = '#ffffff',
}: StartScreenProps) {
  return (
    <>
      <section
        className='motion-enter max-w-7xl rounded-xl w-full h-screen text-center p-0 text-white flex-col flex justify-center m-auto'
        style={{ backgroundColor: surfaceColor, color: foregroundColor }}
      >
        <h1 className='mb-3 text-4xl font-bold font-stretch'>
          Ready for a challenge?
        </h1>
        <p className='mb-5 max-w-96 mx-auto text-lg font-light'>
          Test your knowledge on this chapter and see how much you already know!
        </p>
        <div className='font-semibold' style={{ color: countColor }}>
          10 questions
        </div>
        <Button
          size={'lg'}
          className='w-fit cursor-pointer self-center mt-5 font-stretch active:scale-[0.97]'
          onClick={onStartQuiz}
        >
          Start Quiz
        </Button>

        {
          // Temporary filler to make the text content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
