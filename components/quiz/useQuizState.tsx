// components/quiz/useQuizState.tsx

import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { SubSet } from '@/content/types';

export default function useQuizState(subSet: SubSet) {
  // Index of the current question in the shuffled order
  const [questionIdx, setQuestionIdx] = useState(0);

  // Which option the user has currently selected (by index)
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  // Do we show the correct answer?
  const [showSolution, setShowSolution] = useState(false);

  // Has the user seen the quiz start screen yet?
  const [showStartScreen, setShowStartScreen] = useState(true);

  // Has the user finished all questions (end screen)?
  const [showEndScreen, setShowEndScreen] = useState(false);

  // 1-based counter: e.g. “2 of 10”
  const [questionCounter, setQuestionCounter] = useState<number>(1);

  // Track the IDs of questions answered correctly (for scoring).
  const [correctQuestions, setCorrectQuestions] = useState<string[]>([]);

  // Track any incorrect guesses (option IDs) for the current question.
  const [previousGuesses, setPreviousGuesses] = useState<number[]>([]);

  /**
   * We create a random order of question indices based on subSet.questions.length.
   * Then the quiz will proceed in that shuffled order.
   */
  const generateQuestionOrder = () => {
    // Create an array [0, 1, 2, ..., n-1]
    const questionIndices = Array.from(
      { length: subSet.questions.length },
      (_, i) => i
    );
    // Use Fisher-Yates shuffle
    for (let i = questionIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionIndices[i], questionIndices[j]] = [
        questionIndices[j],
        questionIndices[i],
      ];
    }
    return questionIndices;
  };

  // Keep the random order in state, initialized once
  const [questionOrder, setQuestionOrder] = useState<number[]>(() =>
    generateQuestionOrder()
  );

  // If subSet changes, re-generate the random order
  useEffect(() => {
    setQuestionOrder(generateQuestionOrder());
    setQuestionIdx(0);
    setSelectedOptionId(null);
    setShowSolution(false);
    setShowStartScreen(true);
    setShowEndScreen(false);
    setQuestionCounter(1);
    setCorrectQuestions([]);
    setPreviousGuesses([]);
  }, [subSet]);

  // currentQuestion is whichever question is at questionOrder[questionIdx]
  const currentQuestion = subSet.questions[questionOrder[questionIdx]];

  /**
   * Move to next question or show the end screen if we’re done
   */
  function handleNextQuestion() {
    // If not at last question yet
    if (questionIdx < subSet.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionId(null);
      setPreviousGuesses([]);
      setShowSolution(false);
      setQuestionCounter(questionCounter + 1);
    }
    if (questionCounter > 9) {
      // If the user does more than 10 questions, exit the program.
      onShowEndScreen();
    }
  }

  /**
   * Keyboard/arrow navigation: move selection down
   */
  function selectNextOption() {
    if (!currentQuestion) return;
    const lastOptionIndex = currentQuestion.options.length - 1;
    setSelectedOptionId((prevId) => {
      if (prevId == null) return 0;
      return Math.min(prevId + 1, lastOptionIndex);
    });
  }

  /**
   * Keyboard/arrow navigation: move selection up
   */
  function selectPreviousOption() {
    if (!currentQuestion) return;
    setSelectedOptionId((prevId) => {
      if (prevId == null) return 0;
      return Math.max(prevId - 1, 0);
    });
  }

  /**
   * Manual selection (click)
   */
  function selectOption(optionId: number) {
    setSelectedOptionId(optionId);
  }

  /**
   * Reveal the correct answer
   */
  function onShowSolution() {
    setShowSolution(true);
  }

  /**
   * Check if the selected option is correct
   */
  function isAnswerCorrect(optionId: number, correctId: number[]) {
    return correctId.includes(optionId);
  }

  /**
   * The user pressed "Check Answer"
   */
  function onCheckAnswer() {
    if (selectedOptionId == null || !currentQuestion) return;

    if (isAnswerCorrect(selectedOptionId, currentQuestion.correctId)) {
      // Only count as correct if first attempt
      if (previousGuesses.length === 0) {
        setCorrectQuestions((prev) => [...prev, currentQuestion.id]);
      }
      onShowSolution();
    } else {
      // Mark the guess as wrong & let them keep trying
      setPreviousGuesses((prev) => [...prev, selectedOptionId]);
      setSelectedOptionId(null);

      // If the user has guessed all but one possible option, reveal solution
      if (previousGuesses.length + 1 === currentQuestion.options.length - 1) {
        onShowSolution();
      }
    }
  }

  /**
   * Transition from "start screen" to first question
   */
  function onShowStartScreen() {
    posthog.capture('quiz_started', {
      subSet: subSet.title,
    });
    setShowStartScreen(false);
  }

  /**
   * Final screen / user has finished all questions
   */
  function onShowEndScreen() {
    posthog.capture('quiz_completed', {
      subSet: subSet.title,
      correctQuestionsCount: correctQuestions.length,
      scorePercentage:
        (correctQuestions.length / subSet.questions.length) * 100,
    });
    setShowEndScreen(true);
  }

  return {
    // UI booleans
    showStartScreen,
    showEndScreen,
    showSolution,

    // Indices & counters
    questionIdx,
    questionCounter,

    // Current question
    currentQuestion,

    // Selection & correctness
    selectedOptionId,
    correctQuestions,
    previousGuesses,

    // Shuffle order for debugging if you like
    questionOrder,

    // Methods
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowSolution,
    onCheckAnswer,
    onShowStartScreen,
    onShowEndScreen,
  };
}
