'use client';
import { chapters } from '@/content';
import { useState } from 'react';
import Link from 'next/link';

interface ExerciseSidebarProps {
  initialQuestionIdx: number;
  isQuestionActive: (questionIdx: number) => boolean;
  path: string;
  chapter: number;
}

const ExerciseSidebar: React.FC<ExerciseSidebarProps> = ({
  initialQuestionIdx = 0,
  isQuestionActive,
  path,
  chapter,
}) => {
  const [questionIdx, setQuestionIdx] = useState(initialQuestionIdx);

  const chaptersMap = new Map();
  chapters.forEach((chapter) => {
    chaptersMap.set(chapter.id, chapter);
  });

  return (
    <>
      <button
        data-drawer-target='default-sidebar'
        data-drawer-toggle='default-sidebar'
        aria-controls='default-sidebar'
        type='button'
        className='inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-stone-200'
      >
        <span className='sr-only'>Open sidebar</span>
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            clipRule='evenodd'
            fillRule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
          ></path>
        </svg>
      </button>

      <aside
        className='flex shrink-0 top-0 left-0 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'
      >
        <div className='h-full w-full px-4 py-4 overflow-y-auto bg-white'>
          <ul className='space-y-2 font-medium'>
            <li>
              <Link
                href='#'
                className='flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-200 group'
              >
                <svg
                  className='w-5 h-5 text-gray-600'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 16'
                >
                  <path d='M19.9 6.58c0-.009 0-.019-.006-.027l-2-4A1 1 0 0 0 17 2h-4a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v9a1 1 0 0 0 1 1h.3c-.03.165-.047.332-.051.5a3.25 3.25 0 1 0 6.5 0A3.173 3.173 0 0 0 7.7 12h4.6c-.03.165-.047.332-.051.5a3.25 3.25 0 1 0 6.5 0 3.177 3.177 0 0 0-.049-.5h.3a1 1 0 0 0 1-1V7a.99.99 0 0 0-.1-.42ZM16.382 4l1 2H13V4h3.382ZM4.5 13.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm11 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z' />
                </svg>
                <span className='ms-3'>{chaptersMap.get(chapter).title}</span>
              </Link>
            </li>

            {chaptersMap
              .get(chapter)
              .questions.map((item: string, i: number) => {
                const isSelected = isQuestionActive(i);
                return (
                  <li key={i}>
                    <Link
                      href={`${path}${i + 1}`}
                      className={`flex flex-col p-2 rounded-lg group ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-200 opacity-80'
                      }`}
                    >
                      <span className='flex-1 whitespace-nowrap'>
                        Exercise {i + 1}
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default ExerciseSidebar;
