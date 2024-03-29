export function EndScreen({
  numOfCorrectQuestions,
}: {
  numOfCorrectQuestions: number;
}) {
  return (
    <>
      <div className='max-w-7xl rounded-lg bg-amber-950 w-full h-screen text-center m-0 p-0 text-white flex-col flex justify-center'>
        <h1 className='mb-2 text-3xl font-bold'>Hurray! Keep going!</h1>
        <div className='font-bold'>
          You got {numOfCorrectQuestions}/10 questions correctly in the first
          attempt.
        </div>
        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </div>
    </>
  );
}
