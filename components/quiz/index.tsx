'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PanelRightClose, PanelRightOpen, X } from 'lucide-react';
import Button from '../button';
import Option from '../option';
import Prompt from '../prompt';
import { EndScreen } from './endScreen';
import { KeyboardKeys } from './keyboardKeys';
import { StartScreen } from './startScreen';
import useQuizState, { getRevealThreshold } from './useQuizState';
import { progressLabel } from './quizMode';
import { canScore, TARGET_SCORE } from '@/lib/scoring';
import classNames from 'classnames';
import { SubSet } from '@/content/types';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import useKeyboardNavigation from './useKeyboardNavigation';
import { FeedbackText } from './feedbackText';
import { hasWffGuide, WffGuide } from './wffGuide';

export interface QuizProps {
  subSet: SubSet;
}

export default function Quiz({ subSet }: QuizProps) {
  return <QuizSession key={subSet.id} subSet={subSet} />;
}

const QUESTION_EXIT_MS = 90;
const MEANINGS_AND_DEFINITIONS_SUBSET_ID = 3;

// Sets with more options than this earn a third column on desktop
// (Set R's 18); smaller multi-option sets (Set Q's 7) stay at two.
const GRID_THIRD_COLUMN_MIN = 13;

// Static row-count classes so Tailwind's scanner can see them — the grid
// is column-major, so rows = ceil(count / columns).
const GRID_ROW_CLASS: Record<number, string> = {
  1: 'grid-rows-1',
  2: 'grid-rows-2',
  3: 'grid-rows-3',
  4: 'grid-rows-4',
  5: 'grid-rows-5',
  6: 'grid-rows-6',
};

/**
 * Column-major answer-grid classes sized to the option count. Large
 * taxonomies (Set R) get a third desktop column; smaller sets (Set Q)
 * stay two columns at every width.
 */
function optionGridColumnClasses(optionCount: number): string {
  if (optionCount >= GRID_THIRD_COLUMN_MIN) {
    return 'grid grid-flow-col grid-cols-2 grid-rows-9 lg:grid-cols-3 lg:grid-rows-6';
  }
  const rows = GRID_ROW_CLASS[Math.ceil(optionCount / 2)] ?? 'grid-rows-6';
  return `grid grid-flow-col grid-cols-2 ${rows}`;
}

/**
 * Approximate vertical space occupied by the drawer's grabber +
 * `DrawerHeader` (`KeyboardKeys`, counter, action button) at the
 * top of `DrawerContent`. Used to size the scrollable guide
 * container so `overflow-y-auto` engages when the visible drawer
 * height (per active snap point) can't fit the guide content.
 */
const DRAWER_HEADER_OFFSET_PX = 144;

type SnapValue = string | number;

const COLLAPSED_SNAP_POINT = '180px';
const GUIDE_SNAP_POINTS: readonly SnapValue[] = [
  COLLAPSED_SNAP_POINT,
  '460px',
  1,
];
const NO_GUIDE_SNAP_POINTS: readonly SnapValue[] = [COLLAPSED_SNAP_POINT];
const DRAWER_INITIAL_TRANSFORM = `calc(100dvh - ${COLLAPSED_SNAP_POINT})`;

/**
 * Cycle the drawer's snap forward (collapsed → medium → full → …).
 * Used by the grabber's `onGrabberClick` handler so users can tap
 * the grabber to progressively expand the drawer.
 */
function nextSnapPoint(
  current: SnapValue | null,
  points: readonly SnapValue[]
): SnapValue {
  if (points.length === 0) return '180px';
  if (points.length === 1) return points[0]!;
  const idx = current == null ? -1 : points.indexOf(current);
  const nextIdx = idx >= points.length - 1 || idx === -1 ? 0 : idx + 1;
  return points[nextIdx]!;
}

/**
 * Translate the active vaul snap point into a CSS `max-height` for
 * the scrollable guide region. vaul controls visible drawer height
 * via transform — the DOM is always full-height — so without
 * binding the inner container we'd never see a scrollbar at
 * partial snaps even when content overflows the visible area.
 */
function guideContentMaxHeight(snap: string | number | null): string {
  if (snap == null || snap === 1) {
    return `calc(97vh - ${DRAWER_HEADER_OFFSET_PX}px)`;
  }
  if (typeof snap === 'number') {
    return `calc(${snap * 100}vh - ${DRAWER_HEADER_OFFSET_PX}px)`;
  }
  if (snap.endsWith('px')) {
    const px = parseInt(snap, 10);
    return `${Math.max(px - DRAWER_HEADER_OFFSET_PX, 100)}px`;
  }
  return `calc(97vh - ${DRAWER_HEADER_OFFSET_PX}px)`;
}
const SET_A_NAME = 'Set A';
const SET_C_NAME = 'Set C';
const SET_J_NAME = 'Set J';
const SET_L_NAME = 'Set L';
const SET_N_NAME = 'Set N';
const SET_R_NAME = 'Set R';

function getQuizScreenColors(subSet: SubSet) {
  if (subSet.name === SET_A_NAME) {
    return {
      surfaceColor: '#1C3601',
      countColor: '#F233DF',
    };
  }

  if (subSet.name === SET_C_NAME) {
    return {
      surfaceColor: '#E7F099',
      countColor: '#02302C',
      foregroundColor: '#02302C',
    };
  }

  if (subSet.name === SET_J_NAME) {
    return {
      surfaceColor: '#E6ACF4',
      countColor: '#1C3601',
      foregroundColor: '#1C3601',
    };
  }

  if (subSet.name === SET_L_NAME) {
    return {
      surfaceColor: '#C8F0E3',
      countColor: '#3C034F',
      foregroundColor: '#3C034F',
    };
  }

  if (subSet.name === SET_N_NAME) {
    return {
      surfaceColor: '#ADE2E9',
      countColor: '#1F0D92',
      foregroundColor: '#2A0D73',
    };
  }

  if (subSet.name === SET_R_NAME) {
    // Orange surface in the same pastel register as Sets C/J: the default
    // screen's #FDBA74 accent rebalanced to their chroma and lightness
    // (HSL 31° 75% 80%). Text is an ink-dark indigo: saturated blue on
    // saturated orange vibrates (complementary hues), so the blue is pushed
    // near-black; the brighter Set N indigo survives as the small accent.
    return {
      surfaceColor: '#F2CDA6',
      countColor: '#1F0D92',
      foregroundColor: '#190B45',
    };
  }

  if (subSet.id === MEANINGS_AND_DEFINITIONS_SUBSET_ID) {
    return {
      surfaceColor: '#6C2E99',
      countColor: '#C2E5B6',
    };
  }

  return {};
}

const QuizSession: React.FC<QuizProps> = ({ subSet }) => {
  const {
    showStartScreen,
    showEndScreen,
    selectedOptionIndex,
    selectedOptionIds,
    multiSelect,
    showSolution,
    currentQuestion,
    questionCounter,
    correctQuestions,
    onCheckAnswer,
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    moveCursor,
    onShowStartScreen,
    previousGuesses,
    onTryAgain,
    mode,
    scoreState,
  } = useQuizState(subSet);
  // Offered wherever the original's scoring has actually been derived from
  // that set's own DSL — today A/C/J/L/N (+5, halving penalty), Q (+7, flat)
  // and R (+8, charged once, forfeits). Every published set is covered. The
  // unpublished ones aren't: B/D/E/F/P are bespoke and the proofs sets
  // (G/I/K/M/O) have no reward directive at all, so `canScore` returns false
  // for them rather than lending them Set R's numbers.
  const offerScoredRun = canScore(subSet.name);
  const hasGuide = hasWffGuide(subSet);
  const isGridLayout = subSet.optionLayout === 'grid';
  const optionCount = currentQuestion?.options.length ?? 0;
  // Narrower cap for two-column sets so the options aren't full-bleed;
  // the header shares this width so their left edges line up.
  const gridMaxWidth =
    optionCount >= GRID_THIRD_COLUMN_MIN ? 'max-w-4xl' : 'max-w-2xl';
  const quizScreenColors = getQuizScreenColors(subSet);
  // The question screen inherits the set's start-screen palette (same
  // fallbacks as StartScreen's prop defaults), so start screen → quiz reads
  // as one continuous colored surface instead of a colored cover page
  // opening onto a white form.
  const quizSurface = quizScreenColors.surfaceColor ?? '#431407';
  const quizForeground = quizScreenColors.foregroundColor ?? '#ffffff';
  const quizAccent = quizScreenColors.countColor ?? '#fdba74';

  /**
   * 1) Keep track of the drawer snap state.
   *    Default to "180px" or whichever is your "collapsed" height.
   */
  const [snap, setSnap] = useState<string | number | null>(
    COLLAPSED_SNAP_POINT
  );
  const isGuideExpanded = hasGuide && snap !== COLLAPSED_SNAP_POINT;
  // Top progress bar. Count mode fills a tenth per completed question (a
  // question counts once its solution is shown); scored mode tracks distance
  // to the 100-point target, which is the honest reading of a run with no
  // fixed length.
  const progressFraction =
    mode.kind === 'count'
      ? Math.min((questionCounter - (showSolution ? 0 : 1)) / mode.total, 1)
      : Math.min(scoreState.score / TARGET_SCORE, 1);
  // Desktop-only: the reference guide is the same vaul sheet as on mobile,
  // repositioned to the right edge (direction='right'), toggleable and closed
  // by default. On mobile the guide still lives in the bottom sheet's snap
  // points (below) — this state is inert there because the only trigger is
  // `lg:`-gated, and the resize listener below force-closes it under `lg`.
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  // The desktop analogue of the mobile sheet's snap-drag: instead of discrete
  // height snap points, the right sheet resizes continuously by dragging its
  // left-edge grip.
  const [paneWidth, setPaneWidth] = useState(432);
  const [isPaneResizing, setIsPaneResizing] = useState(false);
  const [isQuestionLeaving, setIsQuestionLeaving] = useState(false);
  const isQuestionLeavingRef = useRef(false);
  const hasExpandedGuideAfterMissRef = useRef(false);
  const questionExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /**
   * 2) We'll keep a ref to the DrawerContent (or the <Drawer> itself).
   *    Then we'll detect clicks outside of this container.
   */
  const drawerRef = useRef<HTMLDivElement>(null);
  const optionsGridRef = useRef<HTMLDivElement>(null);

  useKeyboardNavigation({
    currentQuestion,
    showStartScreen,
    showSolution,
    selectedOptionIndex,
    onShowStartScreen,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    moveCursor,
    handleCheckAnswer,
    handleNextQuestion: handleNextQuestionTransition,
    collapseDrawer: () => {
      setSnap(COLLAPSED_SNAP_POINT);
      setIsGuideOpen(false);
    },
    multiSelect,
    // 2D arrow navigation for the fallacy grid — reads the rendered
    // column count so Left/Right stay correct across breakpoints.
    getGridColumns: isGridLayout
      ? () => {
          const grid = optionsGridRef.current;
          if (!grid) return 1;
          return getComputedStyle(grid)
            .gridTemplateColumns.split(' ')
            .filter(Boolean).length;
        }
      : undefined,
  });

  const selectedHint =
    selectedOptionIndex != null && currentQuestion
      ? currentQuestion.options[selectedOptionIndex]?.hint
      : undefined;

  // After a wrong "Check Answer" submission, `useQuizState` clears
  // `selectedOptionIndex` (so the user can pick another option). We
  // still want to surface that wrong option's hint immediately —
  // hence we look up the most-recent wrong guess from
  // `previousGuesses`. The hint we display depends on the phase:
  //
  //   1. Mid-attempt (showSolution=false): show the hint for the
  //      most recent wrong submission.
  //   2. Review mode after a correct answer (showSolution=true,
  //      selectedOptionIndex points at an option): show that
  //      option's hint so the user can click around wrong options
  //      to see each explanation.
  //   3. Solution reached via exhausted attempts (showSolution=
  //      true, selectedOptionIndex=null because the 3rd wrong
  //      submission nulled it): fall back to the last wrong
  //      submission's hint — otherwise the hint for the user's
  //      final guess would disappear at exactly the moment the
  //      correct answer is revealed.
  const lastWrongGuessId =
    previousGuesses.length > 0
      ? previousGuesses[previousGuesses.length - 1]
      : undefined;
  const lastWrongHint =
    lastWrongGuessId !== undefined && currentQuestion
      ? currentQuestion.options.find((o) => o.id === lastWrongGuessId)?.hint
      : undefined;
  const displayedHint = !showSolution
    ? lastWrongHint
    : selectedOptionIndex != null
      ? selectedHint
      : lastWrongHint;
  const hasRevealedAnswer = showSolution && !!currentQuestion?.answer;

  /**
   * Which option (if any) carries `displayedHint` inline, attached under
   * its own pill — same phase logic as `displayedHint`, resolved to an
   * option instead of a detached block at the bottom of the card. Grid
   * sets return undefined for every option: an expanding cell would break
   * the column-major grid, so they keep the bottom placement (their hints
   * also self-identify by fallacy name, which softens the distance).
   */
  function inlineHintFor(
    option: { id: number; hint?: string },
    index: number
  ): string | undefined {
    if (isGridLayout || !option.hint) return undefined;
    if (!showSolution) {
      return option.id === lastWrongGuessId ? option.hint : undefined;
    }
    if (selectedOptionIndex != null) {
      return index === selectedOptionIndex ? option.hint : undefined;
    }
    return option.id === lastWrongGuessId ? option.hint : undefined;
  }

  function expandGuideForFirstMiss() {
    if (!hasGuide) return;
    if (!currentQuestion) return;
    if (hasExpandedGuideAfterMissRef.current) return;

    hasExpandedGuideAfterMissRef.current = true;
    setSnap('460px');
  }

  function handleCheckAnswer() {
    if (currentQuestion && previousGuesses.length === 0) {
      const { correctId } = currentQuestion;
      const willMiss = multiSelect
        ? selectedOptionIds.length > 0 &&
          selectedOptionIds.some((id) => !correctId.includes(id))
        : selectedOptionIndex != null &&
          !correctId.includes(currentQuestion.options[selectedOptionIndex].id);

      if (willMiss && 1 < getRevealThreshold(subSet, currentQuestion)) {
        expandGuideForFirstMiss();
      }
    }

    onCheckAnswer();
  }

  function handleNextQuestionTransition() {
    if (isQuestionLeavingRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleNextQuestion();
      return;
    }

    isQuestionLeavingRef.current = true;
    setIsQuestionLeaving(true);
    questionExitTimeoutRef.current = setTimeout(() => {
      handleNextQuestion();
      isQuestionLeavingRef.current = false;
      setIsQuestionLeaving(false);
      questionExitTimeoutRef.current = null;
    }, QUESTION_EXIT_MS);
  }

  function focusSelectedOption(node: HTMLButtonElement | null) {
    node?.focus();
  }

  /**
   * Continuous width-resize for the desktop guide sheet — pointer-drag on
   * its left-edge grip. Listeners go on `window` so the drag keeps tracking
   * when the cursor outruns the 16px handle mid-gesture.
   */
  function startPaneResize(event: React.PointerEvent) {
    event.preventDefault();
    // The grip is our control, not vaul's: without this, the pointerdown
    // bubbles into vaul's drag tracking, which wedges its close animation
    // (the sheet then stays visible in data-state='closed').
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = paneWidth;
    setIsPaneResizing(true);
    document.body.style.userSelect = 'none';

    function onPointerMove(moveEvent: PointerEvent) {
      const width = Math.min(
        720,
        Math.max(384, startWidth + (startX - moveEvent.clientX))
      );
      setPaneWidth(width);
    }

    function onPointerUp() {
      setIsPaneResizing(false);
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  // The guide sheet is desktop-only; if the viewport drops below `lg` while
  // it's open (window resize, device rotation), close it so the margin push
  // and the portal don't leak into the mobile layout, where the bottom
  // sheet owns the guide.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    function onChange() {
      if (!mediaQuery.matches) setIsGuideOpen(false);
    }
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  // Publish the open sheet's width as `--quiz-pane-offset` on <html> so
  // every `.quiz-pane-push` surface — the navbar above this component as
  // much as the quiz body inside it — yields to the sheet in one motion.
  // The sheet only renders during the question flow, so the offset clears
  // on the start/end screens (and on unmount) rather than leaving the
  // navbar pushed beside a sheet that no longer exists.
  const isSheetVisible =
    hasGuide && isGuideOpen && !showStartScreen && !showEndScreen;
  useEffect(() => {
    const root = document.documentElement;
    if (isSheetVisible) {
      root.style.setProperty('--quiz-pane-offset', `${paneWidth}px`);
    } else {
      root.style.removeProperty('--quiz-pane-offset');
    }
    return () => {
      root.style.removeProperty('--quiz-pane-offset');
    };
  }, [isSheetVisible, paneWidth]);

  useEffect(() => {
    const root = document.documentElement;
    if (isPaneResizing) {
      root.setAttribute('data-quiz-pane-resizing', '');
    } else {
      root.removeAttribute('data-quiz-pane-resizing');
    }
    return () => root.removeAttribute('data-quiz-pane-resizing');
  }, [isPaneResizing]);

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
        setSnap(COLLAPSED_SNAP_POINT);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (questionExitTimeoutRef.current) {
        clearTimeout(questionExitTimeoutRef.current);
        isQuestionLeavingRef.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!hasGuide || !currentQuestion || previousGuesses.length === 0) return;
    if (showSolution || hasExpandedGuideAfterMissRef.current) {
      return;
    }

    const timeout = setTimeout(() => {
      hasExpandedGuideAfterMissRef.current = true;
      setSnap('460px');
    }, 0);

    return () => clearTimeout(timeout);
  }, [currentQuestion, hasGuide, previousGuesses.length, showSolution]);

  return (
    <>
      {showStartScreen ? (
        <StartScreen
          onStartQuiz={onShowStartScreen}
          offerScoredRun={offerScoredRun}
          scoringProfile={scoreState.profile}
          setName={subSet.name}
          title={subSet.title}
          description={subSet.description}
          surfaceColor={quizScreenColors.surfaceColor}
          countColor={quizScreenColors.countColor}
          foregroundColor={quizScreenColors.foregroundColor}
        />
      ) : showEndScreen ? (
        <EndScreen
          numOfCorrectQuestions={correctQuestions.length}
          onTryAgain={onTryAgain}
          mode={mode}
          score={scoreState.score}
          questionsTaken={questionCounter}
          offerScoredRun={offerScoredRun}
          surfaceColor={quizScreenColors.surfaceColor}
          countColor={quizScreenColors.countColor}
          foregroundColor={quizScreenColors.foregroundColor}
        />
      ) : (
        <div
          // When the right sheet is open the workspace yields to it (VS Code
          // style) instead of being covered — see `.quiz-pane-push` in
          // globals.css. The navbar carries the same class, so the whole
          // page shifts as one layer; the width itself is published to
          // `--quiz-pane-offset` by the effect above.
          className='quiz-pane-push'
        >
          <div
            className={classNames(
              // `quiz-immersive` scopes the recolor rules in globals.css.
              // Same rounded canvas geometry as the start screen, filled
              // with the set's surface color; `overflow-hidden` clips the
              // progress bar to the rounded corners.
              'quiz-immersive relative overflow-hidden flex flex-col motion-enter w-full max-w-7xl p-2 md:p-8 rounded-xl m-auto min-h-[70vh] lg:min-h-[calc(100dvh-9rem)]',
              // Below `lg` the fixed vaul sheet reserves its 180px collapsed
              // snap, so grid subsets need extra clearance. On `lg` the
              // controls sit inside the card (no fixed chrome), so none is
              // needed.
              isGridLayout ? 'mb-52 lg:mb-6' : 'mb-6'
            )}
            style={
              {
                '--quiz-surface': quizSurface,
                '--quiz-fg': quizForeground,
                '--quiz-accent': quizAccent,
                backgroundColor: 'var(--quiz-surface)',
                color: 'var(--quiz-fg)',
              } as React.CSSProperties
            }
          >
            {/* Typeform-style progress line. aria-hidden: the footer's
                numeric "n of 10" / points label is the accessible reading. */}
            <div
              aria-hidden
              className='absolute inset-x-0 top-0 h-1.5 bg-[color-mix(in_srgb,var(--quiz-fg)_12%,transparent)]'
            >
              <div
                className='h-full transition-[width] duration-500 ease-[var(--ease-out-quart)]'
                style={{
                  width: `${progressFraction * 100}%`,
                  backgroundColor: 'var(--quiz-accent)',
                }}
              />
            </div>
            {/* In flow (not absolute) so it can never occlude the prompt when
                the open sheet narrows the card. Top-right placement maps the
                control to where the sheet appears (spatial correspondence). */}
            {hasGuide && (
              <div className='hidden justify-end lg:flex'>
                <button
                  type='button'
                  onClick={() => setIsGuideOpen((open) => !open)}
                  aria-expanded={isGuideOpen}
                  aria-controls='quiz-reference-pane'
                  className='inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400'
                >
                  {isGuideOpen ? (
                    <PanelRightClose className='h-4 w-4' aria-hidden='true' />
                  ) : (
                    <PanelRightOpen className='h-4 w-4' aria-hidden='true' />
                  )}
                  {isGuideOpen ? 'Hide guide' : 'Guide'}
                </button>
              </div>
            )}
            <div
              className={classNames(
                'mx-auto w-full p-4 flex-1 flex flex-col justify-center',
                // Grid sets need the full canvas; list sets read as a
                // centered column at a comfortable measure, Typeform-style.
                isGridLayout ? 'max-w-screen-xl' : 'max-w-3xl'
              )}
            >
              {currentQuestion && (
                <div
                  key={currentQuestion.id}
                  className='motion-quiz-question flex flex-col md:justify-between gap-5 max-sm:flex'
                  data-motion={isQuestionLeaving ? 'leaving' : 'entered'}
                >
                  <Prompt value={currentQuestion.prompt} />

                  <div
                    className={
                      isGridLayout
                        ? classNames('w-full self-center', gridMaxWidth)
                        : ''
                    }
                  >
                    <h2 className='text-xl font-bold text-gray-800'>
                      {subSet.header}
                    </h2>
                    {multiSelect && (
                      <p className='mt-1 text-sm font-normal text-gray-500'>
                        Select all that apply — more than one may be correct.
                      </p>
                    )}
                  </div>

                  <div
                    ref={optionsGridRef}
                    className={
                      isGridLayout
                        ? // Column-major (options read down each column),
                          // matching the original 2008 answer grid. Capped
                          // width + centered so the options aren't full-bleed.
                          classNames(
                            optionGridColumnClasses(optionCount),
                            'gap-3 w-full self-center',
                            gridMaxWidth
                          )
                        : 'flex flex-col gap-5'
                    }
                  >
                    {currentQuestion.options.map((option, index) => (
                      <Option
                        key={option.id}
                        index={index + 1}
                        showIndex
                        immersive
                        hint={inlineHintFor(option, index)}
                        compact={isGridLayout}
                        abbreviation={option.abbreviation}
                        isSelected={
                          multiSelect
                            ? selectedOptionIds.includes(option.id)
                            : index === selectedOptionIndex
                        }
                        isCursor={multiSelect && index === selectedOptionIndex}
                        isCorrect={currentQuestion.correctId.includes(
                          option.id
                        )}
                        showSolution={showSolution}
                        ref={
                          index === selectedOptionIndex
                            ? focusSelectedOption
                            : undefined
                        }
                        hasBeenIncorrectlyGuessed={previousGuesses.includes(
                          option.id
                        )}
                        label={option.label}
                        onClick={() => {
                          selectOption(index);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <hr className='h-px my-4 bg-gray-200 border-0' />
            {/* Question-level feedback. The answer explanation belongs to
                the question, so it stays here; option hints only appear
                here on grid sets — list sets attach them to the pill that
                earned them (see `inlineHintFor`). */}
            {(hasRevealedAnswer || (isGridLayout && displayedHint)) && (
              <div
                key={`${currentQuestion?.id}-${previousGuesses.length}-${
                  showSolution ? 'sol' : 'try'
                }`}
                className='motion-answer-reveal p-2 mb-3 text-base leading-6 text-gray-800'
              >
                {hasRevealedAnswer && (
                  <p>
                    <FeedbackText text={currentQuestion!.answer} />
                  </p>
                )}
                {isGridLayout && displayedHint && (
                  <p className='mt-2 whitespace-pre-line text-base leading-7 text-gray-700'>
                    <FeedbackText text={displayedHint} />
                  </p>
                )}
              </div>
            )}
            {/* Desktop controls, in the flow of the card itself: the primary
                action lives with the content it acts on, so no fixed bottom
                chrome is needed at this breakpoint. Below `lg` the vaul
                bottom sheet (further down) owns these controls. */}
            <div className='hidden items-center justify-between gap-6 px-4 pb-2 pt-2 lg:flex'>
              <div className='min-w-0'>
                <KeyboardKeys
                  optionCount={currentQuestion?.options.length}
                  hasAbbreviations={currentQuestion?.options.some(
                    (option) => option.abbreviation
                  )}
                  twoDimensional={isGridLayout}
                  multiSelect={multiSelect}
                />
              </div>
              <div className='flex shrink-0 items-center gap-5'>
                <span className='font-medium tabular-nums text-gray-800'>
                  {progressLabel(mode, questionCounter, scoreState.score)}
                </span>
                <div className='w-44'>
                  {/* Adaptive ink, matching the start screen CTA: the
                      button borrows the set's foreground as its fill and
                      the surface as its label, so it clears contrast on
                      every palette (inline style outranks the Button's
                      own primaryColor/gray classes). */}
                  {showSolution ? (
                    <Button
                      label='Next Question'
                      disabled={isQuestionLeaving}
                      onClick={handleNextQuestionTransition}
                      style={{
                        backgroundColor: 'var(--quiz-fg)',
                        color: 'var(--quiz-surface)',
                      }}
                    />
                  ) : (
                    <Button
                      label='Check Answer'
                      disabled={
                        multiSelect
                          ? selectedOptionIds.length === 0
                          : selectedOptionIndex == null
                      }
                      onClick={handleCheckAnswer}
                      style={
                        (
                          multiSelect
                            ? selectedOptionIds.length === 0
                            : selectedOptionIndex == null
                        )
                          ? {
                              backgroundColor:
                                'color-mix(in srgb, var(--quiz-fg) 18%, transparent)',
                              color:
                                'color-mix(in srgb, var(--quiz-fg) 55%, transparent)',
                            }
                          : {
                              backgroundColor: 'var(--quiz-fg)',
                              color: 'var(--quiz-surface)',
                            }
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop reference sheet — the same vaul Drawer as the mobile
              bottom sheet, repositioned to the right edge. Same surface,
              same grabber language (rotated vertical, doubling as a
              continuous resize grip), same slide physics. Non-modal so the
              quiz stays interactive; closed by default, toggled from the
              card's top-right. Below `lg` it never opens — the bottom sheet
              owns the guide there. */}
          {hasGuide && (
            <Drawer
              direction='right'
              open={isGuideOpen}
              onOpenChange={setIsGuideOpen}
              modal={false}
              dismissible={false}
              shouldScaleBackground={false}
            >
              <DrawerContent
                side='right'
                id='quiz-reference-pane'
                className='hidden lg:flex'
                style={{ width: paneWidth }}
              >
                <div
                  role='separator'
                  aria-orientation='vertical'
                  aria-label='Resize the reference guide'
                  onPointerDown={startPaneResize}
                  className='group absolute inset-y-0 left-0 z-10 flex w-4 cursor-col-resize items-center justify-center'
                >
                  <div className='h-24 w-1.5 rounded-full bg-muted transition-colors group-hover:bg-gray-300' />
                </div>
                <div className='flex h-14 shrink-0 items-center justify-between border-b border-gray-100 pl-7 pr-4'>
                  <DrawerTitle className='text-sm font-semibold text-gray-800'>
                    Reference guide
                  </DrawerTitle>
                  <DrawerDescription className='sr-only'>
                    The well-formed formula guide for this exercise set. Drag
                    the left edge to resize.
                  </DrawerDescription>
                  <button
                    type='button'
                    onClick={() => setIsGuideOpen(false)}
                    aria-label='Close reference guide'
                    className='inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400'
                  >
                    <X className='h-4 w-4' aria-hidden='true' />
                  </button>
                </div>
                {/* Container-queried so the guide's columns and heading sizes
                    follow the sheet's current width (it's resizable), not the
                    viewport — single-column when narrow, opening up as the
                    user drags it wider. */}
                <div className='@container min-h-0 flex-1 overflow-y-auto pl-7 pr-6 py-6 flex flex-col gap-10 text-base leading-7 text-gray-600 select-text'>
                  <WffGuide subSet={subSet} />
                </div>
              </DrawerContent>
            </Drawer>
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
          defaultOpen
          onOpenChange={() => {}} // No action needed since it's always open
          dismissible={false}
          modal={false}
          snapPoints={[
            ...(hasGuide ? GUIDE_SNAP_POINTS : NO_GUIDE_SNAP_POINTS),
          ]}
          activeSnapPoint={hasGuide ? snap : COLLAPSED_SNAP_POINT}
          setActiveSnapPoint={(value) =>
            setSnap(hasGuide ? value : COLLAPSED_SNAP_POINT)
          }
        >
          <DrawerContent
            ref={drawerRef}
            disableOpenAnimation
            className='quiz-controls-drawer fixed flex flex-col overflow-hidden bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] lg:hidden'
            style={
              {
                '--initial-transform': DRAWER_INITIAL_TRANSFORM,
              } as React.CSSProperties
            }
            onGrabberClick={
              hasGuide
                ? () => setSnap(nextSnapPoint(snap, GUIDE_SNAP_POINTS))
                : undefined
            }
          >
            <DrawerHeader>
              <DrawerTitle className='sr-only'>
                Quiz controls and reference guide
              </DrawerTitle>
              <DrawerDescription className='sr-only'>
                Keyboard shortcuts, quiz progress, answer actions, and the
                well-formed formula guide.
              </DrawerDescription>
              <div className='left-0 z-50 w-full h-24 bg-white flex items-center justify-center md:justify-between'>
                <div className='ml-0 md:ml-5'>
                  {!showStartScreen && !showEndScreen && (
                    <KeyboardKeys
                      optionCount={currentQuestion?.options.length}
                      hasAbbreviations={currentQuestion?.options.some(
                        (option) => option.abbreviation
                      )}
                      twoDimensional={isGridLayout}
                      multiSelect={multiSelect}
                    />
                  )}
                </div>
                <div className='flex justify-between gap-5 items-center h-full align-bottom text-gray-800 font-medium flex-col md:flex-row w-full md:w-fit'>
                  {!showStartScreen && !showEndScreen && (
                    <div className='flex tabular-nums'>
                      {progressLabel(mode, questionCounter, scoreState.score)}
                    </div>
                  )}
                  <div className='flex h-max w-full md:w-fit'>
                    {!showSolution && !showStartScreen && !showEndScreen && (
                      <Button
                        label='Check Answer'
                        disabled={
                          multiSelect
                            ? selectedOptionIds.length === 0
                            : selectedOptionIndex == null
                        }
                        onClick={handleCheckAnswer}
                      />
                    )}
                    {showSolution && (
                      <Button
                        label='Next Question'
                        disabled={isQuestionLeaving}
                        onClick={handleNextQuestionTransition}
                      />
                    )}
                  </div>
                </div>
              </div>
            </DrawerHeader>

            {isGuideExpanded && (
              <div
                className='@container overflow-y-auto flex flex-col gap-10 mx-4 md:mx-8 pb-8 text-base leading-7 text-gray-600 select-text'
                style={{ maxHeight: guideContentMaxHeight(snap) }}
              >
                <WffGuide subSet={subSet} />
              </div>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
