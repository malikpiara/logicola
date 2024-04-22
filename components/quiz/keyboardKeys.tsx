export function KeyboardKeys({ questionsAmount }: { questionsAmount: number }) {
  return (
    <p className='hidden text-sm text-gray-500 lg:block'>
      You can use keys{' '}
      <kbd className='rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800'>
        1
      </kbd>{' '}
      to{' '}
      <kbd className='rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800'>
        {questionsAmount}
      </kbd>
      {' or '}
      <kbd className='inline-flex items-center rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-gray-800'>
        <svg
          className='h-2.5 w-2.5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 16 10'
        >
          <path d='M9.207 1A2 2 0 0 0 6.38 1L.793 6.586A2 2 0 0 0 2.207 10H13.38a2 2 0 0 0 1.414-3.414L9.207 1Z' />
        </svg>
        <span className='sr-only'>Arrow key up</span>
      </kbd>{' '}
      <kbd className='inline-flex items-center rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-gray-800'>
        <svg
          className='h-2.5 w-2.5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 16 10'
        >
          <path d='M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z' />
        </svg>
        <span className='sr-only'>Arrow key down</span>
      </kbd>
      {' + '}
      <kbd className='rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800'>
        Enter
      </kbd>{' '}
      to navigate the quiz.
    </p>
  );
}
