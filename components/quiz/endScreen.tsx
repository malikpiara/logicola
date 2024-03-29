export function EndScreen() {
  return (
    <>
      <div className='max-w-7xl rounded-lg bg-primary w-full h-screen text-center m-0 p-0 text-white flex-col flex justify-center'>
        <h1 className='mb-2 text-3xl font-bold'>Hurray! Keep going!</h1>
        <div className='font-bold'>
          You got 6/10 questions correctly in the first attempt.
        </div>
        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </div>
    </>
  );
}
