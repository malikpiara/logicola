import classNames from 'classnames';
import React from 'react';

export interface OptionProps {
  ref?: React.Ref<HTMLButtonElement>;
  index?: number;
  label: string;
  isActive: boolean;
  isCorrect: boolean;
  showSolution: boolean;

  onClick: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const Option = React.forwardRef<HTMLButtonElement, OptionProps>(
  (
    { index, label, isActive, isCorrect, showSolution, onClick, onKeyDown },
    ref
  ) => {
    const optionClasses = classNames(
      'w-full ps-4 text-gray-900 flex items-center border rounded-lg focus:outline-primary transition-colors duration-300',
      {
        'border-gray-200': !isActive && !showSolution,
        'bg-green-200': showSolution && isCorrect,
        'border-rose-200 text-red-500 cursor-not-allowed':
          showSolution && !isCorrect,
        'border-primary border-2': !showSolution && isActive,
        'hover:border-primary focus:border-primary': !showSolution,
      }
    );

    return (
      <button
        ref={ref}
        onClick={onClick}
        className={optionClasses}
        onKeyDown={onKeyDown}
      >
        <div className='flex items-center align-middle gap-3'>
          <div className='rounded-full border-2 flex wrap w-8 h-8 items-center align-middle self-center'>
            <div className='items-center self-center font-medium w-full text-gray-900'>
              {index}
            </div>
          </div>
          <div className='py-4 ms-2 font-medium'>{label}</div>
        </div>
      </button>
    );
  }
);

Option.displayName = 'Option'; // Add display name here

export default Option;
