import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useQuizState from './useQuizState';

vi.mock('@/lib/analytics', () => ({
  captureAnalyticsEvent: vi.fn(),
}));

const mockQuiz = {
  id: 0,
  title: '',
  header: '',
  slugs: [],
  logicType: '',
  name: '',
  shuffleOptions: false,
  questions: [
    {
      id: 'question-1',
      prompt: '',
      options: [
        {
          id: 0,
          label: '',
        },
        {
          id: 1,
          label: '',
        },
        {
          id: 2,
          label: '',
        },
      ],
      correctId: [0],
      answer: '',
    },
    {
      id: 'question-2',
      prompt: '',
      options: [
        {
          id: 0,
          label: '',
        },
        {
          id: 1,
          label: '',
        },
        {
          id: 2,
          label: '',
        },
      ],
      correctId: [0],
      answer: '',
    },
  ],
};

describe('useQuizState', () => {
  it('initializes state correctly', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    expect(result.current.questionIdx).toBe(0);
    expect(result.current.selectedOptionIndex).toBeNull();
    expect(result.current.showSolution).toBe(false);
    expect(result.current.showStartScreen).toBe(true);
    expect(result.current.showEndScreen).toBe(false);
    expect(result.current.correctQuestions).toStrictEqual([]);
  });
});

describe('Navigation between questions', () => {
  it('increments the question index by 1 on handleNextQuestion call', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => {
      result.current.handleNextQuestion();
    });

    expect(result.current.questionIdx).toBe(1);
  });
});

describe('Option selection and scoring', () => {
  it('selects an option and increments score if the answer is correct', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    const correctIndex = 0;

    act(() => {
      result.current.selectOption(correctIndex);
    });

    expect(result.current.selectedOptionIndex).toBe(correctIndex);

    act(() => {
      result.current.onCheckAnswer();
    });

    await waitFor(() => {
      expect(result.current.showSolution).toBe(true);
    });

    expect(result.current.correctQuestions).toStrictEqual([
      result.current.currentQuestion.id,
    ]);
  });

  it("doesn't count a question as correct if it wasn't solved on the first try", async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    const incorrectIndex = 1;
    const correctIndex = 0;

    act(() => {
      result.current.selectOption(incorrectIndex);
    });

    expect(result.current.selectedOptionIndex).toBe(incorrectIndex);

    act(() => {
      result.current.onCheckAnswer();
    });

    expect(result.current.showSolution).toBe(false);
    expect(result.current.previousGuesses).toStrictEqual([incorrectIndex]);
    expect(result.current.selectedOptionIndex).toBeNull();

    act(() => {
      result.current.selectOption(correctIndex);
    });

    await waitFor(() => {
      expect(result.current.selectedOptionIndex).toBe(correctIndex);
    });

    act(() => {
      result.current.onCheckAnswer();
    });

    await waitFor(() => {
      expect(result.current.showSolution).toBe(true);
    });

    expect(result.current.correctQuestions).toStrictEqual([]);
  });
});
