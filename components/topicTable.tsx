import Link from 'next/link';

const subChapters = [
  {
    id: 6.1,
    title: 'Easier Translations (6.1)',
    topic: {
      description:
        'Translating english sentences into well-formed formula (wff)',
    },
    path: '/logic/basic-propositional-logic/easier-translations/1',
  },
  {
    id: 6.8,
    title: 'Harder Translations (6.8)',
    topic: {
      description:
        'Translating english sentences into well-formed formula (wff)',
    },
    path: '/logic/basic-propositional-logic/harder-translations/1',
  },
];

const TopicTable = () => {
  return (
    <>
      {subChapters.map((item) => {
        return (
          <div
            key={item.id}
            className='max-w-7xl p-6 bg-white border border-stone-200 rounded-lg mb-6'
          >
            <div>
              <Link href={item.path}>
                <h3 className='mb-2 text-xl font-bold tracking-tight text-stone-900 hover:text-primary'>
                  {item.title}
                </h3>
              </Link>

              <div className='mx-auto w-full max-w-screen-xl py-2'>
                <div className='md:flex md:justify-between'>
                  <div className='flex flex-col w-full'>
                    <div>
                      <ul className='text-stone-500 font-medium'>
                        <Link href={item.path}>
                          <div className='flex items-center mb-4 p-3 rounded-md hover:bg-stone-200 gap-2'>
                            <svg
                              className='w-5 h-5 text-stone-500'
                              aria-hidden='true'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 21 21'
                            >
                              <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279'
                              />
                            </svg>
                            <li>{item.topic.description}</li>
                          </div>
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TopicTable;
