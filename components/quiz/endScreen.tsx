export function EndScreen({
  numOfCorrectQuestions,
  onTryAgain,
  surfaceColor = '#431407',
  countColor = '#fdba74',
  foregroundColor = '#ffffff',
}: {
  numOfCorrectQuestions: number;
  onTryAgain: () => void;
  surfaceColor?: string;
  countColor?: string;
  foregroundColor?: string;
}) {
  const message =
    numOfCorrectQuestions >= 5 ? 'Hurray! Keep going!' : 'Oh no! Try again.';
  return (
    <>
      <section
        className='motion-enter max-w-7xl rounded-xl w-full h-screen text-center m-auto p-0 flex-col flex justify-center'
        style={{ backgroundColor: surfaceColor, color: foregroundColor }}
      >
        <h1 className='mb-3 text-4xl font-bold font-stretch'>{message}</h1>
        <div className='text-lg font-light'>
          You got{' '}
          <span className='font-normal' style={{ color: countColor }}>
            {numOfCorrectQuestions}/10
          </span>{' '}
          questions correctly.
        </div>
        <button
          type='button'
          onClick={onTryAgain}
          className='motion-button mx-auto mt-8 rounded-md bg-white px-7 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
        >
          Try Again
        </button>
        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
