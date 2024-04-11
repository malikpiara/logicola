'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Prompt from '../prompt';
import { Question } from '@/types';
import { QuestionHeader } from './questionHeader';
import { OptionsList } from './optionsList';
import { SolutionDisplay } from './solutionDisplay';
import { shuffleOptionsWithCorrectIndices } from '@/lib/utils';
import NoSSR from '../NoSSR';

type ExerciseProps = {
  question: Question;
  questionIndexToShow?: number;
  nextQuestionButton: ReactNode;
  selectedOptionIndices: Set<number>;
  setSelectedOptionIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
  randomizeOptions?: boolean;
  showSolution?: boolean;
  onAnswerCheck: (isCorrect: boolean) => void;
  scoreboard?: ReactNode;
};

const QuestionComponent: React.FC<ExerciseProps> = ({
  question,
  questionIndexToShow,
  nextQuestionButton,
  selectedOptionIndices,
  setSelectedOptionIndices,
  randomizeOptions = false,
  showSolution = false,
  onAnswerCheck,
  scoreboard,
}) => {
  const [shuffledQuestion, setShuffledQuestion] = useState<Question>(() =>
    randomizeOptions ? shuffleOptionsWithCorrectIndices(question) : question
  );

  useEffect(() => {
    setShuffledQuestion(
      randomizeOptions ? shuffleOptionsWithCorrectIndices(question) : question
    );
  }, [question, randomizeOptions]);

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

  console.log(showSolution);

  return (
    <div className='max-w-7xl p-6 bg-white border border-gray-200 rounded-lg mb-6'>
      {questionIndexToShow !== undefined && (
        <QuestionHeader questionIndexToShow={questionIndexToShow} />
      )}
      <div className='mx-auto w-full max-w-screen-xl p-4'>
        <div className='md:flex flex-col md:justify-between gap-5'>
          <Prompt value={shuffledQuestion.prompt} />

          {/* Can't use ssr because of hydration mismatch when shuffling/randomizing options */}
          <NoSSR>
            <OptionsList
              options={shuffledQuestion.options}
              selectedOptionIndices={selectedOptionIndices}
              showSolution={showSolution}
              correctIndices={shuffledQuestion.correctIndices}
              onOptionClick={handleOptionClick}
            />
          </NoSSR>
        </div>
      </div>
      <hr className='h-px my-4 bg-gray-200 border-0' />

      {showSolution && (
        <SolutionDisplay
          selectedOptionIndices={selectedOptionIndices}
          correctIndices={shuffledQuestion.correctIndices}
          answer={shuffledQuestion.answer}
        />
      )}

      <div className='flex justify-between'>
        <button
          type='button'
          disabled={showSolution || selectedOptionIndices.size === 0}
          onClick={() => {
            // if selected options and correct options are the same, then the answer is correct
            const isCorrect = shuffledQuestion.correctIndices.every(
              (correctIndex) => selectedOptionIndices.has(correctIndex)
            );
            onAnswerCheck(isCorrect);
          }}
          className='text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 disabled:bg-gray-200 disabled:cursor-not-allowed bg-green-600 hover:opacity-90'
        >
          Check answer
        </button>

        {scoreboard}

        {nextQuestionButton}
      </div>
    </div>
  );
};

export default QuestionComponent;
