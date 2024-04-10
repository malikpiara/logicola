export function StartScreen() {
  return (
    <>
      <section className='animate-in max-w-7xl rounded-lg bg-rose-950 w-full h-full text-center p-0 text-white flex-col flex justify-center m-auto'>
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
      </section>
    </>
  );
}
