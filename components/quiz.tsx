'use client';
import React, { useEffect, useState } from 'react';
import Option from './option';
import { chapters } from '@/content';
import Prompt from './prompt';

interface QuizProps {
  initialQuestionIdx: number;
  chapter: number;
  showExerciseId: boolean;
}

interface Option {
  id: number;
  label: string;
}

interface Question {
  id: string;
  prompt: string;
  options: Option[];
  correctId: number;
  answer: string;
}

/* const pickRandExerciseNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min); */

const Quiz: React.FC<QuizProps> = ({
  initialQuestionIdx = 0,
  chapter = 3,
  showExerciseId = true,
}) => {
  const [questionIdx, setQuestionIdx] = useState(initialQuestionIdx);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const currentChapter = chapters.find((c) => c.id === chapter);

  const currentQuestion = currentChapter.questions[questionIdx];

  // Function for moving to the next question
  const handleNextQuestion = () => {
    if (questionIdx < currentChapter.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionId(null); // Reset selected option
      setShowSolution(false); // Hide solution
    }
  };

  return (
    <div className='max-w-7xl p-6 bg-white border border-stone-200 rounded-lg mb-6'>
      <div className='mx-auto w-full max-w-screen-xl p-4'>
        {currentQuestion && ( // Ensure questions are loaded
          <div className='md:flex flex-col md:justify-between gap-5'>
            <Prompt value={currentQuestion.prompt} />

            {currentQuestion.options.map((option: any) => {
              return (
                <Option
                  isActive={option.id === selectedOptionId}
                  isCorrect={option.id === currentQuestion.correctId}
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
        )}
      </div>
      <hr className='h-px my-4 bg-stone-200 border-0' />
      {selectedOptionId != null && showSolution && (
        <div className='p-2 mb-3 text-stone-800'>
          You selected option {selectedOptionId + 1}. The correct answer is{' '}
          {currentQuestion.correctId + 1}.
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
              ? ' bg-stone-200 cursor-not-allowed'
              : 'bg-primary hover:opacity-90'
          }`}
        >
          Check answer
        </button>

        {/* I'm displaying a "next" button as long as
      there are exercises left in the array. */}
        {/* selectedOptionId */}
        {selectedOptionId &&
          questionIdx < currentChapter.questions.length - 1 && (
            <button
              onClick={handleNextQuestion}
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

export default Quiz;

/* import Exercise from '@/components/exercise';
import { useState } from 'react';

const pickRandExerciseNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

interface QuizProps {
  numOfExercises: number;
}

const Quiz: React.FC<QuizProps> = ({ numOfExercises = 10 }) => {
  pickRandExerciseNum(1, 60);
  return (
    <>
      <div className='flex w-full h-screen overflow-scroll'>
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-stone-900'>Quiz</h1>
          {[...Array(numOfExercises)].map((_, index) => (
            <Exercise
              chapter={3}
              key={index}
              initialQuestionIdx={pickRandExerciseNum(1, 60)}
              showExerciseId={false}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Quiz; */
