export function EndScreen({
  numOfCorrectQuestions,
}: {
  numOfCorrectQuestions: number;
}) {
  const message =
    numOfCorrectQuestions >= 5 ? 'Hurray! Keep going!' : 'Oh no! Try again.';
  return (
    <>
      <section className='max-w-7xl rounded-xl bg-orange-950 w-full h-screen text-center m-auto p-0 text-white flex-col flex justify-center'>
        <h1 className='mb-3 text-4xl font-bold font-stretch'>{message}</h1>
        <div className='font-bold'>
          You got{' '}
          <span className='text-orange-300'>{numOfCorrectQuestions}/10</span>{' '}
          questions correctly.
        </div>
        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
