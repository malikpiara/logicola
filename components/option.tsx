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
  /** Tighter paddings and a smaller index badge, for grid-layout subsets. */
  compact?: boolean;
  /** Typeable code shown in the badge instead of the index (e.g. 'ah'). */
  abbreviation?: string;
  /**
   * Keyboard cursor is on this option (multi-select, where the cursor is
   * distinct from the committed selection). Renders a lighter highlight
   * than `isSelected` so "where I am" reads apart from "what I've picked".
   */
  isCursor?: boolean;
}

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
      'motion-option w-full cursor-pointer ps-4 pe-4 text-left text-base leading-6 text-gray-900 flex items-start border rounded-xl focus:outline-primary',
      {
        'border-gray-200': !isSelected && !showSolution,
        'bg-[#1ad85f]': showSolution && isCorrect,
        'border-rose-200 text-red-500':
          (showSolution && !isCorrect) || hasBeenIncorrectlyGuessed,
        'border-primary outline-double outline-primary outline-offset-0 ring-2 ring-offset-0 ring-primary':
          !showSolution && isSelected,
        // Cursor-only (not yet picked): a lighter ring so it's clearly the
        // keyboard focus, not a committed selection.
        'border-primary ring-1 ring-primary':
          !showSolution && !isSelected && isCursor,
        'hover:border-primary focus:border-primary': !showSolution,
      }
    );

    return (
      <button
        type='button'
        ref={ref}
        onClick={onClick}
        className={optionClasses}
        aria-pressed={isSelected}
        data-solution={showSolution ? 'shown' : 'hidden'}
      >
        <div className='flex items-start gap-3'>
          {showIndex && (
            <div
              className={classNames(
                'rounded-full border-2 flex shrink-0 items-center self-start justify-center tabular-nums',
                compact ? 'w-6 h-6 mt-3.5 text-xs' : 'w-8 h-8 mt-3.5',
                showSolution && isCorrect && 'border-gray-700',
                showSolution && !isCorrect && 'border-red-500'
              )}
            >
              <div
                className={classNames(
                  'font-medium leading-none text-center text-gray-900',
                  abbreviation && 'font-mono lowercase',
                  showSolution && !isCorrect && 'text-red-500'
                )}
              >
                {abbreviation ?? index}
              </div>
            </div>
          )}
          <div
            className={classNames(
              // Grid options (Set R) read a touch stronger — semibold at
              // the same size keeps the label crisp without more wrapping.
              compact
                ? 'py-3.5 ms-1 text-sm leading-5 font-semibold'
                : 'py-4 ms-2 font-medium'
            )}
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
