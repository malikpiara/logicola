'use client';
import { content } from '@/content';
import Link from 'next/link';
import Question from '@/components/question/question';
import { useState } from 'react';

export default function SubchapterQuestionPage({
  params: {
    chapter: chapterSlug,
    subchapter: subChapterSlug,
    question: questionParam,
  },
}: {
  params: { chapter: string; subchapter: string; question: string };
}) {
  const questionIndex = parseInt(questionParam) - 1;
  const subChapter = content.chapters[chapterSlug].subChapters[subChapterSlug];
  const questions = subChapter.questions;

  const nextQuestionButton = questionIndex < questions.length - 1 && (
    <Link
      className='mb-2 me-2 rounded-lg border border-green-600 px-5 py-2.5 text-sm font-semibold text-green-600 hover:opacity-90'
      href={`/${chapterSlug}/${subChapterSlug}/questions/${questionIndex + 2}`}
    >
      Next
    </Link>
  );

  const [selectedOptionIndices, setSelectedOptionIndices] = useState<
    Set<number>
  >(new Set());

  const [showSolution, setShowSolution] = useState(false);

  return (
    <>
      <div className='flex h-full w-full overflow-scroll'>
        <div className='w-full p-4'>
          <h1 className='mb-6 text-3xl font-bold text-gray-900'>
            {subChapter.title}
          </h1>
          <Question
            question={questions[questionIndex]}
            questionIndexToShow={questionIndex}
            nextQuestionButton={nextQuestionButton}
            selectedOptionIndices={selectedOptionIndices}
            setSelectedOptionIndices={setSelectedOptionIndices}
            randomizeOptions={subChapter.randomizeQuestions}
            showSolution={showSolution}
            setShowSolution={setShowSolution}
            onAnswerCheck={() => setShowSolution(true)}
          />
        </div>
      </div>
    </>
  );
}
