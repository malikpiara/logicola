import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import useQuizState from './useQuizState';

const mockQuiz = {
  id: 0,
  title: '',
  header: '',
  slugs: [],
  questions: [
    {
      id: '',
      prompt: '',
      options: [
        {
          id: 0,
          label: '',
        },
      ],
      correctId: [0],
      answer: '',
    },
    {
      id: '',
      prompt: '',
      options: [
        {
          id: 0,
          label: '',
        },
      ],
      correctId: [0],
      answer: '',
    },
  ],
};

describe('useQuizState', () => {
  it('initializes state correctly', () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    expect(result.current.questionIdx).toBe(0);
    expect(result.current.selectedOptionId).toBeNull();
    expect(result.current.showSolution).toBe(false);
    expect(result.current.checkAnswer).toBe(false);
    expect(result.current.showStartScreen).toBe(true);
    expect(result.current.showEndScreen).toBe(false);
    expect(result.current.numOfCorrectQuestions).toBe(0);
    // expect(Array.isArray(result.current.questionOrder)).toBe(true);
    // expect(result.current.questionOrder.length).toBeGreaterThan(0); // Assumes there are questions
  });
});

describe('Navigation between questions', () => {
  it('increments the question index by 1 on handleNextQuestion call', () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    act(() => {
      result.current.handleNextQuestion();
    });

    expect(result.current.questionIdx).toBe(1);
  });
});

describe('Option selection and scoring', () => {
  it('selects an option and increments score if the answer is correct', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useQuizState(mockQuiz)
    );

    const correctId = result.current.currentQuestion.correctId;

    const optionId = Array.isArray(correctId) ? correctId[0] : correctId;

    await act(async () => {
      result.current.selectOption(optionId);

      await waitForNextUpdate();

      expect(result.current.selectedOptionId).toBe(optionId);

      result.current.onCheckAnswer();

      expect(result.current.showSolution).toBe(true);
      expect(result.current.numOfCorrectQuestions).toBe(1);
    });
  });
  it("doesn't count a question as correct if it wasn't solved on the first try", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useQuizState(mockQuiz)
    );

    const incorrectId = 1;
    const correctId = result.current.currentQuestion.correctId;

    const optionId = Array.isArray(correctId) ? correctId[0] : correctId;

    await act(async () => {
      result.current.selectOption(incorrectId);

      await waitForNextUpdate();

      expect(result.current.selectedOptionId).toBe(incorrectId);

      result.current.onCheckAnswer();

      expect(result.current.showSolution).toBe(false);
      expect(result.current.previousGuesses).toStrictEqual([incorrectId]);

      result.current.selectOption(optionId);

      result.current.onCheckAnswer();

      expect(result.current.showSolution).toBe(true);
      expect(result.current.numOfCorrectQuestions).toBe(0);
      expect(result.current.numOfCorrectQuestions).toBe(0);
    });
  });
});
