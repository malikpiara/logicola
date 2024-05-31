import { useEffect, useState } from 'react';
import posthog from 'posthog-js';
import { Chapter } from '@/content';

export default function useQuizState(chapter: Chapter) {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [checkAnswer] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showEndScreen, setShowEndScreen] = useState(false);

  const generateQuestionOrder = () => {
    const questionIndices = Array.from(
      { length: chapter.questions.length },
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
  const [correctQuestions, setCorrectQuestions] = useState<string[]>([]);

  const [previousGuesses, setPreviousGuesses] = useState<number[]>([]);

  const [questionOrder, setQuestionOrder] = useState<number[]>(
    generateQuestionOrder()
  );

  // Function for moving to the next question
  const handleNextQuestion = () => {
    if (questionIdx < chapter.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
      setSelectedOptionId(null); // Reset selected option
      setPreviousGuesses([]);
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
    if (chapter) {
      randomizeQuestionOrder();
    }
  }, [chapter]);

  const currentQuestion = chapter.questions[questionOrder[questionIdx]];

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

  function isAnswerCorrect(optionId: number, correctId: number[]) {
    return correctId.includes(optionId);
  }

  function onCheckAnswer() {
    if (selectedOptionId == null) return;

    if (isAnswerCorrect(selectedOptionId, currentQuestion.correctId)) {
      const correctOnFirstTry = previousGuesses.length === 0;

      if (correctOnFirstTry) {
        setCorrectQuestions([...correctQuestions, currentQuestion.id]);
      }
      onShowSolution();
    } else {
      setPreviousGuesses([...previousGuesses, selectedOptionId]);
      setSelectedOptionId(null);
      if (
        [...previousGuesses, selectedOptionId].length ===
        currentQuestion.options.length - 1
      ) {
        onShowSolution();
      }
    }
  }

  function onShowStartScreen() {
    posthog.capture('quiz_started', {
      chapter: chapter.title,
    });
    setShowStartScreen(false);
  }

  function onShowEndScreen() {
    posthog.capture('quiz_completed', {
      chapter: chapter.title,
      correctQuestionsCount: correctQuestions.length, // Different quizes might have more than 10 questions. We need to rethink this to have useful information.
      scorePercentage: (correctQuestions.length / 10) * 100, // 10 is the number of questions we load in the quiz. That might change!
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
    currentChapter: chapter,
    currentQuestion,
    questionCounter,
    previousGuesses,
    handleNextQuestion,
    selectNextOption,
    selectPreviousOption,
    selectOption,
    onShowSolution,
    onCheckAnswer,
    onShowStartScreen,
    onShowEndScreen,
    correctQuestions,
  };
}
