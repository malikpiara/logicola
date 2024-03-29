import { useEffect, useState } from 'react';

import { chapters } from '@/content';

export default function useQuizState(
  chapter: number,
  initialQuestionIdx: number
) {
  const [questionIdx, setQuestionIdx] = useState(initialQuestionIdx);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showEndScreen, setShowEndScreen] = useState(false);

  const currentChapter = chapters.find((c) => c.id === chapter);

  const generateQuestionOrder = () => {
    const questionIndices = Array.from(
      { length: currentChapter!.questions.length },
      (_, i) => i
    );
    // Use a shuffling algorithm like Fisher-Yates:
    for (let i = questionIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionIndices[i], questionIndices[j]] = [
        questionIndices[j],
        questionIndices[i],
      ];
    }
    return questionIndices;
  };

  const [questionCounter, setQuestionCounter] = useState<number>(1);

  const [questionOrder, setQuestionOrder] = useState<number[]>(
    generateQuestionOrder()
  );

  // Function for moving to the next question
  const handleNextQuestion = () => {
    if (questionIdx < currentChapter!.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionId(null); // Reset selected option
      setShowSolution(false); // Hide solution
      setQuestionCounter(questionCounter + 1);
    }
    if (questionCounter > 9) {
      onShowEndScreen();
    }
  };

  function randomizeQuestionOrder() {
    setQuestionOrder(generateQuestionOrder());
  }

  useEffect(() => {
    if (currentChapter) {
      randomizeQuestionOrder();
    }
  }, [currentChapter]);

  const currentQuestion = currentChapter!.questions[questionOrder[questionIdx]];

  const lastOptionIndex = currentQuestion.options.length - 1;

  function selectNextOption() {
    setSelectedOptionId((prevId) => Math.min(prevId! + 1, lastOptionIndex));
  }
  function selectPreviousOption() {
    setSelectedOptionId((prevId) => Math.max(prevId! - 1, 0));
  }
  function selectOption(optionId: number) {
    setSelectedOptionId(optionId);
  }
  function onShowSolution() {
    setShowSolution(true);
  }

  function onShowStartScreen() {
    setShowStartScreen(false);
  }

  function onShowEndScreen() {
    setShowEndScreen(true);
  }

  return {
    showStartScreen,
    showEndScreen,
    questionIdx,
    selectedOptionId,
    showSolution,
    currentChapter,
    currentQuestion,
    questionCounter,
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowSolution,
    onShowStartScreen,
    onShowEndScreen,
  };
}
