export function StartScreen() {
  return (
    <>
      <div className='max-w-7xl rounded-lg bg-amber-950	 w-full h-screen text-center m-0 p-0 text-white flex-col flex justify-center'>
        <h1 className='mb-2 text-3xl font-bold'>Ready for a challenge?</h1>
        <p className='mb-5'>
          Test yourself on the skills in this course and earn mastery points for
          what you already know!
        </p>
        <div className='font-bold'>10 questions</div>
        {
          // Temporary filler to make the content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </div>
    </>
  );
}
