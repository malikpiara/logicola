'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import Button from '../button';
import Option from '../option';
import Prompt from '../prompt';
import { EndScreen } from './endScreen';
import { KeyboardKeys } from './keyboardKeys';
import { StartScreen } from './startScreen';
import useQuizState from './useQuizState';
import { Chapter } from '@/content';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { SkeletonCard } from '../ui/skeletonCard';

export interface QuizProps {
  chapter: Chapter;
}

const Quiz: React.FC<QuizProps> = ({ chapter }) => {
  const {
    showStartScreen,
    showEndScreen,
    selectedOptionId,
    showSolution,
    currentChapter,
    currentQuestion,
    questionCounter,
    correctQuestions,
    onCheckAnswer,
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowSolution,
    onShowStartScreen,
    previousGuesses,
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
          if (showStartScreen) {
            onShowStartScreen();
          }
          if (!showStartScreen && !showSolution && selectedOptionId != null) {
            onCheckAnswer();
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

  const [snap, setSnap] = useState<number | string | null>('148px');

  return (
    <>
      {showStartScreen ? (
        <StartScreen onStartQuiz={onShowStartScreen} />
      ) : showEndScreen ? (
        <EndScreen numOfCorrectQuestions={correctQuestions.length} />
      ) : (
        <div className='animate-in max-w-7xl p-0 md:p-6 bg-white md:border border-gray-200 rounded-lg mb-6 m-auto'>
          <div className='mx-auto w-full max-w-screen-xl p-4'>
            {currentQuestion && ( // Ensure questions are loaded
              <div className='flex flex-col md:justify-between gap-5 max-sm:flex'>
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
                      hasBeenIncorrectlyGuessed={previousGuesses.includes(
                        option.id
                      )}
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
              <h1>{currentQuestion.answer}</h1>
            </div>
          )}
        </div>
      )}

      {!showStartScreen && !showEndScreen && (
        <Drawer
          dismissible={false}
          open
          modal={false}
          snapPoints={['150px', '500px']}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <DrawerContent className='fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]'>
            <DrawerHeader>
              <div className='left-0 z-50 w-full h-16 bg-white flex items-center justify-between'>
                <div className='ml-5'>
                  {!showStartScreen && !showEndScreen && <KeyboardKeys />}
                </div>
                <div className='flex justify-end gap-5 items-center h-full align-bottom text-gray-800 font-medium'>
                  {!showStartScreen && !showEndScreen && (
                    <div className='flex'>{questionCounter} of 10</div>
                  )}
                  <div className='flex h-max'>
                    {!showSolution && !showStartScreen && !showEndScreen && (
                      <Button
                        label='Check Answer'
                        disabled={selectedOptionId == null}
                        onClick={onCheckAnswer}
                      />
                    )}
                    {showSolution && (
                      <Button
                        label='Next Question'
                        onClick={handleNextQuestion}
                      />
                    )}
                  </div>
                </div>
              </div>
            </DrawerHeader>
            <div className='flex flex-col justify-center self-center gap-10'>
              <SkeletonCard />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default Quiz;
