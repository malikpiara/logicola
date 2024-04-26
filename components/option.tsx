import classNames from 'classnames';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

export interface OptionProps extends React.HTMLProps<HTMLButtonElement> {
  index?: number;
  showIndex?: boolean;
  label: string;
  isSelected: boolean;
  isCorrect: boolean;
  showSolution: boolean;
  onSelect: () => void;
  keyboardShortcut: string;
}

const Option: React.FC<OptionProps> = ({
  index,
  showIndex,
  label,
  isSelected,
  isCorrect,
  showSolution,
  onSelect,
  keyboardShortcut,
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

  useHotkeys(keyboardShortcut, () => {
    if (showSolution) return;
    onSelect();
    (document.activeElement as HTMLElement)?.blur();
  });

  return (
    <button
      onClick={onSelect}
      {...props}
      type='button'
      className={optionClasses}
    >
      <div className='flex items-center gap-3 align-middle'>
        {showIndex && (
          <div
            className={classNames(
              'wrap flex h-8 w-8 items-center self-center rounded-full border-2 align-middle',
              showSolution && isCorrect && 'border-gray-700',
              showSolution && !isCorrect && 'border-red-500'
            )}
          >
            <div
              className={classNames(
                'w-full items-center self-center font-medium text-gray-900',
                showSolution && !isCorrect && 'text-red-500'
              )}
            >
              {index}
            </div>
          </div>
        )}
        <div className='ms-2 py-4 font-medium'>{label}</div>
      </div>
    </button>
  );
};

Option.displayName = 'Option'; // Add display name here

export default Option;
