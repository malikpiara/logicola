import { render, screen, fireEvent } from '@testing-library/react';
import { StartScreen } from '@/components/quiz/startScreen';

describe('StartScreen', () => {
  const onClickStart = vitest.fn();

  it('renders the start screen content', () => {
    render(<StartScreen onClickStart={onClickStart} questionsCount={10} />);
    expect(screen.getByText('Ready for a challenge?')).toBeInTheDocument();
    expect(screen.getByText('10 questions')).toBeInTheDocument();
  });

  it('calls onClickStart when the start button is clicked', () => {
    render(<StartScreen onClickStart={onClickStart} questionsCount={10} />);
    fireEvent.click(screen.getByText('Start Quiz'));
    expect(onClickStart).toHaveBeenCalled();
  });
});
