'use client';
import React, { useEffect, useRef, useCallback } from 'react';
import Option from '../option';
import Prompt from '../prompt';
import useQuizState from './useQuizState';
import { StartScreen } from './startScreen';
import { EndScreen } from './endScreen';
import Button from '../button';
import { KeyboardKeys } from './keyboardKeys';
import { usePostHog } from 'posthog-js/react';

export interface QuizProps {
  chapter: number;
  showExerciseId: boolean;
}

interface Option {
  id: number;
  label: string;
  isChecked: boolean;
}

interface Question {
  id: string;
  prompt: string;
  options: Option[];
  correctId: number | number[];
  answer?: string; // Gensler's hints
  isChecked?: boolean;
}

const Quiz: React.FC<QuizProps> = ({ chapter = 3 }) => {
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
  } = useQuizState(chapter);

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
        <div className='animate-in max-w-7xl p-6 bg-white border border-gray-200 rounded-lg mb-6 m-auto'>
          <div className='mx-auto w-full max-w-screen-xl p-4'>
            {currentQuestion && ( // Ensure questions are loaded
              <div className='md:flex flex-col md:justify-between gap-5 max-sm:flex max-sm:gap-5'>
                <Prompt value={currentQuestion.prompt} />

                <h2 className='text-xl font-bold text-gray-800'>
                  {currentChapter!.header}
                </h2>

                {currentQuestion.options.map((option, index) => {
                  return (
                    <Option
                      index={option.id + 1}
                      showIndex
                      isSelected={option.id === selectedOptionId}
                      isCorrect={currentQuestion.correctId.includes(option.id)}
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
                <></>
              )}
            </div>
          )}
        </div>
      )}

      <div className='fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 flex items-center justify-between'>
        <div className='ml-5'>
          {!showStartScreen && !showEndScreen && <KeyboardKeys />}
        </div>

        <div className='flex justify-end gap-5 items-center h-full align-bottom text-gray-800 font-medium'>
          {!showStartScreen && !showEndScreen && (
            <div className='flex'>{questionCounter} of 10</div>
          )}
          <div className='flex h-max'>
            {showStartScreen && (
              <Button label='Start Quiz' onClick={onShowStartScreen} />
            )}
            {!showSolution && !showStartScreen && !showEndScreen && (
              <>
                <Button
                  label='Check Answer'
                  disabled={selectedOptionId == null}
                  onClick={() => {
                    incrementScore(
                      selectedOptionId!,
                      currentQuestion.correctId
                    );
                    onShowSolution();
                  }}
                />
              </>
            )}

            {selectedOptionId != null && showSolution && (
              <>
                <Button label='Next Question' onClick={handleNextQuestion} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
