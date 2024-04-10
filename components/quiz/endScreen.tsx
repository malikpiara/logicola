export function EndScreen({
  numOfCorrectQuestions,
}: {
  numOfCorrectQuestions: number;
}) {
  const message =
    numOfCorrectQuestions >= 5 ? 'Hurray! Keep going!' : 'Oh no! Try again.';
  return (
    <>
      <section className='max-w-7xl rounded-lg bg-rose-950 w-full h-full text-center m-auto p-0 text-white flex-col flex justify-center'>
        <h1 className='mb-2 text-3xl font-bold'>{message}</h1>
        <div className='font-bold'>
          You got {numOfCorrectQuestions}/10 questions correctly.
        </div>
        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
