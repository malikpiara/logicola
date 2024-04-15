import Button from '../button';

type StartScreenProps = {
  onClickStart: () => void;
  questionsCount: number;
};

export function StartScreen({
  onClickStart,
  questionsCount,
}: StartScreenProps) {
  return (
    <>
      <section className='m-auto flex h-full w-full flex-col justify-center bg-rose-950 p-0 text-center text-white animate-in'>
        <h1 className='mb-2 text-3xl font-bold'>Ready for a challenge?</h1>
        <p className='mb-5'>
          Test yourself on the skills in this course and earn mastery points for
          what you already know!
        </p>
        <div className='font-bold'>{questionsCount} questions</div>

        <div>
          <Button className='mt-4' onClick={onClickStart}>
            Start Quiz
          </Button>
        </div>

        <div className='h-40' />
      </section>
    </>
  );
}
