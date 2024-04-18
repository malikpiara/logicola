import classNames from 'classnames';
import React from 'react';

export interface OptionProps extends React.HTMLProps<HTMLButtonElement> {
  index?: number;
  showIndex?: boolean;
  label: string;
  isSelected: boolean;
  isCorrect: boolean;
  showSolution: boolean;
  onClick: () => void;
}

const Option: React.FC<OptionProps> = ({
  index,
  showIndex,
  label,
  isSelected,
  isCorrect,
  showSolution,
  onClick,
  ...props
}) => {
  const optionClasses = classNames(
    'w-full ps-4 text-gray-900 flex items-center border rounded-lg focus:outline-green-600 transition-colors duration-300',
    {
      'border-gray-200': !isSelected && !showSolution,
      'cursor-not-allowed': showSolution,
      'bg-[#1ad85f]': showSolution && isCorrect,
      'border-rose-200 text-red-500': showSolution && !isCorrect,
      'border-green-600 outline-double outline-green-600 outline-offset-0 ring-2 ring-offset-0 ring-green-600':
        !showSolution && isSelected,
      'hover:border-green-600 focus:border-green-600': !showSolution,
    }
  );

  return (
    <button
      {...props}
      type='button'
      onClick={onClick}
      className={optionClasses}
    >
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
        <div className='py-4 ms-2 font-medium'>{label}</div>
      </div>
    </button>
  );
};

Option.displayName = 'Option'; // Add display name here

export default Option;
