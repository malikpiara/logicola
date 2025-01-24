import { Question } from '@/content/types';
import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationProps {
  currentQuestion: Question | undefined; // Not sure if it's a string?
  showStartScreen: boolean;
  showSolution: boolean;
  selectedOptionIndex: number | null;
  onShowStartScreen: () => void;
  selectNextOption: () => void;
  selectPreviousOption: () => void;
  selectOption: (index: number) => void;
  handleCheckAnswerAndExpandDrawer: () => void;
  handleNextQuestion: () => void;
}

const useKeyboardNavigation = ({
  currentQuestion,
  showStartScreen,
  showSolution,
  selectedOptionIndex,
  onShowStartScreen,
  selectNextOption,
  selectPreviousOption,
  selectOption,
  handleCheckAnswerAndExpandDrawer,
  handleNextQuestion,
}: UseKeyboardNavigationProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!currentQuestion) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          selectNextOption();
          break;
        case 'ArrowUp':
          event.preventDefault();
          selectPreviousOption();
          break;
        case 'Enter':
          event.preventDefault();
          if (showStartScreen) {
            onShowStartScreen();
            break;
          }
          if (
            !showStartScreen &&
            !showSolution &&
            selectedOptionIndex != null
          ) {
            handleCheckAnswerAndExpandDrawer();
            break;
          }
          if (showSolution) {
            handleNextQuestion();
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          event.preventDefault();
          selectOption(parseInt(event.key) - 1);
          break;
        default:
          break;
      }
    },
    [
      currentQuestion,
      showStartScreen,
      showSolution,
      selectedOptionIndex,
      onShowStartScreen,
      selectNextOption,
      selectPreviousOption,
      selectOption,
      handleCheckAnswerAndExpandDrawer,
      handleNextQuestion,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardNavigation;
