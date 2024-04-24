'use client';
import Link from 'next/link';
import { content } from '@/content';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import classNames from 'classnames';
import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const {
    chapter: currentChapter,
    subchapter: currentSubChapter,
    question: currentQuestion,
  } = useParams<{
    chapter: string;
    subchapter: string;
    question: string;
  }>();

  const pathname = usePathname();

  if (pathname.endsWith('/quiz')) {
    return null;
  }

  return (
    <aside className='z-40 flex h-full overflow-scroll bg-gray-50 p-4'>
      <Accordion
        type='multiple'
        className='h-full w-80'
        defaultValue={currentChapter ? [currentChapter] : []}
      >
        {Object.entries(content.chapters).map(([chapterSlug, chapter]) => (
          <AccordionItem key={chapterSlug} value={chapterSlug}>
            <AccordionTrigger
              className={classNames(
                currentChapter === chapterSlug && 'underline'
              )}
            >
              <Link href={`/${chapterSlug}`}>{chapter.title}</Link>
            </AccordionTrigger>
            <AccordionContent>
              <ul className='pl-2'>
                <Accordion
                  type='multiple'
                  {...(currentChapter === chapterSlug &&
                    currentSubChapter && {
                      defaultValue: [currentSubChapter],
                    })}
                >
                  {Object.entries(
                    content.chapters[chapterSlug].subChapters
                  ).map(([subChapterSlug, subChapter]) => (
                    <AccordionItem key={subChapterSlug} value={subChapterSlug}>
                      <AccordionTrigger
                        className={classNames(
                          currentChapter === chapterSlug &&
                            currentSubChapter === subChapterSlug &&
                            'underline'
                        )}
                      >
                        {subChapter.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <Accordion
                          type='single'
                          defaultValue={
                            currentChapter === chapterSlug &&
                            currentSubChapter === subChapterSlug
                              ? currentQuestion
                              : undefined
                          }
                        >
                          <Link
                            className={classNames(
                              'flex flex-1 items-center justify-between rounded-lg py-2 pl-2 transition-all',
                              currentChapter === chapterSlug &&
                                currentSubChapter === subChapterSlug &&
                                !currentQuestion
                                ? 'bg-green-600 text-white'
                                : ' hover:bg-gray-200'
                            )}
                            href={`/${chapterSlug}/${subChapterSlug}/quiz`}
                          >
                            Quiz
                          </Link>
                          {subChapter.questions.map((_, index) => (
                            <AccordionItem key={index} value={index.toString()}>
                              <Link
                                className={classNames(
                                  'flex flex-1 items-center justify-between rounded-lg py-2 pl-2 transition-all',
                                  currentChapter === chapterSlug &&
                                    currentSubChapter === subChapterSlug &&
                                    parseInt(currentQuestion) === index + 1
                                    ? 'bg-green-600 text-white'
                                    : ' hover:bg-gray-200'
                                )}
                                href={`/${chapterSlug}/${subChapterSlug}/questions/${index + 1}`}
                              >
                                Question {index + 1}
                              </Link>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
};
