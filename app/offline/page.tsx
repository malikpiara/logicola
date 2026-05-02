export default function OfflinePage() {
  return (
    <div className='mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center'>
      <div className='space-y-3'>
        <h1 className='text-3xl font-bold text-primaryColor'>
          You&apos;re offline
        </h1>
        <p className='text-lg text-gray-600'>
          Published quizzes remain available after the app has been installed
          and synced while online. This page appears when you open a route that
          is not part of the offline quiz bundle.
        </p>
      </div>
      <div className='rounded-lg border border-gray-200 bg-white p-5 text-left text-sm text-gray-600 shadow-sm'>
        <p>
          To restore the full website experience, reconnect to the internet and
          reload the page.
        </p>
      </div>
    </div>
  );
}
