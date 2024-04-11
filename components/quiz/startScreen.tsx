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
      <section className='animate-in bg-rose-950 w-full h-full text-center p-0 text-white flex-col flex justify-center m-auto'>
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
