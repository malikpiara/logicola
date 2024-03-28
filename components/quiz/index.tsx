"use client";
import React, { useEffect, useRef } from "react";

import Option from "../option";
import Prompt from "../prompt";
import useQuizState from "./useQuizState";

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

/* const pickRandExerciseNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min); */

const Quiz: React.FC<QuizProps> = ({
  initialQuestionIdx = 0,
  chapter = 3,
  showExerciseId = true,
}) => {
  const {
    questionIdx,
    selectedOptionId,
    showSolution,
    currentChapter,
    currentQuestion,
    questionCounter,

    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowSolution,
  } = useQuizState(chapter, initialQuestionIdx);

  // Creating refs to make each option focusable with the keyboard shorcuts.
  const activeOptionRef = useRef<HTMLButtonElement>(null);

  // Focus the active option when the selectedOptionId changes
  useEffect(() => {
    activeOptionRef.current?.focus();
  }, [selectedOptionId]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!currentQuestion) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        selectNextOption();
        break;
      case "ArrowUp":
        event.preventDefault();

        selectPreviousOption();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
        event.preventDefault();

        selectOption(parseInt(event.key) - 1);
        break;
    }
  };

  return (
    <div className="max-w-7xl p-6 bg-white border border-stone-200 rounded-lg mb-6">
      <div className="mx-auto w-full max-w-screen-xl p-4">
        {currentQuestion && ( // Ensure questions are loaded
          <div className="md:flex flex-col md:justify-between gap-5">
            <Prompt value={currentQuestion.prompt} />

            <h2 className="text-xl font-bold text-stone-800">
              What is wrong with this definition?
            </h2>

            {currentQuestion.options.map((option, index) => {
              return (
                <Option
                  index={option.id + 1}
                  isActive={option.id === selectedOptionId}
                  isCorrect={option.id === currentQuestion.correctId}
                  showSolution={showSolution}
                  ref={index === selectedOptionId ? activeOptionRef : undefined}
                  key={option.id}
                  label={option.label}
                  onClick={() => {
                    selectOption(option.id);
                  }}
                  onKeyDown={handleKeyDown}
                />
              );
            })}
          </div>
        )}
      </div>
      <hr className="h-px my-4 bg-stone-200 border-0" />
      {selectedOptionId != null && showSolution && (
        <div className="p-2 mb-3 text-stone-800">
          {/* You selected option {selectedOptionId + 1}. The correct answer is{' '}
          {Array.isArray(currentQuestion?.correctId)
            ? currentQuestion.correctId.map((id) => id + 1).join(', ')
            : currentQuestion!.correctId + 1}
          . */}
          {currentQuestion.answer ? (
            <h1>{currentQuestion.answer}</h1>
          ) : (
            <h1>Answer unavailable</h1>
          )}
        </div>
      )}

      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex justify-end gap-5 items-center h-full align-bottom">
          <div className="flex">{questionCounter} / 10</div>
          <div className="flex h-max">
            {!showSolution && (
              <button
                type="button"
                disabled={selectedOptionId == null}
                onClick={onShowSolution}
                className={`text-white font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${
                  selectedOptionId == null
                    ? " bg-stone-200 cursor-not-allowed"
                    : "bg-primary hover:opacity-90"
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
                  type="button"
                  className={`text-primary rounded-lg text-sm font-semibold px-5 py-2.5 me-2 mb-2 border border-primary hover:opacity-90`}
                >
                  Next Question
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
