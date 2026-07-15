/**
 * Keyboard-navigation tests for abbreviation type-to-select.
 *
 * Subsets whose options carry `abbreviation` codes (Set R's fallacy
 * grid) let the user type the two-letter code to select an option —
 * the 2008 original's "click a fallacy or type its abbreviation".
 * Digit shortcuts are disabled on those subsets (their badges show
 * codes, not numbers) and stay active everywhere else.
 */

import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useKeyboardNavigation from './useKeyboardNavigation';
import type { Question } from '@/content/types';

const abbreviationQuestion: Question = {
  id: 'gen.R.test.0',
  prompt: '',
  options: [
    { id: 0, label: 'Appeal to authority', abbreviation: 'aa' },
    { id: 1, label: 'Appeal to the crowd', abbreviation: 'ac' },
    { id: 2, label: 'Ad hominem', abbreviation: 'ah' },
    { id: 3, label: 'Straw man', abbreviation: 'sm' },
  ],
  correctId: [0],
  answer: '',
};

const numericQuestion: Question = {
  id: 'plain.0',
  prompt: '',
  options: [
    { id: 0, label: 'One' },
    { id: 1, label: 'Two' },
    { id: 2, label: 'Three' },
  ],
  correctId: [0],
  answer: '',
};

function setup(
  currentQuestion: Question,
  overrides: {
    selectedOptionIndex?: number | null;
    getGridColumns?: () => number;
    multiSelect?: boolean;
  } = {}
) {
  const selectOption = vi.fn();
  const moveCursor = vi.fn();
  const noop = () => {};
  renderHook(() =>
    useKeyboardNavigation({
      currentQuestion,
      showStartScreen: false,
      showSolution: false,
      selectedOptionIndex: overrides.selectedOptionIndex ?? null,
      onShowStartScreen: noop,
      selectNextOption: noop,
      selectPreviousOption: noop,
      selectOption,
      moveCursor,
      handleCheckAnswer: noop,
      handleNextQuestion: noop,
      getGridColumns: overrides.getGridColumns,
      multiSelect: overrides.multiSelect,
    })
  );
  return { selectOption, moveCursor };
}

const gridQuestion: Question = {
  id: 'gen.R.grid.0',
  prompt: '',
  // 18 options, column-major like Set R.
  options: Array.from({ length: 18 }, (_, id) => ({
    id,
    label: `Option ${id}`,
    abbreviation: `x${id}`,
  })),
  correctId: [0],
  answer: '',
};

function press(key: string) {
  window.dispatchEvent(new KeyboardEvent('keydown', { key }));
}

describe('useKeyboardNavigation — abbreviation type-to-select', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('selects the option whose abbreviation is typed', () => {
    const { selectOption } = setup(abbreviationQuestion);
    press('a');
    press('h');
    expect(selectOption).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('distinguishes codes sharing a first letter', () => {
    const { selectOption } = setup(abbreviationQuestion);
    press('a');
    press('a');
    expect(selectOption).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('recovers from a dead-end prefix by restarting the buffer', () => {
    const { selectOption } = setup(abbreviationQuestion);
    press('x'); // no code starts with x
    press('s');
    press('m');
    expect(selectOption).toHaveBeenCalledExactlyOnceWith(3);
  });

  it('expires a partial code after the buffer timeout', () => {
    const { selectOption } = setup(abbreviationQuestion);
    press('a');
    vi.advanceTimersByTime(1100);
    press('h'); // 'h' alone matches nothing — the earlier 'a' must be gone
    expect(selectOption).not.toHaveBeenCalled();
    press('a');
    press('h');
    expect(selectOption).toHaveBeenCalledExactlyOnceWith(2);
  });

  it('ignores digit keys when abbreviations are active', () => {
    const { selectOption } = setup(abbreviationQuestion);
    press('1');
    expect(selectOption).not.toHaveBeenCalled();
  });

  it('keeps digit selection on plain numeric questions', () => {
    const { selectOption } = setup(numericQuestion);
    press('2');
    expect(selectOption).toHaveBeenCalledExactlyOnceWith(1);
    press('a'); // letters do nothing without abbreviations
    expect(selectOption).toHaveBeenCalledTimes(1);
  });
});

describe('useKeyboardNavigation — 2D grid arrow navigation', () => {
  function pressArrow(key: 'ArrowLeft' | 'ArrowRight') {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }));
  }

  it('moves the cursor one column right (column-major: +rows)', () => {
    const { moveCursor, selectOption } = setup(gridQuestion, {
      selectedOptionIndex: 0,
      getGridColumns: () => 3, // 18 / 3 = 6 rows per column
    });
    pressArrow('ArrowRight');
    // Arrows move the cursor only — they must NOT toggle a selection.
    expect(moveCursor).toHaveBeenCalledExactlyOnceWith(6);
    expect(selectOption).not.toHaveBeenCalled();
  });

  it('moves the cursor one column left', () => {
    const { moveCursor } = setup(gridQuestion, {
      selectedOptionIndex: 6,
      getGridColumns: () => 3,
    });
    pressArrow('ArrowLeft');
    expect(moveCursor).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('stays put at the grid edges (no wrap)', () => {
    const rightEdge = setup(gridQuestion, {
      selectedOptionIndex: 12, // last column
      getGridColumns: () => 3,
    });
    pressArrow('ArrowRight');
    expect(rightEdge.moveCursor).not.toHaveBeenCalled();

    const leftEdge = setup(gridQuestion, {
      selectedOptionIndex: 3, // first column
      getGridColumns: () => 3,
    });
    pressArrow('ArrowLeft');
    expect(leftEdge.moveCursor).not.toHaveBeenCalled();
  });

  it('moves the cursor to the first option when nothing is selected yet', () => {
    const { moveCursor } = setup(gridQuestion, {
      selectedOptionIndex: null,
      getGridColumns: () => 3,
    });
    pressArrow('ArrowRight');
    expect(moveCursor).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('is inert in a single column (mobile) — no horizontal movement', () => {
    const { moveCursor } = setup(gridQuestion, {
      selectedOptionIndex: 0,
      getGridColumns: () => 1, // 18 rows, one column
    });
    pressArrow('ArrowRight');
    pressArrow('ArrowLeft');
    expect(moveCursor).not.toHaveBeenCalled();
  });

  it('ignores horizontal arrows when the list is not a grid', () => {
    const { moveCursor } = setup(numericQuestion, {
      selectedOptionIndex: 0,
    });
    pressArrow('ArrowRight');
    pressArrow('ArrowLeft');
    expect(moveCursor).not.toHaveBeenCalled();
  });
});

describe('useKeyboardNavigation — multi-select Space toggle', () => {
  function pressSpace() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  }

  it('toggles the option under the cursor on Space', () => {
    const { selectOption } = setup(gridQuestion, {
      selectedOptionIndex: 4,
      multiSelect: true,
    });
    pressSpace();
    expect(selectOption).toHaveBeenCalledExactlyOnceWith(4);
  });

  it('does nothing on Space without a cursor', () => {
    const { selectOption } = setup(gridQuestion, {
      selectedOptionIndex: null,
      multiSelect: true,
    });
    pressSpace();
    expect(selectOption).not.toHaveBeenCalled();
  });

  it('does not toggle on Space in single-select lists', () => {
    const { selectOption } = setup(numericQuestion, {
      selectedOptionIndex: 1,
      multiSelect: false,
    });
    pressSpace();
    expect(selectOption).not.toHaveBeenCalled();
  });
});
