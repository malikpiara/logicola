import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useQuizState from './useQuizState';
import { captureAnalyticsEvent } from '@/lib/analytics';

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

function createMockQuiz(questionCount: number) {
  return {
    ...mockQuiz,
    questions: Array.from({ length: questionCount }, (_, index) => ({
      id: `question-${index + 1}`,
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
    })),
  };
}

describe('useQuizState', () => {
  beforeEach(() => {
    vi.mocked(captureAnalyticsEvent).mockClear();
  });

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
  beforeEach(() => {
    vi.mocked(captureAnalyticsEvent).mockClear();
  });

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

  it('captures quiz_started only once', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => {
      result.current.onShowStartScreen();
      result.current.onShowStartScreen();
    });

    // Filter by event name — question_answered events from other
    // interactions must not count against the once-only guarantee.
    const quizStartedCalls = vi
      .mocked(captureAnalyticsEvent)
      .mock.calls.filter(([eventName]) => eventName === 'quiz_started');
    expect(quizStartedCalls).toHaveLength(1);
    expect(captureAnalyticsEvent).toHaveBeenCalledWith(
      'quiz_started',
      expect.objectContaining({
        title: mockQuiz.title,
        quiz_id: mockQuiz.id,
        quiz_title: mockQuiz.title,
        quiz_name: mockQuiz.name,
        quiz_logic_type: mockQuiz.logicType,
        quiz_slug: mockQuiz.slugs.join('/'),
        total_questions: mockQuiz.questions.length,
      })
    );
  });

  it('captures question_answered with template key and option detail on every check', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    const q = result.current.currentQuestion!;
    const wrongIndex = q.options.findIndex((o) => !q.correctId.includes(o.id));

    act(() => {
      result.current.selectOption(wrongIndex);
    });
    act(() => {
      result.current.onCheckAnswer();
    });

    const calls = vi
      .mocked(captureAnalyticsEvent)
      .mock.calls.filter(([eventName]) => eventName === 'question_answered');
    expect(calls).toHaveLength(1);
    expect(calls[0]![1]).toMatchObject({
      question_id: q.id,
      option_id: q.options[wrongIndex]!.id,
      option_label: q.options[wrongIndex]!.label,
      correct: false,
      guess_number: 1,
      first_try: true,
      quiz_id: mockQuiz.id,
    });
  });

  it('completes after 10 questions and scores against a 10-question quiz', async () => {
    const longQuiz = createMockQuiz(60);
    const { result } = renderHook(() => useQuizState(longQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => {
      result.current.onShowStartScreen();
    });

    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.selectOption(0);
      });

      act(() => {
        result.current.onCheckAnswer();
      });

      await waitFor(() => {
        expect(result.current.showSolution).toBe(true);
      });

      act(() => {
        result.current.handleNextQuestion();
      });
    }

    await waitFor(() => {
      expect(result.current.showEndScreen).toBe(true);
    });

    expect(captureAnalyticsEvent).toHaveBeenCalledWith(
      'quiz_completed',
      expect.objectContaining({
        subSet: longQuiz.title,
        totalQuestions: 10,
        correctQuestionsCount: 10,
        scorePercentage: 100,
        quiz_id: longQuiz.id,
        quiz_title: longQuiz.title,
        quiz_name: longQuiz.name,
        quiz_logic_type: longQuiz.logicType,
        quiz_slug: longQuiz.slugs.join('/'),
        total_questions: 10,
        correct_questions_count: 10,
        score_percentage: 100,
      })
    );
  });

  it('captures quiz_retried and resets to a fresh attempt', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => {
      result.current.onShowStartScreen();
    });

    for (let i = 0; i < mockQuiz.questions.length; i++) {
      act(() => {
        result.current.selectOption(0);
      });

      act(() => {
        result.current.onCheckAnswer();
      });

      await waitFor(() => {
        expect(result.current.showSolution).toBe(true);
      });

      act(() => {
        result.current.handleNextQuestion();
      });
    }

    await waitFor(() => {
      expect(result.current.showEndScreen).toBe(true);
    });

    act(() => {
      result.current.onTryAgain();
    });

    expect(captureAnalyticsEvent).toHaveBeenCalledWith(
      'quiz_retried',
      expect.objectContaining({
        quiz_id: mockQuiz.id,
        quiz_title: mockQuiz.title,
        quiz_name: mockQuiz.name,
        quiz_logic_type: mockQuiz.logicType,
        quiz_slug: mockQuiz.slugs.join('/'),
        total_questions: mockQuiz.questions.length,
        correct_questions_count: mockQuiz.questions.length,
        score_percentage: 100,
        source: 'quiz_end_screen',
      })
    );
    expect(result.current.showStartScreen).toBe(false);
    expect(result.current.showEndScreen).toBe(false);
    expect(result.current.showSolution).toBe(false);
    expect(result.current.questionCounter).toBe(1);
    expect(result.current.correctQuestions).toStrictEqual([]);
  });
});
