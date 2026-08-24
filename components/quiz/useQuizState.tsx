import { useRef, useState } from 'react';
import { SubSet, Question } from '@/content/types';
import { AnalyticsProperties, captureAnalyticsEvent } from '@/lib/analytics';
import { defaultModeForSet, type QuizMode } from './quizMode';
import {
  SCORING_OFF,
  SCORING_PROFILES,
  beginProblem,
  createScoreState,
  isComplete,
  profileForSet,
  registerCorrect,
  registerMiss,
  type ScoreState,
  type ScoringProfile,
} from '@/lib/scoring';

/**
 * Open a score state for a run. `count` mode has no economy to run, so it
 * takes the original program's own "scoring off" level rather than a bare 0 — and with
 * no scoring there is no deficit to floor either.
 */
function openScoreState(profile: ScoringProfile, mode: QuizMode): ScoreState {
  return mode.kind === 'score'
    ? createScoreState(profile, mode.level, mode.floor)
    : createScoreState(profile, SCORING_OFF);
}

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

/**
 * @param initialMode Present on a RETRY mount: the session skips the start
 *   screen and begins immediately in this mode. A retry is a remount, not a
 *   reset — the shell bumps the session's key and passes the chosen mode
 *   here, so every piece of state below re-initializes through its own
 *   initializer and none can be forgotten by an enumerated reset.
 */
export default function useQuizState(subSet: SubSet, initialMode?: QuizMode) {
  // The run's end condition. Chosen on the start screen, so it's state rather
  // than a prop — see ./quizMode. Scored wherever the set can score (the
  // release's only surfaced mode); count survives as the fallback.
  const [mode, setMode] = useState<QuizMode>(
    () => initialMode ?? defaultModeForSet(subSet.name)
  );

  // In `count` mode this is the denominator ("3 of 10"). In `score` mode there
  // ISN'T one — the run ends at 100 points, whenever that happens — so this
  // degrades to "how many questions were drawn", i.e. the ceiling before we
  // run out of supply rather than a target.
  const totalQuestionCount =
    mode.kind === 'count'
      ? Math.min(mode.total, subSet.questions.length)
      : subSet.questions.length;

  // Each set has its own economy — reward, penalty decay, and whether a
  // missed problem forfeits. Resolved from the set letter in `subSet.name`.
  // Sets whose original scoring hasn't been derived fall back to Set R's
  // ONLY so the hook has a shape to hold; `canScore()` gates whether the
  // scored run is ever offered for them, so this fallback is unreachable in
  // practice and must never become the excuse for shipping a wrong constant.
  const profile = profileForSet(subSet.name) ?? SCORING_PROFILES.R!;

  const [scoreState, setScoreState] = useState(() =>
    openScoreState(profile, mode)
  );

  const isMulti = !!subSet.multiSelect;
  // See selectOption: the corpus's largest accepted set is 3 (pinned by
  // setR.data.test.ts), so more than 3 picks is never a legitimate answer.
  const MAX_MULTI_PICKS = 3;
  // A retry mount is already "started": quiz_started belongs to the first
  // run only (the retry fired quiz_retried instead).
  const hasStartedRef = useRef(initialMode != null);
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

  // Has the user seen the quiz start screen yet? Retry mounts skip it.
  const [showStartScreen, setShowStartScreen] = useState(initialMode == null);

  // Has the user finished all questions (end screen)?
  const [showEndScreen, setShowEndScreen] = useState(false);

  // 1-based counter: e.g. “2 of 10”
  const [questionCounter, setQuestionCounter] = useState<number>(1);

  // Track the IDs of questions answered correctly (for scoring).
  const [correctQuestions, setCorrectQuestions] = useState<string[]>([]);

  // Track any incorrect guesses (option IDs) for the current question.
  const [previousGuesses, setPreviousGuesses] = useState<number[]>([]);

  // Keep the random order in state, initialized once per mount — a retry
  // remounts, which is what re-rolls it.
  const [questionOrder] = useState<number[]>(() =>
    generateQuestionOrder(subSet.questions.length)
  );

  // We'll also keep a separate copy of our questions (with possibly shuffled options)
  const [shuffledQuestions] = useState<Question[]>(() =>
    buildShuffledQuestions(subSet)
  );

  // currentQuestion is whichever question is at questionOrder[questionIdx]
  // but we read from shuffledQuestions now, because it may have shuffled options
  const currentQuestion = shuffledQuestions[questionOrder[questionIdx]];

  // Will the next advance end the run (end screen, not another question)?
  // The end condition is the whole difference between the two modes.
  // `count`: stop at the Nth question. `score`: stop at 100 points, however
  // many questions that takes — so we only run out when the drawn pool is
  // exhausted (a prototype limit; see components/quiz/generated/).
  // Exposed to the shell so the advance TRANSITION can branch on it (the
  // end screen makes its own entrance — pushing "the next question" in
  // would promise a question that isn't coming) without re-deriving run
  // progression in a component.
  const willFinishOnNext =
    (mode.kind === 'count'
      ? questionCounter >= totalQuestionCount
      : isComplete(scoreState)) || questionIdx >= subSet.questions.length - 1;

  /**
   * Move to next question or show the end screen if we’re done
   */
  function handleNextQuestion() {
    if (willFinishOnNext) {
      onShowEndScreen();
      return;
    }

    setQuestionIdx(questionIdx + 1);
    setSelectedOptionIndex(null);
    setSelectedOptionIds([]);
    setWrongAttempts(0);
    setPreviousGuesses([]);
    setShowSolution(false);
    setQuestionCounter(questionCounter + 1);
    // original program `*m`: q := level, r := 8 — re-arm both registers for the new
    // problem, so a miss never poisons the one after it.
    setScoreState(beginProblem);
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
    setSelectedOptionIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      // A pick already submitted and flagged wrong cannot be re-selected —
      // user testing found people re-picking ruled-out fallacies and
      // burning attempts. The click is not dead: the cursor still moves,
      // and the shell shows the flagged option's hint as a mid-attempt
      // review (Malik, 2026-08-21).
      if (previousGuesses.includes(id)) return prev;
      // Cap picks at the largest accepted set in the corpus (3). Two
      // reasons from Set R user testing (Malik, 2026-08-21): people
      // didn't know how many they could pick, and people picked ALL to
      // game the grader — a miss filters the selection down to exactly
      // the correct ids, so select-everything bought the answer for the
      // price of one miss. A fourth pick is simply refused; deselect one
      // to change your mind.
      if (prev.length >= MAX_MULTI_PICKS) return prev;
      return [...prev, id];
    });
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
   * Stable per-template analytics key. Generated ids ("gen.A.10.3")
   * drop the draw counter → "gen.A.10", so one template's answers
   * aggregate under one value; static ids (e.g. Set Q's "3.1") are
   * already stable and pass through unchanged.
   */
  function questionTemplateKey(questionId: string): string {
    return questionId.startsWith('gen.')
      ? questionId.split('.').slice(0, 3).join('.')
      : questionId;
  }

  /**
   * The user pressed "Check Answer".
   *
   * Multi-select uses the subset rule: correct when at least one option is
   * picked and every pick is one of `correctId` (i.e. only wrong for adding
   * a fallacy the passage doesn't commit). Single-select is unchanged.
   *
   * Returns the graded outcome so the shell can react to it (the first-miss
   * guide expansion) WITHOUT re-implementing these rules — this function is
   * the only grader. `undefined` means nothing was graded (no selection).
   */
  function onCheckAnswer(): 'correct' | 'miss' | undefined {
    if (!currentQuestion) return undefined;
    const { correctId } = currentQuestion;

    if (isMulti) {
      if (selectedOptionIds.length === 0) return undefined;
      const wrongPicks = selectedOptionIds.filter(
        (id) => !correctId.includes(id)
      );
      if (wrongPicks.length === 0) {
        if (wrongAttempts === 0) {
          setCorrectQuestions((prev) => [...prev, currentQuestion.id]);
        }
        // original program `ky:+$r` — awards 8 if clean, 0 if this problem was already
        // missed (r having been zeroed by registerMiss).
        setScoreState(registerCorrect);
        setShowSolution(true);
        return 'correct';
      }
      // Flag the wrong picks, keep the genuine ones for another try.
      setPreviousGuesses((prev) => [...prev, ...wrongPicks]);
      setSelectedOptionIds((prev) =>
        prev.filter((id) => correctId.includes(id))
      );
      // Clear the cursor like single-select does below. Leaving it on the
      // last-tapped wrong option meant a reveal-by-exhaustion put that
      // option "under review" — its hint hijacked the answer explanation
      // the reveal exists to show (Malik, 2026-08-19).
      setSelectedOptionIndex(null);
      // original program `*a k0<y:-2*$q` then `c0<y:q0`/`r0` — charges 2*level once, then
      // disarms. Safe to call on every miss; only the first one costs.
      setScoreState(registerMiss);
      registerWrongAttempt(currentQuestion);
      return 'miss';
    }

    if (selectedOptionIndex == null) return undefined;
    const chosenOption = currentQuestion.options[selectedOptionIndex];
    const correct = isAnswerCorrect(chosenOption.id, correctId);

    // One event per Check Answer press (so a question answered
    // wrong twice emits two events). `question_template` is the
    // per-template aggregation key; `option_label` records which
    // distractor pulled the miss — the pair that makes content
    // bugs (a distractor drawing correct-answer-level traffic)
    // visible in PostHog.
    void captureAnalyticsEvent('question_answered', {
      ...buildQuizAnalyticsProperties(subSet, totalQuestionCount),
      question_id: currentQuestion.id,
      question_template: questionTemplateKey(currentQuestion.id),
      question_prompt: currentQuestion.prompt,
      option_id: chosenOption.id,
      option_label: chosenOption.label,
      correct,
      guess_number: previousGuesses.length + 1,
      first_try: previousGuesses.length === 0,
    });

    if (correct) {
      if (wrongAttempts === 0) {
        setCorrectQuestions((prev) => [...prev, currentQuestion.id]);
      }
      setScoreState(registerCorrect);
      setShowSolution(true);
      return 'correct';
    }
    setPreviousGuesses((prev) => [...prev, chosenOption.id]);
    setSelectedOptionIndex(null);
    setScoreState(registerMiss);
    registerWrongAttempt(currentQuestion);
    return 'miss';
  }

  /**
   * Transition from "start screen" to first question
   */
  function onShowStartScreen(
    chosen: QuizMode = defaultModeForSet(subSet.name)
  ) {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    setMode(chosen);
    setScoreState(openScoreState(profile, chosen));
    void captureAnalyticsEvent('quiz_started', {
      ...buildQuizAnalyticsProperties(subSet, totalQuestionCount),
      // The graduation-rate measurement: what fraction of runs are scored,
      // and of those, what fraction reach 100.
      quiz_mode: chosen.kind,
      scoring_level: chosen.kind === 'score' ? chosen.level : null,
      // The floor's own measurement: completion rate under 'no-deeper' vs
      // the faithful 'none'. Runs recorded before 2026-08-12 have no such
      // property and were all 'none' — read them with
      // coalesce(properties.scoring_floor, 'none').
      scoring_floor: chosen.kind === 'score' ? chosen.floor : null,
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
    // snake_case only, matching every other event's properties. The old
    // camelCase duplicates (totalQuestions, correctQuestionsCount,
    // scorePercentage, subSet) were dropped 2026-08 — any PostHog
    // insight still reading those names needs re-pointing.
    void captureAnalyticsEvent('quiz_completed', {
      ...buildQuizAnalyticsProperties(subSet, totalQuestionCount),
      correct_questions_count: correctQuestions.length,
      questions_attempted: questionsAttempted(),
      score_percentage: runScorePercentage(),
    });
    setShowEndScreen(true);
  }

  /**
   * Problems actually resolved this run — the score denominator. A
   * scored run visits far fewer questions than the bank holds, so
   * dividing by `totalQuestionCount` called a flawless 20-problem run
   * on a 118-question bank 17% (fixed 2026-08-24; earlier
   * quiz_completed/quiz_retried rows carry the bank-relative number).
   * solvedClean/missed count each problem once, whatever the mode.
   */
  function questionsAttempted(): number {
    return scoreState.solvedClean + scoreState.missed;
  }

  function runScorePercentage(): number {
    const attempted = questionsAttempted();
    return attempted > 0 ? (correctQuestions.length / attempted) * 100 : 0;
  }

  /**
   * Record the retry. ONLY the analytics live here — the ending run's stats
   * are still in scope. The actual reset is the shell's job: it bumps the
   * session key and remounts with `initialMode = nextMode`, so the fresh
   * shuffle, score state and flags all come from the initializers above.
   */
  function captureRetry(nextMode: QuizMode = mode) {
    void captureAnalyticsEvent('quiz_retried', {
      ...buildQuizAnalyticsProperties(subSet, totalQuestionCount),
      correct_questions_count: correctQuestions.length,
      questions_attempted: questionsAttempted(),
      score_percentage: runScorePercentage(),
      source: 'quiz_end_screen',
      quiz_mode: nextMode.kind,
    });
  }

  return {
    // UI booleans
    showStartScreen,
    showEndScreen,
    showSolution,

    // Counter
    questionCounter,

    // Run shape + scoring
    mode,
    scoreState,

    // Current question
    currentQuestion,
    willFinishOnNext,

    // Selection & correctness
    selectedOptionIndex,
    selectedOptionIds,
    multiSelect: isMulti,
    correctQuestions,
    previousGuesses,

    // Methods
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    moveCursor,
    onCheckAnswer,
    onShowStartScreen,
    captureRetry,
  };
}
