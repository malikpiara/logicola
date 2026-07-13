import { useRef, useState } from 'react';
import { SubSet, Question } from '@/content/types';
import { AnalyticsProperties, captureAnalyticsEvent } from '@/lib/analytics';

const QUIZ_QUESTION_LIMIT = 10;

/** Helper to shuffle array in-place using Fisher-Yates */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateQuestionOrder(questionCount: number) {
  const questionIndices = Array.from({ length: questionCount }, (_, i) => i);

  for (let i = questionIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionIndices[i], questionIndices[j]] = [
      questionIndices[j],
      questionIndices[i],
    ];
  }

  return questionIndices;
}

function buildShuffledQuestions(subSet: SubSet) {
  const deepCopy: Question[] = subSet.questions.map((question) => ({
    ...question,
    options: [...question.options],
  }));

  if (subSet.shuffleOptions) {
    deepCopy.forEach((question) => {
      shuffleArray(question.options);
    });
  }

  return deepCopy;
}

function buildQuizAnalyticsProperties(
  subSet: SubSet,
  totalQuestionCount: number
): AnalyticsProperties {
  return {
    quiz_id: subSet.id,
    quiz_title: subSet.title,
    quiz_name: subSet.name,
    quiz_logic_type: subSet.logicType,
    quiz_slug: subSet.slugs.join('/'),
    total_questions: totalQuestionCount,
  };
}

export default function useQuizState(subSet: SubSet) {
  const totalQuestionCount = Math.min(
    QUIZ_QUESTION_LIMIT,
    subSet.questions.length
  );
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

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

  // Keep the random order in state, initialized once
  const [questionOrder, setQuestionOrder] = useState<number[]>(() =>
    generateQuestionOrder(subSet.questions.length)
  );

  // We'll also keep a separate copy of our questions (with possibly shuffled options)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>(() =>
    buildShuffledQuestions(subSet)
  );

  // currentQuestion is whichever question is at questionOrder[questionIdx]
  // but we read from shuffledQuestions now, because it may have shuffled options
  const currentQuestion = shuffledQuestions[questionOrder[questionIdx]];

  /**
   * Move to next question or show the end screen if we’re done
   */
  function handleNextQuestion() {
    if (questionCounter >= totalQuestionCount) {
      onShowEndScreen();
      return;
    }

    if (questionIdx < subSet.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionIndex(null);
      setPreviousGuesses([]);
      setShowSolution(false);
      setQuestionCounter(questionCounter + 1);
      return;
    }

    onShowEndScreen();
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
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    void captureAnalyticsEvent('quiz_started', {
      title: subSet.title,
      ...buildQuizAnalyticsProperties(subSet, totalQuestionCount),
    });
    setShowStartScreen(false);
  }

  /**
   * Final screen / user has finished all questions
   */
  function onShowEndScreen() {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    void captureAnalyticsEvent('quiz_completed', {
      subSet: subSet.title,
      ...buildQuizAnalyticsProperties(subSet, totalQuestionCount),
      totalQuestions: totalQuestionCount,
      correctQuestionsCount: correctQuestions.length,
      scorePercentage: (correctQuestions.length / totalQuestionCount) * 100,
      correct_questions_count: correctQuestions.length,
      score_percentage: (correctQuestions.length / totalQuestionCount) * 100,
    });
    setShowEndScreen(true);
  }

  function onTryAgain() {
    void captureAnalyticsEvent('quiz_retried', {
      ...buildQuizAnalyticsProperties(subSet, totalQuestionCount),
      correct_questions_count: correctQuestions.length,
      score_percentage: (correctQuestions.length / totalQuestionCount) * 100,
      source: 'quiz_end_screen',
    });

    hasStartedRef.current = true;
    hasCompletedRef.current = false;
    setQuestionIdx(0);
    setSelectedOptionIndex(null);
    setShowSolution(false);
    setShowStartScreen(false);
    setShowEndScreen(false);
    setQuestionCounter(1);
    setCorrectQuestions([]);
    setPreviousGuesses([]);
    setQuestionOrder(generateQuestionOrder(subSet.questions.length));
    setShuffledQuestions(buildShuffledQuestions(subSet));
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
    onTryAgain,
  };
}
