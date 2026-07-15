import { Question } from '@/content/types';
import { useEffect, useEffectEvent, useRef } from 'react';

/** How long a partially-typed abbreviation stays alive before resetting. */
const ABBREVIATION_BUFFER_MS = 1000;

interface UseKeyboardNavigationProps {
  currentQuestion: Question | undefined; // Not sure if it's a string?
  showStartScreen: boolean;
  showSolution: boolean;
  selectedOptionIndex: number | null;
  onShowStartScreen: () => void;
  selectNextOption: () => void;
  selectPreviousOption: () => void;
  selectOption: (index: number) => void;
  /** Move the focus cursor to an arbitrary index without toggling it. */
  moveCursor: (index: number) => void;
  handleCheckAnswer: () => void;
  handleNextQuestion: () => void;
  /** Optional: collapse / dismiss the bottom drawer. Bound to Escape. */
  collapseDrawer?: () => void;
  /**
   * Live column count of a grid-laid-out option list (Set R). When
   * provided, Left/Right move between columns; without it (single-column
   * lists) horizontal arrows are inert. Read from the DOM at press time
   * so it stays correct across responsive breakpoints.
   */
  getGridColumns?: () => number;
  /**
   * The option list is multi-select (Set R). Space then toggles the
   * option under the cursor; Enter still submits.
   */
  multiSelect?: boolean;
}

const useKeyboardNavigation = ({
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
  handleNextQuestion,
  collapseDrawer,
  getGridColumns,
  multiSelect,
}: UseKeyboardNavigationProps) => {
  const abbreviationBufferRef = useRef('');
  const abbreviationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  function resetAbbreviationBuffer() {
    abbreviationBufferRef.current = '';
    if (abbreviationTimeoutRef.current) {
      clearTimeout(abbreviationTimeoutRef.current);
      abbreviationTimeoutRef.current = null;
    }
  }

  /**
   * Type-to-select for subsets whose options carry `abbreviation` codes
   * (Set R's fallacy grid — "type its abbreviation" in the 2008
   * original). Letters accumulate in a short-lived buffer; an exact
   * match selects the option. A prefix that can't complete restarts the
   * buffer with the pressed key so a typo never dead-ends.
   */
  function handleAbbreviationKey(question: Question, key: string): boolean {
    if (!question.options.some((option) => option.abbreviation)) {
      return false;
    }

    const buffer = abbreviationBufferRef.current + key;
    const matchIndex = question.options.findIndex(
      (option) => option.abbreviation === buffer
    );
    const isViablePrefix = question.options.some((option) =>
      option.abbreviation?.startsWith(buffer)
    );

    if (matchIndex !== -1) {
      resetAbbreviationBuffer();
      selectOption(matchIndex);
      return true;
    }

    abbreviationBufferRef.current = isViablePrefix ? buffer : key;
    if (abbreviationTimeoutRef.current) {
      clearTimeout(abbreviationTimeoutRef.current);
    }
    abbreviationTimeoutRef.current = setTimeout(
      resetAbbreviationBuffer,
      ABBREVIATION_BUFFER_MS
    );
    return true;
  }

  /**
   * Move the selection one column left/right in a column-major grid.
   * The grid fills top-to-bottom then left-to-right, so a horizontal
   * step is ±(rows per column) in option order. Natural mapping: the
   * 2D grid answers to 2D arrow keys, not just up/down.
   */
  function moveByColumn(question: Question, direction: 1 | -1): boolean {
    if (!getGridColumns) return false;
    const total = question.options.length;
    if (selectedOptionIndex == null) {
      moveCursor(0);
      return true;
    }
    const columns = Math.max(1, getGridColumns());
    const rowsPerColumn = Math.ceil(total / columns);
    const target = selectedOptionIndex + direction * rowsPerColumn;
    if (target >= 0 && target < total) {
      moveCursor(target);
    }
    return true;
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!currentQuestion) return;

    if (
      /^[a-z]$/i.test(event.key) &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey &&
      handleAbbreviationKey(currentQuestion, event.key.toLowerCase())
    ) {
      event.preventDefault();
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectNextOption();
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectPreviousOption();
        break;
      case 'ArrowRight':
        if (moveByColumn(currentQuestion, 1)) event.preventDefault();
        break;
      case 'ArrowLeft':
        if (moveByColumn(currentQuestion, -1)) event.preventDefault();
        break;
      case ' ':
        // Multi-select: Space toggles the option under the cursor
        // (arrow keys only move the cursor; Enter submits).
        if (multiSelect && selectedOptionIndex != null) {
          event.preventDefault();
          selectOption(selectedOptionIndex);
        }
        break;
      case 'Escape':
        if (collapseDrawer) {
          event.preventDefault();
          collapseDrawer();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (showStartScreen) {
          onShowStartScreen();
          break;
        }
        if (!showStartScreen && !showSolution && selectedOptionIndex != null) {
          handleCheckAnswer();
          break;
        }
        if (showSolution) {
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
      case '8':
      case '9': {
        // Abbreviation subsets label their badges with codes, not
        // numbers — a hidden digit mapping would be unlabeled behavior.
        if (currentQuestion.options.some((option) => option.abbreviation)) {
          break;
        }
        const idx = parseInt(event.key) - 1;
        if (idx >= currentQuestion.options.length) break;
        event.preventDefault();
        selectOption(idx);
        break;
      }
      default:
        break;
    }
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      onKeyDown(event);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (abbreviationTimeoutRef.current) {
        clearTimeout(abbreviationTimeoutRef.current);
      }
    };
  }, []);
};

export default useKeyboardNavigation;
