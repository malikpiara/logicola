'use client';

import React, { useEffect, useRef, useState } from 'react';
import Button from '../button';
import Option from '../option';
import Prompt from '../prompt';
import { EndScreen } from './endScreen';
import { KeyboardKeys } from './keyboardKeys';
import { StartScreen } from './startScreen';
import useQuizState from './useQuizState';
import { SubSet } from '@/content/types';
import { Drawer, DrawerContent, DrawerHeader } from '@/components/ui/drawer';
import useKeyboardNavigation from './useKeyboardNavigation';
import { WffGuide } from './wffGuide';

export interface QuizProps {
  subSet: SubSet;
}

const Quiz: React.FC<QuizProps> = ({ subSet }) => {
  const {
    showStartScreen,
    showEndScreen,
    selectedOptionIndex,
    showSolution,
    currentQuestion,
    questionCounter,
    correctQuestions,
    onCheckAnswer,
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowStartScreen,
    previousGuesses,
  } = useQuizState(subSet);

  /**
   * 1) Keep track of the drawer snap state.
   *    Default to "180px" or whichever is your "collapsed" height.
   */
  const [snap, setSnap] = useState<string | number | null>('180px');

  /**
   * 2) We'll keep a ref to the DrawerContent (or the <Drawer> itself).
   *    Then we'll detect clicks outside of this container.
   */
  const drawerRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation({
    currentQuestion,
    showStartScreen,
    showSolution,
    selectedOptionIndex,
    onShowStartScreen,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    handleCheckAnswer,
    handleNextQuestion,
  });

  function handleCheckAnswer() {
    onCheckAnswer();
  }

  // Creating ref to make each option focusable with keyboard shortcuts
  const activeOptionRef = useRef<HTMLButtonElement>(null);

  // Focus the active option when selectedOptionIndex changes
  useEffect(() => {
    activeOptionRef.current?.focus();
  }, [selectedOptionIndex]);

  /**
   * 3) Watch for clicks on the entire document. If the user clicked
   *    outside our DrawerContent, set the snap back to "180px".
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        // If the drawer is currently snapped open beyond 180px, snap back
        // (Or you can just always set to 180px unconditionally.)
        setSnap('180px');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {showStartScreen ? (
        <StartScreen onStartQuiz={onShowStartScreen} />
      ) : showEndScreen ? (
        <EndScreen numOfCorrectQuestions={correctQuestions.length} />
      ) : (
        <div className='animate-in max-w-7xl p-0 md:p-6 bg-white md:border border-gray-200 rounded-lg mb-6 m-auto'>
          <div className='mx-auto w-full max-w-screen-xl p-4'>
            {currentQuestion && (
              <div className='flex flex-col md:justify-between gap-5 max-sm:flex'>
                <Prompt value={currentQuestion.prompt} />

                <h2 className='text-xl font-bold text-gray-800'>
                  {subSet.header}
                </h2>

                {currentQuestion.options.map((option, index) => (
                  <>
                    <Option
                      key={option.id}
                      index={index + 1}
                      showIndex
                      isSelected={index === selectedOptionIndex}
                      isCorrect={currentQuestion.correctId.includes(option.id)}
                      showSolution={showSolution}
                      ref={
                        index === selectedOptionIndex
                          ? activeOptionRef
                          : undefined
                      }
                      hasBeenIncorrectlyGuessed={previousGuesses.includes(
                        option.id
                      )}
                      label={option.label}
                      onClick={() => {
                        selectOption(index);
                        onShowStartScreen();
                      }}
                    />
                  </>
                ))}
              </div>
            )}
          </div>
          <hr className='h-px my-4 bg-gray-200 border-0' />
          {selectedOptionIndex != null && showSolution && (
            <div className='p-2 mb-3 text-gray-800'>
              <h1>{currentQuestion.answer}</h1>
              <h1 className='text-lg text-red-600'>
                {currentQuestion.options[selectedOptionIndex].hint}
              </h1>
            </div>
          )}
        </div>
      )}

      {/** If we're not on start/end screen, show the Drawer */}
      {!showStartScreen && !showEndScreen && (
        <Drawer
          /**
           *  We keep the drawer always open by setting `open` to true.
           *  "modal={false}" so it won't be over the entire screen as a modal.
           */
          open
          onOpenChange={() => {}} // No action needed since it's always open
          dismissible={false}
          modal={false}
          snapPoints={['180px', '460px', 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={(value) => setSnap(value)}
        >
          <DrawerContent
            ref={drawerRef}
            className='fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]'
          >
            <DrawerHeader>
              <div className='left-0 z-50 w-full h-24 bg-white flex items-center justify-center md:justify-between'>
                <div className='ml-0 md:ml-5'>
                  {!showStartScreen && !showEndScreen && <KeyboardKeys />}
                </div>
                <div className='flex justify-between gap-5 items-center h-full align-bottom text-gray-800 font-medium flex-col md:flex-row w-full md:w-fit'>
                  {!showStartScreen && !showEndScreen && (
                    <div className='flex'>{questionCounter} of 10</div>
                  )}
                  <div className='flex h-max w-full md:w-fit'>
                    {!showSolution && !showStartScreen && !showEndScreen && (
                      <Button
                        label='Check Answer'
                        disabled={selectedOptionIndex == null}
                        onClick={handleCheckAnswer}
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

            <div className='flex flex-col justify-center gap-10 mx-4 md:mx-8 text-gray-500'>
              <WffGuide subSet={subSet} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default Quiz;
