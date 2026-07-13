import { Question } from '@/content/types';
import { useEffect, useEffectEvent } from 'react';

interface UseKeyboardNavigationProps {
  currentQuestion: Question | undefined; // Not sure if it's a string?
  showStartScreen: boolean;
  showSolution: boolean;
  selectedOptionIndex: number | null;
  onShowStartScreen: () => void;
  selectNextOption: () => void;
  selectPreviousOption: () => void;
  selectOption: (index: number) => void;
  handleCheckAnswer: () => void;
  handleNextQuestion: () => void;
  /** Optional: collapse / dismiss the bottom drawer. Bound to Escape. */
  collapseDrawer?: () => void;
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
  handleCheckAnswer,
  handleNextQuestion,
  collapseDrawer,
}: UseKeyboardNavigationProps) => {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
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
      case 'Escape':
        if (collapseDrawer) {
          event.preventDefault();
          collapseDrawer();
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (showStartScreen) {
          onShowStartScreen();
          break;
        }
        if (!showStartScreen && !showSolution && selectedOptionIndex != null) {
          handleCheckAnswer();
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
      case '8':
      case '9': {
        const idx = parseInt(event.key) - 1;
        if (idx >= currentQuestion.options.length) break;
        event.preventDefault();
        selectOption(idx);
        break;
      }
      default:
        break;
    }
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      onKeyDown(event);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export default useKeyboardNavigation;
