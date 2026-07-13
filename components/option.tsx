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
    },
    ref
  ) => {
    const optionClasses = classNames(
      'motion-option w-full cursor-pointer ps-4 pe-4 text-left text-base leading-6 text-gray-900 flex items-start border rounded-lg focus:outline-primary',
      {
        'border-gray-200': !isSelected && !showSolution,
        'bg-[#1ad85f]': showSolution && isCorrect,
        'border-rose-200 text-red-500':
          (showSolution && !isCorrect) || hasBeenIncorrectlyGuessed,
        'border-primary outline-double outline-primary outline-offset-0 ring-2 ring-offset-0 ring-primary':
          !showSolution && isSelected,
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
                'rounded-full border-2 flex w-8 h-8 shrink-0 items-center self-start justify-center mt-3.5 tabular-nums',
                showSolution && isCorrect && 'border-gray-700',
                showSolution && !isCorrect && 'border-red-500'
              )}
            >
              <div
                className={classNames(
                  'font-medium leading-none text-center text-gray-900',
                  showSolution && !isCorrect && 'text-red-500'
                )}
              >
                {index}
              </div>
            </div>
          )}
          <div className='py-4 ms-2 font-medium'>
            <KatexSpan text={label} />
          </div>
        </div>
      </button>
    );
  }
);

Option.displayName = 'Option'; // Add display name here

export default Option;
