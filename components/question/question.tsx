'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Prompt from '../prompt';
import { Question } from '@/types';
import { QuestionHeader } from './questionHeader';
import { OptionsList } from './optionsList';
import { SolutionDisplay } from './solutionDisplay';
import { shuffleOptionsWithCorrectIndices } from '@/lib/utils';
import NoSSR from '../NoSSR';
import { usePostHog } from 'posthog-js/react';
import { useHotkeys } from 'react-hotkeys-hook';
import { KeyboardKeys } from '../quiz/keyboardKeys';

type ExerciseProps = {
  question: Question;
  questionIndexToShow?: number;
  nextQuestionButton: ReactNode;
  selectedOptionIndices: Set<number>;
  setSelectedOptionIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
  randomizeOptions?: boolean;
  showSolution?: boolean;
  setShowSolution: React.Dispatch<React.SetStateAction<boolean>>;
  onAnswerCheck: (isCorrect: boolean, isFirstTry: boolean) => void;
  maxRetries?: number;
};

const QuestionComponent: React.FC<ExerciseProps> = ({
  question,
  questionIndexToShow,
  nextQuestionButton,
  selectedOptionIndices,
  setSelectedOptionIndices,
  randomizeOptions = false,
  showSolution = false,
  setShowSolution,
  onAnswerCheck,
  maxRetries,
}) => {
  const [retriesCounter, setRetriesCounter] = useState(0);

  const [shuffledQuestion, setShuffledQuestion] = useState<Question>(() =>
    randomizeOptions ? shuffleOptionsWithCorrectIndices(question) : question
  );

  useEffect(() => {
    setShuffledQuestion(
      randomizeOptions ? shuffleOptionsWithCorrectIndices(question) : question
    );
  }, [question, randomizeOptions]);

  const hasMultipleAnswers = question.correctIndices.length > 1;

  const isCorrect = shuffledQuestion.correctIndices.every((correctIndex) =>
    selectedOptionIndices.has(correctIndex)
  );

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

  const posthog = usePostHog();

  const handleAnswerCheck = () => {
    const isFirstTry = retriesCounter === 0;
    posthog.capture('question_answered', {
      questionIndex: questionIndexToShow,
      isCorrect,
      isFirstTry,
      selectedOptionIndices: Array.from(selectedOptionIndices),
      correctIndices: shuffledQuestion.correctIndices,
      retriesCount: retriesCounter,
      maxRetries,
      randomizeOptions,
    });

    onAnswerCheck(isCorrect, isFirstTry);
    setRetriesCounter((prev) => prev + 1);
  };

  useHotkeys('enter', handleAnswerCheck);

  return (
    <div className='mb-6 max-w-7xl rounded-lg border border-gray-200 bg-white p-6'>
      {questionIndexToShow !== undefined && (
        <QuestionHeader questionIndexToShow={questionIndexToShow} />
      )}
      <div className='mx-auto w-full max-w-screen-xl p-4'>
        <div className='flex-col gap-5 md:flex md:justify-between'>
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
      <hr className='my-4 h-px border-0 bg-gray-200' />

      {showSolution && (
        <SolutionDisplay
          selectedOptionIndices={selectedOptionIndices}
          correctIndices={shuffledQuestion.correctIndices}
          answer={shuffledQuestion.answer}
        />
      )}

      <div className='flex justify-between'>
        {showSolution ? (
          <button
            type='button'
            disabled={
              isCorrect ||
              (maxRetries !== undefined && retriesCounter >= maxRetries)
            }
            onClick={() => {
              setSelectedOptionIndices(new Set());
              setShowSolution(false);
            }}
            className='mb-2 me-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200'
          >
            Try again
          </button>
        ) : (
          <button
            type='button'
            disabled={selectedOptionIndices.size === 0}
            onClick={() => handleAnswerCheck()}
            className='mb-2 me-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200'
          >
            Check answer
          </button>
        )}

        <KeyboardKeys questionsAmount={question.options.length} />

        {nextQuestionButton}
      </div>
    </div>
  );
};

export default QuestionComponent;
