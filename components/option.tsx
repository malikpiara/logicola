import classNames from 'classnames';

export interface OptionProps {
  label: string;
  isActive: boolean;
  isCorrect: boolean;
  showSolution: boolean;

  onClick: () => void;
}
export default function Option({
  label,
  isActive,
  isCorrect,
  showSolution,

  onClick,
}: OptionProps) {
  const className = classNames(
    'w-full ps-4 text-primary flex items-center border rounded-lg',
    !isActive && 'border-stone-200',
    showSolution && (isCorrect ? 'bg-green-100' : 'border-rose-200'),
    !showSolution && isActive && 'border-primary'
  );

  return (
    <button onClick={onClick} className={className}>
      <div className='flex'>
        <div className='py-4 ms-2 font-medium text-stone-900'>{label}</div>
      </div>
    </button>
  );
}
