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
      className='text-green-600 rounded-lg text-sm font-semibold px-5 py-2.5 me-2 mb-2 border border-green-600 hover:opacity-90'
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
      <div className='flex w-full h-full overflow-scroll'>
        <div className='p-4 w-full'>
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
