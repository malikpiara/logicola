import { render, fireEvent } from '@testing-library/react';
import { OptionsList } from '@/components/question/optionsList';

describe('OptionsList', () => {
  const mockOnOptionClick = vitest.fn();

  const props = {
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedOptionIndices: new Set([0]),
    showSolution: false,
    correctIndices: [0, 2],
    onOptionClick: mockOnOptionClick,
  };

  it('renders options correctly', () => {
    const { getAllByRole } = render(<OptionsList {...props} />);
    const options = getAllByRole('button');
    expect(options).toHaveLength(props.options.length);
    for (let i = 0; i < options.length; i++) {
      expect(options[i]).toHaveTextContent(props.options[i]);
    }
  });

  it('calls onOptionClick when an option is clicked', () => {
    const { getAllByRole } = render(<OptionsList {...props} />);
    const options = getAllByRole('button');
    fireEvent.click(options[0]);
    expect(mockOnOptionClick).toHaveBeenCalledWith(0);
  });
});
