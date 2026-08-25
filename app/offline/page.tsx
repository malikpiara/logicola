export default function OfflinePage() {
  return (
    <div className='motion-enter mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-16 text-center'>
      <div className='space-y-3'>
        <h1 className='text-3xl font-bold text-primaryColor'>
          You&apos;re offline
        </h1>
        {/* Said in a student's words, not ours (2026-08-24 copy
            review): 'route' and 'offline quiz bundle' are our nouns,
            and 'published quizzes' is our internal one. */}
        <p className='text-lg text-gray-600'>
          The exercises you have already opened still work without a connection.
          This page is not one of them.
        </p>
      </div>
      <div className='motion-card rounded-lg border border-gray-200 bg-white p-5 text-left text-sm text-gray-600 shadow-sm'>
        <p>Reconnect and reload, and the rest of the site comes back.</p>
      </div>
    </div>
  );
}
