'use client';
import React, { ReactNode, useState } from 'react';
import Prompt from '../prompt';
import { Question } from '@/types';
import { QuestionHeader } from './questionHeader';
import { OptionsList } from './optionsList';
import { SolutionDisplay } from './solutionDisplay';

type ExerciseProps = {
  question: Question;
  questionIndexToShow?: number;
  nextQuestionButton: ReactNode;
};

const QuestionComponent: React.FC<ExerciseProps> = ({
  question,
  questionIndexToShow,
  nextQuestionButton,
}) => {
  const [selectedOptionIndices, setSelectedOptionIndices] = useState<
    Set<number>
  >(new Set());
  const [showSolution, setShowSolution] = useState(false);

  const hasMultipleAnswers = question.correctIndices.length > 1;

  const handleOptionClick = (optionIndex: number) => {
    const isSelected = selectedOptionIndices.has(optionIndex);

    if (hasMultipleAnswers) {
      if (isSelected) {
        setSelectedOptionIndices((prev) => {
          prev.delete(optionIndex);
          return new Set(prev);
        });
      } else {
        setSelectedOptionIndices((prev) => new Set(prev.add(optionIndex)));
      }
    } else {
      setSelectedOptionIndices(isSelected ? new Set() : new Set([optionIndex]));
    }
  };

  return (
    <div className='max-w-7xl p-6 bg-white border border-gray-200 rounded-lg mb-6'>
      {questionIndexToShow !== undefined && (
        <QuestionHeader questionIndexToShow={questionIndexToShow} />
      )}
      <div className='mx-auto w-full max-w-screen-xl p-4'>
        <div className='md:flex flex-col md:justify-between gap-5'>
          <Prompt value={question.prompt} />

          <OptionsList
            options={question.options}
            selectedOptionIndices={selectedOptionIndices}
            showSolution={showSolution}
            correctIndices={question.correctIndices}
            onOptionClick={handleOptionClick}
          />
        </div>
      </div>
      <hr className='h-px my-4 bg-gray-200 border-0' />

      {showSolution && (
        <SolutionDisplay
          selectedOptionIndices={selectedOptionIndices}
          correctIndices={question.correctIndices}
          answer={question.answer}
        />
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
              : 'bg-green-600 hover:opacity-90'
          }`}
        >
          Check answer
        </button>

        {nextQuestionButton}
      </div>
    </div>
  );
};

export default QuestionComponent;
