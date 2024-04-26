'use client';
import { content } from '@/content';
import Link from 'next/link';
import Question from '@/components/question/question';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';

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

  const explanationMutation = useMutation({
    mutationKey: ['explanation', questions[questionIndex]],
    mutationFn: async () => {
      const response = await fetch('api', {
        method: 'POST',
        body: JSON.stringify({
          question: questions[questionIndex],
        }),
      });

      const data = await response.text();
      console.log(data);
      return data;
    },
  });

  console.log(explanationMutation.isSuccess);

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
          {explanationMutation.isSuccess ? (
            <div className='mt-4 max-w-[50%]'>
              <h2 className='text-xl font-bold text-gray-900'>Explanation</h2>
              <p className='break-words text-gray-700'>
                {explanationMutation.data}
              </p>
            </div>
          ) : (
            <Button
              onClick={
                explanationMutation.isPending
                  ? undefined
                  : () => explanationMutation.mutateAsync()
              }
              disabled={explanationMutation.isPending}
            >
              {explanationMutation.isPending ? 'Loading...' : 'Get explanation'}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
