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

/**
 * How many wrong guesses reveal the solution. Classic behavior is
 * "all options but one exhausted"; subsets with many options (Set R's
 * 18) opt into a saner cap via `subSet.maxWrongGuesses`. Shared by
 * `onCheckAnswer` and the quiz shell's first-miss guide expansion so
 * the two call sites can't drift.
 */
export function getRevealThreshold(subSet: SubSet, question: Question): number {
  const exhaustive = question.options.length - 1;
  return Math.min(exhaustive, subSet.maxWrongGuesses ?? exhaustive);
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
  const isMulti = !!subSet.multiSelect;
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  // Index of the current question in the shuffled order
  const [questionIdx, setQuestionIdx] = useState(0);

  // Single-select: the chosen option. Multi-select: the keyboard/focus
  // cursor (the committed picks live in `selectedOptionIds`).
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );

  // Multi-select: option IDs the user has toggled on for this question.
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);

  // Wrong submissions for this question. In single-select this equals
  // previousGuesses.length; in multi-select one submission can flag
  // several wrong picks at once, so the reveal budget counts attempts.
  const [wrongAttempts, setWrongAttempts] = useState(0);

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
      setSelectedOptionIds([]);
      setWrongAttempts(0);
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
   * Manual selection (click / tap / typed abbreviation). In multi-select
   * this toggles the option's membership while moving the focus cursor;
   * in single-select it just sets the chosen option.
   */
  function selectOption(index: number) {
    setSelectedOptionIndex(index);
    if (!isMulti) return;
    const id = currentQuestion?.options[index]?.id;
    if (id == null) return;
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  /**
   * Move the keyboard/focus cursor without committing a selection. In
   * single-select the cursor IS the selection, so this reads as a plain
   * highlight; in multi-select arrow keys move the cursor and Space
   * toggles the option under it.
   */
  function moveCursor(index: number) {
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

  /** Record a wrong submission and reveal the answer once the budget is spent. */
  function registerWrongAttempt(question: Question) {
    const attempts = wrongAttempts + 1;
    setWrongAttempts(attempts);
    if (attempts >= getRevealThreshold(subSet, question)) {
      setShowSolution(true);
    }
  }

  /**
   * The user pressed "Check Answer".
   *
   * Multi-select uses the subset rule: correct when at least one option is
   * picked and every pick is one of `correctId` (i.e. only wrong for adding
   * a fallacy the passage doesn't commit). Single-select is unchanged.
   */
  function onCheckAnswer() {
    if (!currentQuestion) return;
    const { correctId } = currentQuestion;

    if (isMulti) {
      if (selectedOptionIds.length === 0) return;
      const wrongPicks = selectedOptionIds.filter(
        (id) => !correctId.includes(id)
      );
      if (wrongPicks.length === 0) {
        if (wrongAttempts === 0) {
          setCorrectQuestions((prev) => [...prev, currentQuestion.id]);
        }
        setShowSolution(true);
      } else {
        // Flag the wrong picks, keep the genuine ones for another try.
        setPreviousGuesses((prev) => [...prev, ...wrongPicks]);
        setSelectedOptionIds((prev) =>
          prev.filter((id) => correctId.includes(id))
        );
        registerWrongAttempt(currentQuestion);
      }
      return;
    }

    if (selectedOptionIndex == null) return;
    const chosenOption = currentQuestion.options[selectedOptionIndex];
    if (isAnswerCorrect(chosenOption.id, correctId)) {
      if (wrongAttempts === 0) {
        setCorrectQuestions((prev) => [...prev, currentQuestion.id]);
      }
      setShowSolution(true);
    } else {
      setPreviousGuesses((prev) => [...prev, chosenOption.id]);
      setSelectedOptionIndex(null);
      registerWrongAttempt(currentQuestion);
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
    setSelectedOptionIds([]);
    setWrongAttempts(0);
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
    selectedOptionIds,
    multiSelect: isMulti,
    correctQuestions,
    previousGuesses,

    // Shuffle order for debugging if you like
    questionOrder,

    // Methods
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    moveCursor,
    onShowSolution,
    onCheckAnswer,
    onShowStartScreen,
    onShowEndScreen,
    onTryAgain,
  };
}
