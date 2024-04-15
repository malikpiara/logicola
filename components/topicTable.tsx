import { SubChapter } from '@/types';
import DynamicLink from '@/components/dynamicLink';

const TopicTable = ({
  subChapters,
}: {
  subChapters: { [key: string]: SubChapter };
}) => {
  return (
    <>
      {Object.entries(subChapters).map(([slug, subChapter]) => {
        const firstQuestionPath = `${slug}/questions/1`;
        const quizPath = `${slug}/quiz`;
        return (
          <div
            key={slug}
            className='mb-6 max-w-7xl rounded-lg border border-gray-200 bg-white p-6'
          >
            <div>
              <DynamicLink href={firstQuestionPath}>
                <h3 className='mb-2 text-xl font-bold tracking-tight text-gray-900 hover:text-primary'>
                  {subChapter.title}
                </h3>
              </DynamicLink>

              <div className='mx-auto w-full max-w-screen-xl py-2'>
                <div className='md:flex md:justify-between'>
                  <div className='flex w-full flex-col'>
                    <div>
                      <ul className='font-medium text-gray-500'>
                        <DynamicLink href={firstQuestionPath}>
                          <div className='mb-4 flex items-center gap-2 rounded-md p-3 hover:bg-gray-200'>
                            <svg
                              className='h-5 w-5 text-gray-500'
                              aria-hidden='true'
                              xmlns='http: //www.w3.org/2000/svg'
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
                            <li>All Questions</li>
                          </div>
                        </DynamicLink>
                        <DynamicLink href={quizPath}>
                          <div className='mb-4 flex items-center gap-2 rounded-md p-3 hover:bg-gray-200'>
                            <svg
                              className='h-5 w-5 text-gray-500'
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
                            <li>Quiz</li>
                          </div>
                        </DynamicLink>
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
