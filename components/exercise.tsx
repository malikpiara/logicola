'use client';
import React, { useState } from 'react';
import Option from './option';
import { chapters } from '@/content';
import Link from 'next/link';
import Prompt from './prompt';

interface ExerciseProps {
  initialQuestionIdx: number;
  chapter: number;
  showExerciseId: boolean;
}

const Exercise: React.FC<ExerciseProps> = ({
  initialQuestionIdx = 0,
  chapter = 1,
  showExerciseId = true,
}) => {
  const [questionIdx, setQuestionIdx] = useState(initialQuestionIdx);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  // Helper function to generate the href for the Next button
  const getNextHref = () => {
    const nextQuestionIdx = questionIdx + 2;

    if (chapter === 6.1) {
      return `/basic-propositional-logic/easier-translations/${nextQuestionIdx}`;
    }
    if (chapter === 3) {
      return `/informal/definitions/${nextQuestionIdx}`;
    } else {
      return `/basic-propositional-logic/harder-translations/${nextQuestionIdx}`;
    }
  };

  const chaptersMap = new Map();
  chapters.forEach((chapter) => {
    chaptersMap.set(chapter.id, chapter);
  });

  const currentChapter = chaptersMap.get(chapter);
  const question = chaptersMap.get(chapter).questions[questionIdx];

  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className='max-w-7xl p-6 bg-white border border-gray-200 rounded-lg mb-6'>
      {showExerciseId && (
        <h3 className='mb-2 text-xl font-bold tracking-tight text-gray-900'>
          {questionIdx + 1}.
        </h3>
      )}
      <div className='mx-auto w-full max-w-screen-xl p-4'>
        <div className='md:flex flex-col md:justify-between gap-5'>
          <Prompt value={question.prompt} />

          {question.options.map((option: any) => {
            return (
              <Option
                isSelected={option.id === selectedOptionId}
                isCorrect={question.correctId.includes(option.id)}
                showSolution={showSolution}
                key={option.id}
                label={option.label}
                onClick={() => {
                  setSelectedOptionId(option.id);
                }}
              />
            );
          })}
        </div>
      </div>
      <hr className='h-px my-4 bg-gray-200 border-0' />
      {selectedOptionId != null && showSolution && (
        <div className='p-2 mb-3 text-gray-800'>
          You selected option {selectedOptionId + 1}. The correct answer is{' '}
          {question.correctId + 1}.
        </div>
      )}

      <div className='flex justify-between'>
        <button
          type='button'
          disabled={selectedOptionId == null}
          onClick={() => {
            setShowSolution(true);
          }}
          className={`text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
            selectedOptionId == null
              ? ' bg-gray-200 cursor-not-allowed'
              : 'bg-primary hover:opacity-90'
          }`}
        >
          Check answer
        </button>

        {/* I'm displaying a "next" button as long as
      there are exercises left in the array. */}
        {questionIdx < currentChapter.questions.length - 1 && (
          <Link href={getNextHref()} scroll={false}>
            <button
              type='button'
              className={`text-primary rounded-lg text-sm font-semibold px-5 py-2.5 me-2 mb-2 border border-primary hover:opacity-90 `}
            >
              Next
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Exercise;
