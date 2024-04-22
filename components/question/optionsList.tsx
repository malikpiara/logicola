import Option from '@/components/option';

type OptionsListProps = {
  options: string[];
  selectedOptionIndices: Set<number>;
  showSolution: boolean;
  correctIndices: number[];
  onOptionClick: (optionIndex: number) => void;
};

export const OptionsList = ({
  options,
  selectedOptionIndices,
  showSolution,
  correctIndices,
  onOptionClick,
}: OptionsListProps) => {
  return (
    <>
      {options.map((option, optionIndex) => {
        const isSelected = selectedOptionIndices.has(optionIndex);
        return (
          <Option
            key={option}
            keyboardShortcut={(optionIndex + 1).toString()}
            isSelected={isSelected}
            isCorrect={correctIndices.includes(optionIndex)}
            showSolution={showSolution}
            label={option}
            disabled={showSolution}
            onSelect={() => onOptionClick(optionIndex)}
          />
        );
      })}
    </>
  );
};
