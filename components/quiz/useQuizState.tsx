import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { chapters } from '@/contentOld';

export default function useQuizState(chapter: number) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [checkAnswer] = useState(false);
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
  const [numOfCorrectQuestions, setnumOfCorrectQuestions] = useState<number>(0);

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
      // If the user does more than 10 questions, exit the program.
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
  function onCheckAnswer() {
    // TODO: Implement function that checks if the selected
    // option is correct. If it's not, append a style+classname.
  }

  function incrementScore(optionId: number, correctId: number | number[]) {
    if (Array.isArray(correctId)) {
      // Check if correctId is an array
      if (correctId.includes(optionId)) {
        setnumOfCorrectQuestions(numOfCorrectQuestions + 1);
      }
    } else {
      // Treat as a single correct answer
      if (optionId === correctId) {
        setnumOfCorrectQuestions(numOfCorrectQuestions + 1);
      }
    }
  }

  function onShowStartScreen() {
    posthog.capture('quiz_started', {
      chapter: currentChapter!.title,
    });
    setShowStartScreen(false);
  }

  function onShowEndScreen() {
    posthog.capture('quiz_completed', {
      chapter: currentChapter!.title,
      correctQuestionsCount: numOfCorrectQuestions, // Different quizes might have more than 10 questions. We need to rethink this to have useful information.
      scorePercentage: (numOfCorrectQuestions / 10) * 100, // 10 is the number of questions we load in the quiz. That might change!
    });
    setShowEndScreen(true);
  }

  return {
    showStartScreen,
    showEndScreen,
    questionIdx,
    selectedOptionId,
    showSolution,
    checkAnswer,
    currentChapter,
    currentQuestion,
    questionCounter,
    numOfCorrectQuestions,
    incrementScore,
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowSolution,
    onCheckAnswer,
    onShowStartScreen,
    onShowEndScreen,
    setnumOfCorrectQuestions,
  };
}
