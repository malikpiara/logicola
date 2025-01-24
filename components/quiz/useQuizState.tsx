import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { SubSet, Question } from '@/content/types';

/** Helper to shuffle array in-place using Fisher-Yates */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function useQuizState(subSet: SubSet) {
  // Index of the current question in the shuffled order
  const [questionIdx, setQuestionIdx] = useState(0);

  // Which option the user has currently selected (by index)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

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

  // We'll also keep a separate copy of our questions (with possibly shuffled options)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // On subSet change, we re-generate question order and optionally shuffle the options
  useEffect(() => {
    // 1) Shuffle which questions appear in which order
    const newOrder = generateQuestionOrder();
    setQuestionOrder(newOrder);

    // 2) Make a shallow copy of each question so we don’t mutate subSet directly
    const deepCopy: Question[] = subSet.questions.map((q) => ({
      ...q,
      options: [...q.options], // copy the options array
    }));

    // 3) Only shuffle the OPTIONS if subSet.shuffleOptions === true
    if (subSet.shuffleOptions) {
      deepCopy.forEach((question) => {
        shuffleArray(question.options);
      });
    }

    setShuffledQuestions(deepCopy);

    // 4) Reset all quiz states
    setQuestionIdx(0);
    setSelectedOptionIndex(null);
    setShowSolution(false);
    setShowStartScreen(true);
    setShowEndScreen(false);
    setQuestionCounter(1);
    setCorrectQuestions([]);
    setPreviousGuesses([]);
  }, [subSet]);

  // currentQuestion is whichever question is at questionOrder[questionIdx]
  // but we read from shuffledQuestions now, because it may have shuffled options
  const currentQuestion = shuffledQuestions[questionOrder[questionIdx]];

  /**
   * Move to next question or show the end screen if we’re done
   */
  function handleNextQuestion() {
    // If not at last question yet
    if (questionIdx < subSet.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionIndex(null);
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
    setSelectedOptionIndex((prev) => {
      if (prev == null) return 0;
      return Math.min(prev + 1, lastOptionIndex);
    });
  }

  /**
   * Keyboard/arrow navigation: move selection up
   */
  function selectPreviousOption() {
    if (!currentQuestion) return;
    setSelectedOptionIndex((prev) => {
      if (prev == null) return 0;
      return Math.max(prev - 1, 0);
    });
  }

  /**
   * Manual selection (click)
   */
  function selectOption(index: number) {
    setSelectedOptionIndex(index);
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
    if (selectedOptionIndex == null || !currentQuestion) return;

    // Retrieve the chosen option object
    const chosenOption = currentQuestion.options[selectedOptionIndex];

    // Use the helper function to see if the chosen option is correct
    if (isAnswerCorrect(chosenOption.id, currentQuestion.correctId)) {
      if (previousGuesses.length === 0) {
        setCorrectQuestions((prev) => [...prev, currentQuestion.id]);
      }
      setShowSolution(true);
    } else {
      // Mark the guess as wrong & let them keep trying
      setPreviousGuesses((prev) => [...prev, chosenOption.id]);
      setSelectedOptionIndex(null);

      // If the user has guessed all but one possible option, reveal solution
      if (previousGuesses.length + 1 === currentQuestion.options.length - 1) {
        setShowSolution(true);
      }
    }
  }

  /**
   * Transition from "start screen" to first question
   */
  function onShowStartScreen() {
    posthog.capture('quiz_started', {
      title: subSet.title,
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
    selectedOptionIndex,
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
