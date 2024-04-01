'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import Option from '../option';
import Prompt from '../prompt';
import useQuizState from './useQuizState';
import { StartScreen } from './startScreen';
import { EndScreen } from './endScreen';

export interface QuizProps {
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
  correctId: number | number[];
  answer?: string; // Gensler's hints
}

const Quiz: React.FC<QuizProps> = ({
  initialQuestionIdx = 0,
  chapter = 3,
  showExerciseId = true,
}) => {
  const {
    showStartScreen,
    showEndScreen,
    questionIdx,
    selectedOptionId,
    showSolution,
    currentChapter,
    currentQuestion,
    questionCounter,
    numOfCorrectQuestions,
    incrementScore,
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowSolution,
    onShowStartScreen,
    onShowEndScreen,
    setnumOfCorrectQuestions,
  } = useQuizState(chapter, initialQuestionIdx);

  // Creating refs to make each option focusable with the keyboard shorcuts.
  const activeOptionRef = useRef<HTMLButtonElement>(null);

  // Focus the active option when the selectedOptionId changes
  useEffect(() => {
    activeOptionRef.current?.focus();
  }, [selectedOptionId]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!currentQuestion) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          selectNextOption();
          break;
        case 'ArrowUp':
          event.preventDefault();
          selectPreviousOption();
          break;
        case 'Enter':
          event.preventDefault();
          //console.log('Enter');
          if (showStartScreen) {
            onShowStartScreen();
          }
          if (!showStartScreen && !showSolution && selectedOptionId != null) {
            incrementScore(selectedOptionId!, currentQuestion.correctId);
            onShowSolution();
          }
          if (showSolution) {
            // Remove focus from the active option
            activeOptionRef.current?.blur(); // Assuming you have a ref to the active option
            handleNextQuestion();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          event.preventDefault();
          selectOption(parseInt(event.key) - 1);
          break;
      }
    },
    [
      currentQuestion,
      handleNextQuestion,
      incrementScore,
      onShowSolution,
      onShowStartScreen,
      selectNextOption,
      selectOption,
      selectPreviousOption,
      selectedOptionId,
      showSolution,
      showStartScreen,
    ]
  );

  useEffect(() => {
    // Attach event listener when component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]); // Include handleKeyDown in the dependency array to ensure it's updated when it changes

  return (
    <>
      {showStartScreen ? (
        <StartScreen />
      ) : showEndScreen ? (
        <EndScreen numOfCorrectQuestions={numOfCorrectQuestions} />
      ) : (
        <div className='animate-in max-w-7xl p-6 bg-white border border-gray-200 rounded-lg mb-6'>
          <div className='mx-auto w-full max-w-screen-xl p-4'>
            {currentQuestion && ( // Ensure questions are loaded
              <div className='md:flex flex-col md:justify-between gap-5'>
                <Prompt value={currentQuestion.prompt} />

                <h2 className='text-xl font-bold text-gray-800'>
                  What is wrong with this definition?
                </h2>

                {currentQuestion.options.map((option, index) => {
                  return (
                    <Option
                      index={option.id + 1}
                      isActive={option.id === selectedOptionId}
                      isCorrect={option.id === currentQuestion.correctId}
                      showSolution={showSolution}
                      ref={
                        index === selectedOptionId ? activeOptionRef : undefined
                      }
                      key={option.id}
                      label={option.label}
                      onClick={() => {
                        selectOption(option.id);
                        onShowStartScreen();
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <hr className='h-px my-4 bg-gray-200 border-0' />
          {selectedOptionId != null && showSolution && (
            <div className='p-2 mb-3 text-gray-800'>
              {currentQuestion.answer ? (
                <h1>{currentQuestion.answer}</h1>
              ) : (
                <h1>Answer unavailable</h1>
              )}
            </div>
          )}
        </div>
      )}

      <div className='fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200'>
        <div className='flex justify-end gap-5 items-center h-full align-bottom'>
          {!showStartScreen && !showEndScreen && (
            <div className='flex'>{questionCounter} of 10</div>
          )}
          <div className='flex h-max'>
            {showStartScreen && (
              <button
                type='button'
                onClick={onShowStartScreen}
                className={`text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
               bg-primary hover:opacity-90
           }`}
              >
                Start
              </button>
            )}
            {!showSolution && !showStartScreen && !showEndScreen && (
              <button
                type='button'
                disabled={selectedOptionId == null}
                onClick={() => {
                  incrementScore(selectedOptionId!, currentQuestion.correctId);
                  onShowSolution();
                }}
                className={`text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                  selectedOptionId == null
                    ? ' bg-gray-200 cursor-not-allowed'
                    : 'bg-primary hover:opacity-90'
                }`}
              >
                Check answer
              </button>
            )}

            {selectedOptionId != null &&
              questionIdx < currentChapter!.questions.length - 1 &&
              showSolution && (
                <button
                  onClick={handleNextQuestion}
                  type='button'
                  className={`text-primary rounded-lg text-sm font-semibold px-5 py-2.5 me-2 mb-2 border border-primary hover:opacity-90`}
                >
                  Next Question
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
