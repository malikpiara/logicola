import classNames from 'classnames';
import { M_PLUS_1 } from 'next/font/google';
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
    const className = classNames(
      'w-full ps-4 text-primary flex items-center border rounded-lg focus:outline-primary',
      !isActive && 'border-stone-200',
      showSolution && (isCorrect ? 'bg-green-100' : 'border-rose-200'),
      !showSolution && isActive && 'border-primary border-2'
    );

    return (
      <button
        ref={ref}
        index={index}
        onClick={onClick}
        className={className}
        onKeyDown={onKeyDown}
      >
        <div className='flex items-center align-middle gap-3'>
          <div className='rounded-full border-2 flex wrap w-8 h-8 items-center align-middle self-center'>
            <div className='items-center self-center font-medium w-full text-stone-900'>
              {index}
            </div>
          </div>
          <div className='py-4 ms-2 font-medium text-stone-900'>{label}</div>
        </div>
      </button>
    );
  }
);

Option.displayName = 'Option'; // Add display name here

export default Option;
