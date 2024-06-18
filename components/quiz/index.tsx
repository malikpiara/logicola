'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import Button from '../button';
import Option from '../option';
import Prompt from '../prompt';
import KatexSpan from '../katexSpan';
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
          snapPoints={['180px', '460px', 1]}
          activeSnapPoint={snap}
          setActiveSnapPoint={setSnap}
        >
          <DrawerContent className='fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]'>
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

            <div className='flex flex-col justify-center gap-10 mx-4 md:mx-8 text-gray-500'>
              {(currentChapter.id === 1 && (
                <>
                  <div>
                    <h3 className='text-xl md:text-2xl font-semibold text-gray-800'>
                      What makes a well-formed formula (wff)?
                    </h3>

                    <p>{`A wff must have one of these eight forms (where other capitals can replace "A" and "B" and other small letters "c" and "d"):`}</p>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>All A is B</div>
                    <div>No A is B</div>
                    <div>Some A is B</div>
                    <div>Some A is not B</div>
                    <div>c is A</div>
                    <div>c is A</div>
                    <div>c is not A</div>
                    <div>c is not D</div>
                  </div>
                </>
              )) ||
                (currentChapter.id === 6 && (
                  <>
                    <h3 className='text-xl md:text-2xl font-semibold text-gray-800'>
                      What makes a well-formed formula (wff)?
                    </h3>
                    <p>
                      Use a pair of parentheses for each &quot;
                      <KatexSpan className='inline' text={'$ \\cdot $'} />
                      &quot; (AND), &quot;
                      <KatexSpan className='inline' text={'$ \\vee $'} />
                      &quot; (OR), &quot;
                      <KatexSpan className='inline' text={'$ \\rightarrow $'} />
                      &quot; (IF-THEN) and &quot;
                      <KatexSpan className='inline' text={'$ \\equiv $'} />
                      &quot; (IFF).{' '}
                    </p>
                    <p>Do not use any other parentheses.</p>
                  </>
                )) ||
                (currentChapter.id === 3 && (
                  <>
                    <h3 className='text-xl md:text-2xl font-semibold text-gray-800'>
                      What is a definition?
                    </h3>
                    <p>
                      A definition is a rule of paraphrase designed to explain
                      meaning. More precisely, a definition of a word or phrase
                      is a rule saying how to eliminate this word or phrase in
                      any sentence using it and produce a second sentence that
                      means the same thing – the purpose of this being to
                      explain or clarify the meaning of the word or phrase.
                    </p>
                    <p>
                      Definitions may be stipulative (specifying your own usage)
                      or lexical (explaining current usage). A good lexical
                      definition should allow us to &quot;paraphrase out&quot; a
                      term – to produce a second sentence that means the same
                      thing but doesn&apos;t use the defined term. A good
                      lexical definition should: be neither too broad nor too
                      narrow, avoid circularity and poorly understood terms,
                      match in vagueness the term defined, match, as far as
                      possible, the emotional tone (positive or negative or
                      neutral) of the term defined, and include only properties
                      essential to the term.
                    </p>
                  </>
                ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default Quiz;
