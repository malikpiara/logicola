import classNames from 'classnames';

export interface OptionProps {
  label: string;
  isActive: boolean;
  isCorrect: boolean;
  showSolution: boolean;

  onClick: () => void;
  onKeyDown?: (event: any) => void;
}
export default function Option({
  label,
  isActive,
  isCorrect,
  showSolution,

  onClick,
  onKeyDown,
}: OptionProps) {
  const className = classNames(
    'w-full ps-4 text-primary flex items-center border rounded-lg',
    !isActive && 'border-stone-200',
    showSolution && (isCorrect ? 'bg-green-100' : 'border-rose-200'),
    !showSolution && isActive && 'border-primary border-4'
  );

  return (
    <button onClick={onClick} className={className} onKeyDown={onKeyDown}>
      <div className='flex'>
        <div className='py-4 ms-2 font-medium text-stone-900'>{label}</div>
      </div>
    </button>
  );
}
