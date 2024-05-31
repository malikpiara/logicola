import classNames from 'classnames';
import React from 'react';
import KatexSpan from './katexSpan';

export interface OptionProps {
  ref?: React.Ref<HTMLButtonElement>;
  index?: number;
  showIndex?: boolean;
  label: string | JSX.Element; // Allow label to be string or JSX
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
      'w-full ps-4 text-gray-900 flex items-center border rounded-lg focus:outline-primary transition-colors duration-300',
      {
        'border-gray-200': !isSelected && !showSolution,
        'cursor-not-allowed': showSolution,
        'bg-[#1ad85f]': showSolution && isCorrect,
        'border-rose-200 text-red-500':
          (showSolution && !isCorrect) || hasBeenIncorrectlyGuessed,
        'border-primary outline-double outline-primary outline-offset-0 ring-2 ring-offset-0 ring-primary':
          !showSolution && isSelected,
        'hover:border-primary focus:border-primary': !showSolution,
      }
    );

    return (
      <button ref={ref} onClick={onClick} className={optionClasses}>
        <div className='flex items-center align-middle gap-3'>
          {showIndex && (
            <div
              className={classNames(
                'rounded-full border-2 flex wrap w-8 h-8 items-center align-middle self-center',
                showSolution && isCorrect && 'border-gray-700',
                showSolution && !isCorrect && 'border-red-500'
              )}
            >
              <div
                className={classNames(
                  'items-center self-center font-medium w-full text-gray-900',
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
