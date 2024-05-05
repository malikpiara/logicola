import Button from '../button';

export function StartScreen() {
  return (
    <>
      <section className='animate-in max-w-7xl rounded-xl bg-orange-950 w-full h-screen text-center p-0 text-white flex-col flex justify-center m-auto'>
        <h1 className='mb-3 text-4xl font-bold font-stretch'>
          Ready for a challenge?
        </h1>
        <p className='mb-5 max-w-96 mx-auto text-lg font-light'>
          Test your knowledge on this chapter and see how much you already know!
        </p>
        <div className='font-semibold text-orange-300'>10 questions</div>

        {
          // Temporary filler to make the text content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
