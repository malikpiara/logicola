'use client';
import React, { useState } from 'react';
import Option from './option';
import { chapters } from '@/contentOld';
import Link from 'next/link';
import Prompt from './prompt';
import { Question } from '@/types';

type ExerciseProps = {
  questions: Question[];
  showExerciseId?: boolean;
};

const NewExercise: React.FC<ExerciseProps> = ({
  questions,
  showExerciseId = true,
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOptionIndices, setSelectedOptionIndices] = useState<
    Set<number>
  >(new Set());
  const [showSolution, setShowSolution] = useState(false);

  const question = questions[questionIdx];

  const hasMultipleAnswers = question.correctIndices.length > 1;

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

          {question.options.map((option, optionIndex) => {
            const isSelected = selectedOptionIndices.has(optionIndex);
            return (
              <Option
                key={option}
                isSelected={isSelected}
                isCorrect={question.correctIndices.includes(optionIndex)}
                showSolution={showSolution}
                label={option}
                disabled={showSolution}
                onClick={() => {
                  if (hasMultipleAnswers) {
                    if (isSelected) {
                      setSelectedOptionIndices((prev) => {
                        prev.delete(optionIndex);
                        return new Set(prev);
                      });
                    } else {
                      setSelectedOptionIndices(
                        (prev) => new Set(prev.add(optionIndex))
                      );
                    }
                  } else {
                    setSelectedOptionIndices(
                      isSelected ? new Set() : new Set([optionIndex])
                    );
                  }
                }}
              />
            );
          })}
        </div>
      </div>
      <hr className='h-px my-4 bg-gray-200 border-0' />

      {showSolution && (
        <>
          {question.correctIndices.length === 1 ? (
            <div className='p-2 mb-3 text-gray-800'>
              You selected option {Array.from(selectedOptionIndices)[0] + 1}.
              The correct answer is {question.correctIndices[0] + 1}
            </div>
          ) : (
            <div className='p-2 mb-3 text-gray-800'>
              You selected options{' '}
              {Array.from(selectedOptionIndices)
                .toSorted()
                .map((index) => index + 1)
                .join(', ')}
              . The correct answers are{' '}
              {question.correctIndices.map((index) => index + 1).join(', ')}
            </div>
          )}
          {question.answer && (
            <div className='p-2 mb-3 text-gray-800'>{question.answer}</div>
          )}
        </>
      )}

      <div className='flex justify-between'>
        <button
          type='button'
          disabled={selectedOptionIndices.size === 0}
          onClick={() => {
            setShowSolution(true);
          }}
          className={`text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
            selectedOptionIndices.size === 0
              ? ' bg-gray-200 cursor-not-allowed'
              : 'bg-primary hover:opacity-90'
          }`}
        >
          Check answer
        </button>

        {questionIdx < questions.length - 1 && (
          <button
            onClick={() => {
              setQuestionIdx(questionIdx + 1);
              setSelectedOptionIndices(new Set());
              setShowSolution(false);
            }}
            type='button'
            className={`text-primary rounded-lg text-sm font-semibold px-5 py-2.5 me-2 mb-2 border border-primary hover:opacity-90 `}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default NewExercise;
