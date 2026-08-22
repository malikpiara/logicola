'use client';

import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import Link from 'next/link';
import { GemButton } from './gemButton';
import { BookHeartIcon, TimesIcon } from './pixelIcons';
import { sheetLeftClip, spriteClip } from '@/lib/pixel';
import Option from '../option';
import Prompt from '../prompt';
import { EndScreen } from './endScreen';
import { KeyboardKeys } from './keyboardKeys';
import { StartScreen } from './startScreen';
import useQuizState from './useQuizState';
import { progressLabel, type QuizMode } from './quizMode';
import { canScore, chargeFor, progress } from '@/lib/scoring';
import { writeLastDrill } from '@/lib/lastDrill';
import { haptic } from '@/lib/haptics';
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
import { FeedbackSlot } from './feedbackSlot';
import { hintPartsOf } from './hintBlock';
import { getQuizScreenColors } from './quizColors';
import { PatternLayer, patternKindForSubSet } from './patternLayer';
import { useSafeAreaBottom } from './useSafeAreaBottom';
import { useQuizChrome } from './useQuizChrome';
import { useQuizFavicon } from './useQuizFavicon';
import { hasWffGuide, WffGuide } from './wffGuide';

export interface QuizProps {
  subSet: SubSet;
}

interface QuizRun {
  attempt: number;
  /** Set on retry mounts: skip the start screen, begin in this mode. */
  initialMode?: QuizMode;
}

export default function Quiz({ subSet }: QuizProps) {
  // "Try again" is a REMOUNT, not a reset: bumping the attempt in the key
  // rebuilds QuizSession — and every atom in useQuizState — through the
  // initializers, so a newly added piece of state can never be forgotten
  // by an enumerated reset. The chosen mode rides along as initialMode.
  const [run, setRun] = useState<QuizRun>({ attempt: 0 });
  return (
    <QuizSession
      key={`${subSet.id}:${run.attempt}`}
      subSet={subSet}
      initialMode={run.initialMode}
      onRetry={(mode) =>
        setRun((previous) => ({
          attempt: previous.attempt + 1,
          initialMode: mode,
        }))
      }
    />
  );
}

const QUESTION_EXIT_MS = 90;

// Mobile advance is a spatial push (old exercise slides off left, new one
// arrives from the right — see .motion-quiz-question's width < 40rem block
// in globals.css), and the longer travel needs a longer exit than the
// desktop fade-up. Must match that block's transition-duration.
const QUESTION_EXIT_MOBILE_MS = 130;

// Tailwind's `sm` breakpoint — below it the quiz uses the mobile push.
const MOBILE_QUERY = '(width < 40rem)';

// Direction A — "hit flicker" — locked from the damage lab
// (docs/damage-bar-lab.html; Malik, 2026-08-12): on a scored miss the
// bar's fill blinks off twice in hard cuts, and only then does the
// bar pay the penalty. The CSS owns the choreography (340ms flicker,
// then a transition-delay of the same length holds back each bar's own
// 500ms advance — width on desktop, --qp on mobile); this constant is
// only how long the `.qbar-miss` class stays on, with headroom.
const MISS_FLASH_MS = 900;

// Sprite corners at chip scale: R=24 is pill scale, R=12 chip scale.
const GUIDE_CHIP_CLIP = spriteClip(0, 12);

// The mobile bar's free ends are its only curve-analog — they take sprite
// caps at R=4 on the 2px grid. (Desktop's hairline bleeds off the card
// edges: no free ends, nothing to cap, so it stays unclipped.)
const MOBILE_BAR_CLIP = spriteClip(0, 4, 2);

// The reference panel's ✕ chip: R=8 is the 32px chip scale (pixel-ui.md).
const CLOSE_CHIP_CLIP = spriteClip(0, 8);

// The reference sheet's silhouette: stair-stepped left corners at chip
// scale (R=12 — the drawer's old 10px curve, rasterised), square against
// the viewport edge. The 2px edge rule is the gap between the two clips:
// the sheet's box paints the rule colour under the OUTER silhouette, and
// the white content layer is clipped to the INNER one — a border would
// lose its stroke on every stair.
const SHEET_EDGE_RULE_PX = 2;
const SHEET_OUTER_CLIP = sheetLeftClip(0, 12);
const SHEET_INNER_CLIP = sheetLeftClip(SHEET_EDGE_RULE_PX, 12);

// The resize grip as a pixel handle: sprite caps on the 2px grid, the
// same reading as the mobile progress bar's free ends.
const GRIP_CLIP = spriteClip(0, 4, 2);

// Sets with more options than this earn a third column on wide cards
// (Set R's 18); smaller multi-option sets (Set Q's 7) stay at two.
const GRID_THIRD_COLUMN_MIN = 13;

/**
 * Column-major grid geometry, fed to the `.qoptions-grid` CSS as custom
 * properties. A CONTAINER query (not a media query) picks between the
 * two tiers: the card's width is what the guide pane resizes, so
 * viewport width says nothing useful about how much room the cells have.
 * Column-major flow needs rows and columns to move together and CSS
 * can't divide, so both pairs are supplied here.
 */
function optionGridVars(optionCount: number): React.CSSProperties {
  const cols = optionCount >= GRID_THIRD_COLUMN_MIN ? 3 : 2;
  return {
    '--qcols': cols,
    '--qrows': Math.ceil(optionCount / cols),
    '--qcols-sm': 2,
    '--qrows-sm': Math.ceil(optionCount / 2),
  } as React.CSSProperties;
}

/**
 * Approximate vertical space occupied by the drawer's grabber +
 * `DrawerHeader` (`KeyboardKeys`, counter, action button) at the
 * top of `DrawerContent`. Used to size the scrollable guide
 * container so `overflow-y-auto` engages when the visible drawer
 * height (per active snap point) can't fit the guide content.
 */
const DRAWER_HEADER_OFFSET_PX = 112;

type SnapValue = string | number;

// Sized to what the collapsed sheet actually holds — grabber (~24px) +
// the CTA row with the header's padding (~84px) + a little slack for
// the home indicator. The old 180px carried ~70px of dead surface below
// the CTA, all stolen from the quiz (Malik, 2026-08-08). The bottom
// safe-area inset is ADDED to this at runtime: the page now draws under
// the navigation bar (that is how the bar takes the set's colour), so
// without the extra the CTA would sit beneath the gesture pill.
const COLLAPSED_SNAP_BASE_PX = 128;

/**
 * What the sheet is showing, independent of the pixel height that
 * expresses it — see `snapKind` for why the distinction earns its keep.
 */
type SnapKind = 'collapsed' | 'guide' | 'full';

/**
 * Read a vaul snap value back as its kind. The expanded snap is dynamic
 * now (content-fit), so the collapsed point is the anchor: 1 is full,
 * the collapsed string is collapsed, and any other px value is the
 * expanded guide snap.
 */
function snapKindOf(value: SnapValue | null, collapsedPoint: string): SnapKind {
  if (value === 1) return 'full';
  if (value == null || value === collapsedPoint) return 'collapsed';
  return 'guide';
}

/**
 * Cycle the drawer forward (collapsed → guide → full → …). Used by the
 * grabber's `onGrabberClick` so users can tap it to progressively
 * expand the sheet — HIG's own tap-to-cycle. Content-fit sheets have no
 * full snap, so their cycle is collapsed → guide → collapsed.
 */
function nextSnapKind(current: SnapKind, hasFull: boolean): SnapKind {
  if (current === 'collapsed') return 'guide';
  if (current === 'guide') return hasFull ? 'full' : 'collapsed';
  return 'collapsed';
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
interface QuizSessionProps extends QuizProps {
  initialMode?: QuizMode;
  onRetry: (mode: QuizMode) => void;
}

const QuizSession: React.FC<QuizSessionProps> = ({
  subSet,
  initialMode,
  onRetry,
}) => {
  const {
    showStartScreen,
    showEndScreen,
    selectedOptionIndex,
    selectedOptionIds,
    multiSelect,
    showSolution,
    currentQuestion,
    willFinishOnNext,
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
    captureRetry,
    mode,
    scoreState,
  } = useQuizState(subSet, initialMode);

  // The hook logs the retry (the ending run's stats live there); the
  // parent's key bump performs the actual reset by remounting.
  function handleTryAgain(nextMode: QuizMode = mode) {
    captureRetry(nextMode);
    onRetry(nextMode);
  }
  // Offered wherever the original's scoring has actually been derived from
  // that set's own original program — today A/C/J/L/N (+5, halving penalty), Q (+7, flat)
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
  // Camo classic dresses the easy sets, camo giant the hard ones — one
  // resolution for all three screens so start, question and end match.
  const patternKind = patternKindForSubSet(subSet);
  // The question screen inherits the set's start-screen palette (same
  // fallbacks as StartScreen's prop defaults), so start screen → quiz reads
  // as one continuous colored surface instead of a colored cover page
  // opening onto a white form.
  const quizSurface = quizScreenColors.surfaceColor ?? '#431407';
  const quizForeground = quizScreenColors.foregroundColor ?? '#ffffff';
  const quizAccent = quizScreenColors.countColor ?? '#fdba74';

  // The OS chrome takes the set's surface for the whole session — start,
  // question and end screens all wear it, so it never has to change
  // mid-run.
  useQuizChrome(quizSurface);

  // …and the browser tab takes the set's tab colour, so a strip of open
  // drills says which set each one is.
  useQuizFavicon(quizScreenColors.tabColor);

  // Remember the drill for the landing page's resume banner (lab LP7,
  // Malik 2026-08-17) — an OBSERVATION of the run, never a second
  // source of truth: the score stays the hook's. Start screen excluded
  // — arriving at a drill you never started isn't "leaving off".
  useEffect(() => {
    if (showStartScreen) return;
    writeLastDrill({
      title: subSet.title,
      path: window.location.pathname,
      points: mode.kind === 'score' ? scoreState.score : null,
    });
  }, [showStartScreen, subSet.title, mode.kind, scoreState.score]);

  // Top progress bar. Count mode fills a tenth per completed question (a
  // question counts once its solution is shown); scored mode tracks distance
  // to the 100-point target, which is the honest reading of a run with no
  // fixed length. `progress()` clamps BOTH ends: the score goes negative by
  // design (no floor in the 2008 economy), and a negative percentage is an
  // invalid width — the browser drops the declaration and the fill div
  // falls back to auto/100%, which read as the bar being stuck or full.
  const progressFraction =
    mode.kind === 'count'
      ? Math.min((questionCounter - (showSolution ? 0 : 1)) / mode.total, 1)
      : progress(scoreState);
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
  // The current question block — after the keyed remount inside a view
  // transition this already points at the NEW node (flushSync commits it).
  const questionBlockRef = useRef<HTMLDivElement>(null);
  // The options scroller's scrollbar is transparent until a scroll is
  // actually happening ([data-scrolling] in globals.css); it fades back
  // after a beat of stillness. Straight to the node, no per-frame state.
  const optionsScrollIdleRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  function handleOptionsScroll() {
    const el = optionsGridRef.current;
    if (!el) return;
    el.dataset.scrolling = '';
    if (optionsScrollIdleRef.current)
      clearTimeout(optionsScrollIdleRef.current);
    optionsScrollIdleRef.current = setTimeout(() => {
      delete el.dataset.scrolling;
      optionsScrollIdleRef.current = null;
    }, 700);
  }
  const [isMissFlashing, setIsMissFlashing] = useState(false);
  const missFlashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const questionExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /**
   * 2) We'll keep a ref to the DrawerContent (or the <Drawer> itself).
   *    Then we'll detect clicks outside of this container.
   */
  const drawerRef = useRef<HTMLDivElement>(null);
  const optionsGridRef = useRef<HTMLDivElement>(null);
  /**
   * Which input last moved the cursor. Both keyboard-only marks read
   * off this: the focus band and the multi-select CURSOR band. On touch
   * neither belongs — pointing IS the cursor — and leaving them on
   * meant a deselected option kept a 2px ink ring, which at a glance is
   * indistinguishable from the accent selection band (Malik, on
   * Android, 2026-08-08: "I unselect it and it still looks selected").
   *
   * State, not a ref: it is read during render, and the setter batches
   * with the selection update that caused the render, so the mark and
   * the modality can never disagree.
   */
  const [lastInput, setLastInput] = useState<'keyboard' | 'pointer'>('pointer');

  // The page draws under the navigation bar now (that is how the bar
  // takes the set's colour), so the collapsed sheet grows by the bar's
  // height to keep the CTA clear of the gesture pill. Zero wherever
  // there are no insets, which is why nothing else moves.
  const safeAreaBottom = useSafeAreaBottom();
  const collapsedSnapPoint = `${COLLAPSED_SNAP_BASE_PX + safeAreaBottom}px`;
  /**
   * Content-fit expanded snap (decided 2026-08-22, guide-lab). The old
   * fixed ladder (460px, then 97%) opened Set A's one-table guide onto
   * ~800px of empty surface at full. The guide now stays mounted (see
   * the sheet's guide container) and reports its height; when the whole
   * guide fits under the viewport the sheet gets ONE expanded snap
   * sized to the content and no full snap at all — detents fit content
   * (HIG), never the other way round. Q and R still earn 460px + full.
   */
  const [guideContentPx, setGuideContentPx] = useState<number | null>(null);
  // CALLBACK ref, not useRef + screen-flag deps: the drawer's portal
  // children attach a commit after the screen flags flip, so an effect
  // keyed on those flags measures a null ref once and never again.
  // State-as-ref re-fires the measurement effect on the actual attach.
  const [guideScrollEl, setGuideScrollEl] = useState<HTMLDivElement | null>(
    null
  );
  useEffect(() => {
    if (!guideScrollEl) return;
    const measure = () => setGuideContentPx(guideScrollEl.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure);
    // Observe the CONTENT wrapper: the container's own box is clamped
    // by maxHeight, so it never resizes when its content does — fonts
    // and KaTeX arriving late would go unseen.
    observer.observe(guideScrollEl.firstElementChild ?? guideScrollEl);
    return () => observer.disconnect();
  }, [guideScrollEl]);
  // Header (grabber + CTA row) above the guide inside the sheet, plus
  // breathing room under the content.
  const contentSnapPx =
    guideContentPx != null
      ? guideContentPx + DRAWER_HEADER_OFFSET_PX + 28
      : null;
  const guideFitsWithoutFull =
    contentSnapPx != null &&
    typeof window !== 'undefined' &&
    contentSnapPx < window.innerHeight * 0.97 - 40;
  const expandedSnapPoint: SnapValue = guideFitsWithoutFull
    ? `${Math.max(280, Math.round(contentSnapPx))}px`
    : '460px';
  const hasFullSnap = !guideFitsWithoutFull;
  const guideSnapPoints: readonly SnapValue[] = hasFullSnap
    ? [collapsedSnapPoint, expandedSnapPoint, 1]
    : [collapsedSnapPoint, expandedSnapPoint];
  const noGuideSnapPoints: readonly SnapValue[] = [collapsedSnapPoint];
  const drawerInitialTransform = `calc(100dvh - ${collapsedSnapPoint})`;

  /**
   * The drawer's snap, held SEMANTICALLY rather than as the px string
   * vaul wants. The collapsed height is only known once the safe-area
   * inset has been measured, so a stored string would go stale the
   * moment it changed — and vaul matches `activeSnapPoint` against its
   * points by value, so a stale string matches none of them. Deriving
   * the pixels from the kind each render keeps the two in step with no
   * effect and no cascading render.
   */
  const [snapKind, setSnapKind] = useState<SnapKind>('collapsed');
  const snapValueOf = (kind: SnapKind): SnapValue =>
    kind === 'collapsed'
      ? collapsedSnapPoint
      : kind === 'guide' || !hasFullSnap
        ? expandedSnapPoint
        : 1;
  const snap = snapValueOf(snapKind);
  const isGuideExpanded = hasGuide && snapKind !== 'collapsed';

  /**
   * The flick zone (decided 2026-08-21, sheet-lab): a fast upward flick
   * in the bottom 30% of the screen expands the sheet one snap — the
   * guide reachable without aiming at the grabber. Honest findings from
   * the lab: list-set question screens don't scroll, so the classic
   * swipe-vs-scroll conflict mostly doesn't exist; where it does — the
   * grid sets' internally-scrolling options region — the flick YIELDS
   * (a touch starting in a scrollable options region is never claimed).
   * Touch-only by construction: desktop's guide lives in the side pane
   * and the bottom sheet is lg:hidden.
   */
  const quizCardRef = useRef<HTMLDivElement | null>(null);
  // Latest values for the touch handlers without re-binding them —
  // synced in an effect (writing refs during render trips
  // react-hooks/refs, and rightly).
  const snapKindRef = useRef(snapKind);
  const hasFullSnapRef = useRef(hasFullSnap);
  useEffect(() => {
    snapKindRef.current = snapKind;
    hasFullSnapRef.current = hasFullSnap;
  }, [snapKind, hasFullSnap]);
  useEffect(() => {
    const card = quizCardRef.current;
    if (!card || !hasGuide) return;
    type FlickSample = { t: number; y: number };
    let flick: {
      t0: number;
      x0: number;
      y0: number;
      samples: FlickSample[];
      done: boolean;
    } | null = null;
    // px/ms over the last ~100ms of samples, positive = downward.
    const velocityOf = (samples: FlickSample[]) => {
      if (samples.length < 2) return 0;
      const last = samples[samples.length - 1]!;
      let i = samples.length - 2;
      while (i > 0 && last.t - samples[i]!.t < 100) i--;
      const first = samples[i]!;
      const dt = last.t - first.t;
      return dt ? (last.y - first.y) / dt : 0;
    };
    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      if (touch.clientY < window.innerHeight * 0.7) return;
      const options = optionsGridRef.current;
      if (
        options &&
        event.target instanceof Node &&
        options.contains(event.target) &&
        options.scrollHeight > options.clientHeight + 1
      ) {
        return; // the options region owns its scroll — never claim it
      }
      flick = {
        t0: performance.now(),
        x0: touch.clientX,
        y0: touch.clientY,
        samples: [{ t: performance.now(), y: touch.clientY }],
        done: false,
      };
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!flick || flick.done) return;
      const touch = event.touches[0];
      if (!touch) return;
      const now = performance.now();
      flick.samples.push({ t: now, y: touch.clientY });
      if (flick.samples.length > 8) flick.samples.shift();
      const rise = flick.y0 - touch.clientY;
      const drift = Math.abs(touch.clientX - flick.x0);
      const upwardVelocity = -velocityOf(flick.samples);
      if (
        now - flick.t0 <= 220 &&
        rise >= 24 &&
        upwardVelocity >= 0.55 &&
        drift < rise
      ) {
        flick.done = true;
        const current = snapKindRef.current;
        const atTop =
          current === 'full' ||
          (current === 'guide' && !hasFullSnapRef.current);
        if (!atTop) {
          event.preventDefault();
          setSnapKind(current === 'collapsed' ? 'guide' : 'full');
        }
      } else if (now - flick.t0 > 260) {
        flick.done = true;
      }
    };
    const onTouchEnd = () => {
      flick = null;
    };
    card.addEventListener('touchstart', onTouchStart, { passive: true });
    // Non-passive: the one preventDefault at the trigger moment stops
    // the page scroll from double-responding to a claimed flick.
    card.addEventListener('touchmove', onTouchMove, { passive: false });
    card.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      card.removeEventListener('touchstart', onTouchStart);
      card.removeEventListener('touchmove', onTouchMove);
      card.removeEventListener('touchend', onTouchEnd);
    };
  }, [hasGuide, showStartScreen, showEndScreen]);

  useKeyboardNavigation({
    currentQuestion,
    showStartScreen,
    showSolution,
    selectedOptionIndex,
    onShowStartScreen,
    // Only these four move the cursor, and only from the keyboard —
    // which is the one case where focus should follow it.
    selectNextOption: fromKeyboard(selectNextOption),
    selectPreviousOption: fromKeyboard(selectPreviousOption),
    selectOption: fromKeyboard(selectOption),
    moveCursor: fromKeyboard(moveCursor),
    handleCheckAnswer,
    handleNextQuestion: handleNextQuestionTransition,
    collapseDrawer: () => {
      setSnapKind('collapsed');
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

  // What the reserved feedback slot shows. The hint we display depends on
  // the phase:
  //
  //   1. Mid-attempt (showSolution=false): the MOST RECENT wrong
  //      submission's hint (`useQuizState` clears `selectedOptionIndex`
  //      after a wrong check so the user can pick again, so the guess is
  //      looked up from `previousGuesses`).
  //   2. Solved: the answer explanation — the hint and the answer never
  //      coexist, which is what lets the reserved slot size itself to the
  //      taller of the two rather than to their sum.
  //   3. Review (solved, and the user clicks a ruled-out option): that
  //      option's hint replaces the answer while it's under review, so
  //      wrong options remain explorable after the reveal.
  const lastWrongGuessId =
    previousGuesses.length > 0
      ? previousGuesses[previousGuesses.length - 1]
      : undefined;
  const lastWrongOption =
    lastWrongGuessId !== undefined && currentQuestion
      ? currentQuestion.options.find((o) => o.id === lastWrongGuessId)
      : undefined;
  const selectedOption =
    selectedOptionIndex != null && currentQuestion
      ? currentQuestion.options[selectedOptionIndex]
      : undefined;
  const reviewedOption =
    showSolution &&
    selectedOption &&
    !currentQuestion!.correctId.includes(selectedOption.id)
      ? selectedOption
      : undefined;
  // Mid-attempt review (2026-08-21): a multi-select miss can flag SEVERAL
  // wrong picks in one submission, but the slot only shows the last one's
  // hint — user testing found people unable to read the hint for their
  // other wrong pick. Putting the cursor on any already-flagged option now
  // surfaces THAT option's hint, before the solve, in both modes. (The
  // same click can no longer re-select the option — see selectOption.)
  const midReviewOption =
    !showSolution &&
    selectedOption &&
    previousGuesses.includes(selectedOption.id)
      ? selectedOption
      : undefined;
  const liveHintOption = showSolution
    ? reviewedOption
    : (midReviewOption ?? lastWrongOption);
  const liveHint = liveHintOption ? hintPartsOf(liveHintOption) : undefined;
  const liveAnswer =
    showSolution && !liveHintOption ? currentQuestion?.answer : undefined;

  // The bar flashes only where it is health: scored mode, where the
  // penalty genuinely shrinks it. Count mode keeps its completion
  // reading — blinking it would threaten progress a miss doesn't
  // actually take. Level-triggered on purpose: a second miss inside
  // the window extends the flag instead of restarting the animation.
  function flashBarDamage() {
    if (mode.kind !== 'score') return;
    // ...and only when the miss actually costs something. `scoreState` here
    // is the pre-miss snapshot (this runs in the render that graded it), so
    // it answers for the miss just taken. Two cases pay nothing: a run in
    // the red under the 'no-deeper' floor, and a penalty register the set's
    // own original program has already decayed to 0 — Set R's second miss on a problem,
    // Set A's fifth. Flashing either reports damage that never happened.
    if (chargeFor(scoreState) === 0) return;
    if (missFlashTimeoutRef.current) clearTimeout(missFlashTimeoutRef.current);
    setIsMissFlashing(true);
    missFlashTimeoutRef.current = setTimeout(() => {
      setIsMissFlashing(false);
      missFlashTimeoutRef.current = null;
    }, MISS_FLASH_MS);
  }

  function handleCheckAnswer() {
    // The hook is the only grader; the shell just reacts to its verdict.
    const outcome = onCheckAnswer();
    // The one moment a haptic carries information, not just texture: it
    // confirms the outcome the eye is still racing to read.
    if (outcome) haptic(outcome === 'correct' ? 'success' : 'error');

    // A first miss used to expand the guide sheet on its own. Retired
    // 2026-08-19 (Malik): an uninvited sheet takes the screen at exactly
    // the moment the learner is re-reading the question, and the standing
    // Guide chip in the header already carries the affordance — the help
    // is offered, not pushed. The miss still flashes the damage.
    if (outcome === 'miss') flashBarDamage();
  }

  function handleNextQuestionTransition() {
    if (isQuestionLeavingRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      handleNextQuestion();
      return;
    }

    // Mobile advance is a push — the old exercise slides off left WHILE the
    // new one arrives from the right (Duolingo's model, measured off Malik's
    // capture 2026-08-19: header pinned, layers overlapping, ~230ms; same
    // spatial grammar as mindful's slide-forward). Both questions must be on
    // screen at once, which the keyed remount can't do — the View Transitions
    // API's snapshot layers provide that without double-mounting. The
    // choreography lives on ::view-transition-*(quiz-question) in
    // globals.css.
    //
    // NOT on the run's last advance: the end screen replaces the whole
    // canvas, so there is no incoming pane — a push would strand the old
    // question sliding over the end screen's cross-fade (Malik, 2026-08-19).
    // It falls through to the short exit below; the end screen then makes
    // its own `motion-enter` entrance, same as the start screen.
    if (
      !willFinishOnNext &&
      window.matchMedia(MOBILE_QUERY).matches &&
      'startViewTransition' in document
    ) {
      isQuestionLeavingRef.current = true;
      const transition = document.startViewTransition(() => {
        flushSync(() => handleNextQuestion());
        // The remount would replay the CSS entrance inside the incoming
        // snapshot — the push already IS the entrance, so silence it for
        // this node. Inline (not a class) so it can't restart on removal.
        questionBlockRef.current?.style.setProperty('animation', 'none');
      });
      // A hidden document (backgrounded tab) skips the transition and
      // rejects these promises — the advance itself still committed, so
      // swallow the rejections instead of surfacing an uncaught error.
      transition.ready.catch(() => {});
      transition.finished
        .catch(() => {})
        .finally(() => {
          isQuestionLeavingRef.current = false;
        });
      return;
    }

    isQuestionLeavingRef.current = true;
    setIsQuestionLeaving(true);
    const exitMs = window.matchMedia(MOBILE_QUERY).matches
      ? QUESTION_EXIT_MOBILE_MS
      : QUESTION_EXIT_MS;
    questionExitTimeoutRef.current = setTimeout(() => {
      handleNextQuestion();
      isQuestionLeavingRef.current = false;
      setIsQuestionLeaving(false);
      questionExitTimeoutRef.current = null;
    }, exitMs);
  }

  /**
   * Move focus to the cursor option — but ONLY when the keyboard moved
   * it. Chrome matches `:focus-visible` for PROGRAMMATIC `.focus()`
   * (it can't attribute the focus to a pointer, so it assumes intent),
   * which meant every tap left the 2px focus band on the last-tapped
   * option. Deselecting then read as still-selected on touch — the ink
   * band and the accent band are both just "a ring" at a glance
   * (Malik, on Android, 2026-08-08). A genuine tap still focuses the
   * button natively; that correctly does NOT match :focus-visible.
   */
  function fromKeyboard<Args extends unknown[]>(fn: (...args: Args) => void) {
    return (...args: Args) => {
      setLastInput('keyboard');
      fn(...args);
    };
  }

  function focusSelectedOption(node: HTMLButtonElement | null) {
    if (lastInput === 'keyboard') node?.focus();
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
        setSnapKind('collapsed');
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
      if (missFlashTimeoutRef.current) {
        clearTimeout(missFlashTimeoutRef.current);
      }
    };
  }, []);

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
          patternKind={patternKind}
        />
      ) : showEndScreen ? (
        <EndScreen
          numOfCorrectQuestions={correctQuestions.length}
          onTryAgain={handleTryAgain}
          mode={mode}
          score={scoreState.score}
          questionsTaken={questionCounter}
          offerScoredRun={offerScoredRun}
          surfaceColor={quizScreenColors.surfaceColor}
          countColor={quizScreenColors.countColor}
          foregroundColor={quizScreenColors.foregroundColor}
          patternKind={patternKind}
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
            ref={quizCardRef}
            className={classNames(
              // `quiz-immersive` scopes the recolor rules in globals.css.
              // Same rounded canvas geometry as the start screen, filled
              // with the set's surface color. `overflow-clip`, NOT
              // `overflow-hidden`: both clip the progress bar to the
              // rounded corners, but hidden creates a scroll container,
              // which is a sticky containing block — the mobile header
              // row would silently never pin (porting trap, pixel-ui.md).
              // `isolate` so the quilt layer's -z-10 stays inside the card
              // (above its background, below its content). lg:pb-[152px]
              // reserves the footer band's 112px plus a gap, so every
              // control sits on clean surface and the pattern underlines
              // the card instead of running under the footer.
              // Full-bleed below lg: no rounding, full viewport height —
              // the card IS the screen on phones (white margins were the
              // page frame showing through).
              'quiz-immersive relative isolate overflow-clip flex flex-col motion-enter w-full max-w-7xl p-2 md:p-8 lg:pb-[152px] rounded-none lg:rounded-xl m-auto min-h-dvh lg:min-h-[calc(100dvh-9rem)]',
              // Below `lg` the fixed vaul sheet reserves its collapsed
              // snap (128px), so grid subsets need extra clearance — as
              // PADDING, not margin: margin exposed a white strip of page
              // between the full-bleed card and the sheet. On `lg` the
              // controls sit inside the card, so none is needed.
              // `quiz-grid-set` flips the mobile scroll model: the page
              // stops scrolling and the options region scrolls INTERNALLY,
              // so the argument never moves at all (Malik, 2026-08-19; see
              // globals.css). The sheet clearance moves inside the scroll
              // region there, so the pb-40 is neutralised below lg by the
              // same block.
              isGridLayout ? 'quiz-grid-set pb-40 mb-0 lg:mb-6' : 'mb-0 lg:mb-6'
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
            {/* The pattern's footer band (desktop only — mobile question
                screens are CLEAN; the pattern's phone home is the start
                screen). A fixed 112px strip at the card's foot: the
                pattern frames the work, it never sits under text. */}
            <PatternLayer
              kind={patternKind}
              surface={quizSurface}
              ink={quizForeground}

              treatment='footer'
              className='pointer-events-none absolute inset-0 -z-10 hidden lg:block'
            />
            {/* Typeform-style progress line, desktop only (the mobile
                header row below carries its own bar). aria-hidden: the
                footer's numeric points label is the accessible reading. */}
            <div
              aria-hidden
              className='absolute inset-x-0 top-0 hidden h-1.5 bg-[color-mix(in_srgb,var(--quiz-fg)_12%,transparent)] lg:block'
            >
              <div
                className={classNames(
                  'h-full transition-[width] duration-500 ease-[var(--ease-out-quart)]',
                  isMissFlashing && 'qbar-miss'
                )}
                style={{
                  width: `${progressFraction * 100}%`,
                  backgroundColor: 'var(--quiz-accent)',
                }}
              />
            </div>
            {/* Mobile header row, sticky as a unit (Duolingo/Brilliant
                anatomy; docs/pixel-ui.md § Mobile chrome): bare pixel ✕
                left (18px glyph in a full 44px tap box — exit lives IN
                the card, replacing the old white ExerciseNavbar bar) ·
                progress bar filling the middle (sprite caps, fill
                quantised to the 4px grid) · icon-only 44×44 Guide chip
                right, expanding the bottom sheet's guide snap. */}
            {/* pt clears the status bar: the page draws under it now, so
                the row supplies its own inset (0 where there is none). */}
            <div className='sticky top-0 z-20 -mx-2 -mt-2 mb-3 flex items-center gap-3.5 bg-[var(--quiz-surface)] px-2 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:-mx-8 md:-mt-8 lg:hidden'>
              <Link
                href='/'
                aria-label='Exit quiz and return to the home page'
                className='qexit flex h-11 w-11 shrink-0 items-center justify-center'
              >
                <TimesIcon className='h-[18px] w-[18px]' />
              </Link>
              {/* −13px optical margin: the ✕ is an 18px glyph centered in
                  a 44px box, so (44−18)/2 of invisible whitespace pads its
                  side — without this the gaps read unequal. The +13px
                  right margin mirrors the endpoints when the Guide chip
                  is absent (Set N). */}
              <div
                aria-hidden
                className={classNames(
                  // h-3, up from h-2.5 — at 10px the bar read a touch
                  // frail next to the 44px chrome (Malik, 2026-08-19);
                  // the R=4 sprite caps still fit a 12px strip.
                  'qbar relative h-3 min-w-0 flex-1 -ml-[13px]',
                  !hasGuide && 'mr-[13px]'
                )}
                style={{ clipPath: MOBILE_BAR_CLIP }}
              >
                {/* The 500ms advance lives in `.qbar-fill` (globals.css)
                    as a --qp transition, not a width utility here: width
                    transitions between round() endpoints don't
                    interpolate — the property is what animates, and
                    round() re-quantizes it every frame. */}
                <div
                  className={classNames(
                    'qbar-fill h-full',
                    isMissFlashing && 'qbar-miss'
                  )}
                  style={
                    {
                      '--qp': `${progressFraction * 100}%`,
                      backgroundColor: 'var(--quiz-accent)',
                    } as React.CSSProperties
                  }
                />
              </div>
              {hasGuide && (
                <button
                  type='button'
                  onClick={() => setSnapKind('guide')}
                  aria-label='Open the reference guide'
                  className='qguide-btn h-11 w-11 shrink-0 justify-center !p-0'
                  style={{ clipPath: GUIDE_CHIP_CLIP }}
                >
                  <BookHeartIcon className='h-[18px] w-[18px]' />
                </button>
              )}
            </div>
            {/* In flow (not absolute) so it can never occlude the prompt when
                the open sheet narrows the card. Top-right placement maps the
                control to where the sheet appears (spatial correspondence). */}
            {hasGuide && (
              <div className='hidden justify-end lg:flex'>
                {/* Ink-glass sprite chip (R=12), book-heart, mono GUIDE —
                    the chrome piece that used to speak another product's
                    language (white chip, lucide icons), redesigned in the
                    system's own voice (docs/pixel-ui.md § Guide button). */}
                <button
                  type='button'
                  onClick={() => setIsGuideOpen((open) => !open)}
                  aria-expanded={isGuideOpen}
                  aria-controls='quiz-reference-pane'
                  className='qguide-btn'
                  style={{ clipPath: GUIDE_CHIP_CLIP }}
                >
                  <BookHeartIcon className='h-4 w-4' />
                  {isGuideOpen ? 'Hide guide' : 'Guide'}
                </button>
              </div>
            )}
            <div
              className={classNames(
                // `qcontainer` makes this the size container the prompt's
                // cqw type and the option grid's container query read —
                // the card narrows under the guide pane and on phones,
                // and viewport units would lie there.
                'qcontainer mx-auto w-full p-4 flex-1 flex flex-col justify-center',
                // Grid sets need the full canvas; list sets read as a
                // centered column at a comfortable measure, Typeform-style.
                isGridLayout ? 'max-w-screen-xl' : 'max-w-3xl'
              )}
            >
              {currentQuestion && (
                <div
                  key={currentQuestion.id}
                  ref={questionBlockRef}
                  className='motion-quiz-question flex flex-col md:justify-between gap-5 max-sm:flex'
                  data-motion={isQuestionLeaving ? 'leaving' : 'entered'}
                >
                  {/* On phones the argument pins while a long palette
                      (Set R runs ~2 screens) scrolls beneath — the fallacy
                      task means re-reading the argument per option, so it
                      must not leave with the scroll (Malik, 2026-08-19).
                      Desktop: display:contents, so md:justify-between still
                      sees three children. See `.qpin` in globals.css. */}
                  <div className='qpin'>
                    <Prompt value={currentQuestion.prompt} />

                    <div
                      className={
                        isGridLayout
                          ? classNames('w-full self-center', gridMaxWidth)
                          : ''
                      }
                    >
                      {/* The set's drill question, in the start screen's mono
                        eyebrow voice — the question screen reads as a
                        continuation of the start card, not a different app. */}
                      <h2 className='qheader'>{subSet.header}</h2>
                      {/* Multi-select is a MODE, and an unannounced mode is
                        where users make errors they can't diagnose. NOT
                        "select all that apply": the subset rule accepts ANY
                        genuine answer, so demanding all of them would
                        promise something the grader doesn't do. */}
                      {multiSelect && (
                        <p className='qmulti'>
                          More than one answer can be right — pick up to 3.
                        </p>
                      )}
                      {/* Reading order: question → attempt → response →
                        palette. The slot is always present and never moves
                        the options — see FeedbackSlot. */}
                      {currentQuestion && (
                        <FeedbackSlot
                          question={currentQuestion}
                          liveHint={liveHint}
                          liveAnswer={liveAnswer}
                          motionKey={`${currentQuestion.id}-${previousGuesses.length}-${
                            showSolution ? 'sol' : 'try'
                          }-${liveHintOption?.id ?? 'answer'}`}
                        />
                      )}
                    </div>
                  </div>

                  <div
                    ref={optionsGridRef}
                    onScroll={handleOptionsScroll}
                    className={
                      isGridLayout
                        ? // Column-major (options read down each column),
                          // matching the original 2008 answer grid. Capped
                          // width + centered so the options aren't full-bleed.
                          classNames(
                            'qoptions-grid gap-3 w-full self-center',
                            gridMaxWidth
                          )
                        : 'flex flex-col gap-4'
                    }
                    style={
                      isGridLayout ? optionGridVars(optionCount) : undefined
                    }
                  >
                    {currentQuestion.options.map((option, index) => (
                      <Option
                        key={option.id}
                        index={index + 1}
                        showIndex
                        immersive
                        compact={isGridLayout}
                        abbreviation={option.abbreviation}
                        isSelected={
                          multiSelect
                            ? selectedOptionIds.includes(option.id)
                            : index === selectedOptionIndex
                        }
                        // Keyboard-only: the cursor answers "where the
                        // arrow keys are", which a finger doesn't ask.
                        isCursor={
                          multiSelect &&
                          index === selectedOptionIndex &&
                          lastInput === 'keyboard'
                        }
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
                          haptic('selection');
                          setLastInput('pointer');
                          selectOption(index);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Desktop's separator between the content and the in-card
                controls. Below `lg` the controls live in the sheet,
                whose own 2px top rule already divides them — this was a
                second divider, and the scrolling one of the two (Malik,
                2026-08-08; the lab found the same on its phone frame). */}
            <hr className='hidden lg:block h-px my-4 bg-gray-200 border-0' />
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
                  firstAbbreviation={currentQuestion?.options[0]?.abbreviation}
                  lastAbbreviation={
                    currentQuestion?.options[currentQuestion.options.length - 1]
                      ?.abbreviation
                  }
                  twoDimensional={isGridLayout}
                  multiSelect={multiSelect}
                />
              </div>
              <div className='flex shrink-0 items-center gap-5'>
                {/* Same voice and colour as the start screen's points
                    line — the same information, one screen later. */}
                <span className='qcount tabular-nums'>
                  {progressLabel(mode, questionCounter, scoreState.score)}
                </span>
                {/* Adaptive ink, matching the start screen CTA: the
                    button borrows the set's foreground as its fill and
                    the surface as its label, so it clears contrast on
                    every palette. Gem silhouette per the Primary button
                    dial's working default. */}
                {showSolution ? (
                  <GemButton
                    containerClassName='w-52'
                    disabled={isQuestionLeaving}
                    onClick={handleNextQuestionTransition}
                    style={{
                      backgroundColor: 'var(--quiz-fg)',
                      color: 'var(--quiz-surface)',
                    }}
                  >
                    Next Question
                  </GemButton>
                ) : (
                  <GemButton
                    containerClassName='w-52'
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
                  >
                    Check Answer
                  </GemButton>
                )}
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
              {/* The branded white sheet (the lab's panel grammar without
                  its surface colour — REJECTED by Malik 2026-08-08: an
                  inked panel moved the focus from the quiz): stair-
                  stepped left corners, a 2px edge rule that follows the
                  stairs (two stacked clips — see SHEET_OUTER_CLIP), the
                  sprite ✕ chip, the REFERENCE mono eyebrow, and a pixel
                  resize grip. */}
              <DrawerContent
                side='right'
                id='quiz-reference-pane'
                className='hidden rounded-none border-0 bg-gray-200 lg:flex'
                style={
                  {
                    width: paneWidth,
                    clipPath: SHEET_OUTER_CLIP,
                    // The accent ALONE rides in (never the surface — the
                    // sheet stays white, decided 2026-08-08): the guide's
                    // chips, code column and emphasis mark read it for
                    // hierarchy.
                    '--quiz-accent': quizAccent,
                  } as React.CSSProperties
                }
              >
                <div
                  className='flex h-full w-full flex-col bg-background'
                  style={{ clipPath: SHEET_INNER_CLIP }}
                >
                  <div
                    role='separator'
                    aria-orientation='vertical'
                    aria-label='Resize the reference guide'
                    onPointerDown={startPaneResize}
                    className='group absolute inset-y-0 left-0 z-10 flex w-4 cursor-col-resize items-center justify-center'
                  >
                    <div
                      className='h-24 w-2 bg-muted transition-colors group-hover:bg-gray-300'
                      style={{ clipPath: GRIP_CLIP }}
                    />
                  </div>
                  <div className='flex h-14 shrink-0 items-center justify-between border-b border-gray-100 pl-7 pr-4'>
                    {/* Same eyebrow voice as the card's header — the panel
                        answers the GUIDE chip in kind. */}
                    <DrawerTitle className='font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-gray-600'>
                      Reference
                    </DrawerTitle>
                    <DrawerDescription className='sr-only'>
                      The well-formed formula guide for this exercise set. Drag
                      the left edge to resize.
                    </DrawerDescription>
                    <button
                      type='button'
                      onClick={() => setIsGuideOpen(false)}
                      aria-label='Close reference guide'
                      className='qguide-close inline-flex h-8 w-8 shrink-0 items-center justify-center'
                      style={{ clipPath: CLOSE_CHIP_CLIP }}
                    >
                      <TimesIcon className='h-3 w-3' />
                    </button>
                  </div>
                  {/* Container-queried so the guide's columns and heading
                      sizes follow the sheet's current width (it's
                      resizable), not the viewport — single-column when
                      narrow, opening up as the user drags it wider. */}
                  <div className='@container min-h-0 flex-1 overflow-y-auto pl-7 pr-6 py-6 flex flex-col gap-10 select-text'>
                    <WffGuide subSet={subSet} />
                  </div>
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
          snapPoints={[...(hasGuide ? guideSnapPoints : noGuideSnapPoints)]}
          activeSnapPoint={hasGuide ? snap : collapsedSnapPoint}
          setActiveSnapPoint={(value) =>
            setSnapKind(
              hasGuide ? snapKindOf(value, collapsedSnapPoint) : 'collapsed'
            )
          }
        >
          <DrawerContent
            ref={drawerRef}
            disableOpenAnimation
            className='quiz-controls-drawer fixed flex flex-col overflow-hidden border-0 rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px] lg:hidden'
            style={
              {
                '--initial-transform': drawerInitialTransform,
                // The controls sheet follows the set's colour scheme
                // (Malik, 2026-08-08) — the lab's mobile footer spec:
                // surface fill, ink-tint top rule, adaptive-ink CTA. All
                // three vars ride in, so the guide inside the expanded
                // sheet inks itself too (this is the CONTROLS surface —
                // the desktop REFERENCE pane stays white by decision).
                backgroundColor: quizSurface,
                color: quizForeground,
                borderTop:
                  '2px solid color-mix(in srgb, var(--quiz-fg) 12%, transparent)',
                '--quiz-surface': quizSurface,
                '--quiz-fg': quizForeground,
                '--quiz-accent': quizAccent,
              } as React.CSSProperties
            }
            onGrabberClick={
              hasGuide
                ? () => setSnapKind(nextSnapKind(snapKind, hasFullSnap))
                : undefined
            }
          >
            {/* The explicit way DOWN (decided 2026-08-22): the grabber
                cycle is forward-only — HIG's own tap-to-cycle — so
                without this the only route back from the guide was a
                drag. M3 requires a collapse affordance at full height;
                Stocks' symbol card is the visual precedent. Same chip
                grammar as the desktop pane's ✕. */}
            {hasGuide && (
              <button
                type='button'
                onClick={() => setSnapKind('collapsed')}
                aria-label='Close the reference guide'
                className='qsheet-x'
                data-visible={isGuideExpanded || undefined}
                style={{ clipPath: CLOSE_CHIP_CLIP }}
              >
                <TimesIcon className='h-[14px] w-[14px]' />
              </button>
            )}
            <DrawerHeader>
              <DrawerTitle className='sr-only'>
                Quiz controls and reference guide
              </DrawerTitle>
              <DrawerDescription className='sr-only'>
                Keyboard shortcuts, quiz progress, answer actions, and the
                well-formed formula guide.
              </DrawerDescription>
              {/* The CTA↔title MORPH (decided 2026-08-22, sheet-lab):
                  the collapsed sheet is a footer, the expanded sheet is
                  a reader — user testing found the CTA riding up with
                  the sheet confusing, so the two states swap in one
                  grid cell (opacity + blur crossfade; see .qsheet-head
                  in globals.css). Both layers stay mounted; the hidden
                  one leaves the tab order via delayed visibility. */}
              <div
                className='qsheet-head'
                data-head={isGuideExpanded ? 'reader' : 'cta'}
              >
                <div className='qsheet-reader'>Reference guide</div>
                {/* Content-sized, not h-24: a fixed row height was half the
                  collapsed sheet's dead space. The bottom inset keeps the
                  CTA off the gesture pill — the sheet's surface still
                  runs under it, which is what colours the bar. */}
                <div className='qsheet-cta left-0 z-50 w-full flex items-center justify-center pb-[env(safe-area-inset-bottom)] md:justify-between'>
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
                  <div className='flex justify-between gap-5 items-center h-full align-bottom font-medium flex-col md:flex-row w-full md:w-fit'>
                    {!showStartScreen && !showEndScreen && (
                      // On phones the sticky header row's bar is the progress
                      // reading, so the number would crowd the full-width
                      // CTA — but it stays in the accessibility tree as the
                      // bar's accessible reading.
                      <div className='sr-only tabular-nums md:not-sr-only md:flex'>
                        {progressLabel(mode, questionCounter, scoreState.score)}
                      </div>
                    )}
                    <div className='flex h-max w-full md:w-fit'>
                      {/* Full-width gem CTA — the collapsed sheet models the
                        mobile footer, and the primary action fills the row
                        (Duolingo's CHECK, Brilliant's Continue). */}
                      {/* Adaptive ink on the set-coloured sheet, same as
                        the desktop footer CTAs. */}
                      {!showSolution && !showStartScreen && !showEndScreen && (
                        <GemButton
                          containerClassName='w-full md:w-52'
                          className='hover:opacity-90'
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
                        >
                          Check Answer
                        </GemButton>
                      )}
                      {showSolution && (
                        <GemButton
                          containerClassName='w-full md:w-52'
                          className='hover:opacity-90'
                          disabled={isQuestionLeaving}
                          onClick={handleNextQuestionTransition}
                          style={{
                            backgroundColor: 'var(--quiz-fg)',
                            color: 'var(--quiz-surface)',
                          }}
                        >
                          Next Question
                        </GemButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DrawerHeader>

            {/* Always MOUNTED, revealed by opacity (data-open): the
                content-fit snap needs the guide's height before the
                first expansion, so the old expand-gated render became a
                chicken-and-egg. Set R's dynamic chunk now loads with
                the page instead of on first expand — the same modules
                are already warm from the set's own generator chunk
                (see setRGuide.tsx). */}
            {hasGuide && (
              <div
                ref={setGuideScrollEl}
                data-open={isGuideExpanded || undefined}
                className='qsheet-guide @container overflow-y-auto flex flex-col gap-10 mx-4 md:mx-8 pb-8 text-base leading-7 text-gray-600 select-text'
                style={{ maxHeight: guideContentMaxHeight(snap) }}
              >
                {/* Plain wrapper = the measurable content box (see the
                    ResizeObserver above). */}
                <div>
                  <WffGuide subSet={subSet} />
                </div>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
