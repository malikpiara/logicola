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

  return (
    <aside className='flex h-full bg-gray-50 p-4 overflow-scroll'>
      <Accordion
        type='multiple'
        className='w-80 h-full'
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
                          {subChapter.questions.map((_, index) => (
                            <AccordionItem key={index} value={index.toString()}>
                              <Link
                                className={classNames(
                                  'pl-2 flex flex-1 items-center justify-between py-2 transition-all rounded-lg',
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
