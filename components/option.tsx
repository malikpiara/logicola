import classNames from 'classnames';
import React from 'react';
import KatexSpan from './katexSpan';

export interface OptionProps {
  ref?: React.Ref<HTMLButtonElement>;
  index?: number;
  showIndex?: boolean;
  label: React.ReactNode; // Allow label to be string or rendered content
  isSelected: boolean;
  isCorrect: boolean;
  showSolution: boolean;
  onClick: () => void;
  hasBeenIncorrectlyGuessed?: boolean;
  /** Tighter paddings and smaller type, for grid-layout subsets. */
  compact?: boolean;
  /** Typeable code shown as the prefix instead of the index (e.g. 'ah'). */
  abbreviation?: string;
  /**
   * Keyboard cursor is on this option (multi-select, where the cursor is
   * distinct from the committed selection). Renders a lighter highlight
   * than `isSelected` so "where I am" reads apart from "what I've picked".
   */
  isCursor?: boolean;
}

/**
 * One answer option. A single visual language across every set — a quiet
 * mono prefix (the option's number, or its typeable code on abbreviation
 * sets) before a regular-weight label, with a magenta tint marking the
 * selection — in two sizes: `compact` for the 18-option grids, roomy for
 * the classic four-option lists.
 */
const Option = React.forwardRef<HTMLButtonElement, OptionProps>(
  (
    {
      index,
      showIndex,
      label,
      isSelected,
      isCorrect,
      showSolution,
      onClick,
      hasBeenIncorrectlyGuessed = false,
      compact = false,
      abbreviation,
      isCursor = false,
    },
    ref
  ) => {
    const optionClasses = classNames(
      'motion-option w-full cursor-pointer ps-4 pe-4 text-left text-base leading-6 text-gray-900 flex items-start border rounded-xl focus:outline-fuchsia-500',
      {
        'border-gray-200': !isSelected && !showSolution,
        'bg-[#1ad85f]': showSolution && isCorrect,
        'border-rose-200 text-red-500':
          (showSolution && !isCorrect) || hasBeenIncorrectlyGuessed,
        // The selection tint stays legible even with several options
        // picked at once (multi-select grids).
        'border-fuchsia-500 bg-fuchsia-50': !showSolution && isSelected,
        // Cursor-only (multi-select keyboard focus): lighter than a pick.
        'border-fuchsia-300': !showSolution && !isSelected && isCursor,
        'hover:border-fuchsia-300 focus:border-fuchsia-400': !showSolution,
      }
    );

    // The mono prefix turns magenta when picked, red when ruled out.
    const prefixColor = showSolution
      ? isCorrect
        ? 'text-gray-800'
        : 'text-red-400'
      : isSelected
        ? 'text-fuchsia-700'
        : 'text-gray-400';

    return (
      <button
        type='button'
        ref={ref}
        onClick={onClick}
        className={optionClasses}
        aria-pressed={isSelected}
        data-solution={showSolution ? 'shown' : 'hidden'}
      >
        <div
          className={classNames(
            'flex items-baseline',
            compact ? 'gap-2.5' : 'gap-3'
          )}
        >
          {showIndex && (
            <span
              className={classNames(
                'shrink-0 font-mono lowercase tabular-nums',
                compact ? 'text-xs' : 'text-sm',
                prefixColor
              )}
            >
              {abbreviation ?? index}
            </span>
          )}
          <div
            className={
              compact
                ? 'py-3.5 text-sm leading-5 font-normal'
                : 'py-4 font-normal'
            }
          >
            <KatexSpan text={label} />
          </div>
        </div>
      </button>
    );
  }
);

Option.displayName = 'Option'; // Add display name here

export default Option;
