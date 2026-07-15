import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useQuizState, { getRevealThreshold } from './useQuizState';
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

  it('reveals the solution when all options but one are exhausted (classic)', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    // 3 options → threshold 2 wrong guesses
    for (const wrongIndex of [1, 2]) {
      act(() => {
        result.current.selectOption(wrongIndex);
      });
      act(() => {
        result.current.onCheckAnswer();
      });
    }

    await waitFor(() => {
      expect(result.current.showSolution).toBe(true);
    });
    expect(result.current.correctQuestions).toStrictEqual([]);
  });

  it('reveals the solution after maxWrongGuesses when the subset caps it', async () => {
    // Many-option subset (like Set R's 18) with a wrong-guess budget of 2.
    const manyOptions = {
      ...mockQuiz,
      maxWrongGuesses: 2,
      questions: [
        {
          id: 'question-1',
          prompt: '',
          options: Array.from({ length: 18 }, (_, id) => ({ id, label: '' })),
          correctId: [0],
          answer: '',
        },
      ],
    };
    const { result } = renderHook(() => useQuizState(manyOptions));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => {
      result.current.selectOption(5);
    });
    act(() => {
      result.current.onCheckAnswer();
    });
    expect(result.current.showSolution).toBe(false);

    act(() => {
      result.current.selectOption(9);
    });
    act(() => {
      result.current.onCheckAnswer();
    });

    await waitFor(() => {
      expect(result.current.showSolution).toBe(true);
    });
  });

  it('getRevealThreshold clamps to the option count and defaults to exhaustion', () => {
    const question = mockQuiz.questions[0];
    expect(getRevealThreshold(mockQuiz, question)).toBe(2);
    expect(
      getRevealThreshold({ ...mockQuiz, maxWrongGuesses: 3 }, question)
    ).toBe(2);
    expect(
      getRevealThreshold({ ...mockQuiz, maxWrongGuesses: 1 }, question)
    ).toBe(1);
  });
});

describe('useQuizState — multi-select (subset rule)', () => {
  // 4 options; the passage genuinely commits fallacies 0, 1 and 2.
  function createMultiQuiz(maxWrongGuesses = 3) {
    return {
      ...mockQuiz,
      multiSelect: true,
      maxWrongGuesses,
      questions: [
        {
          id: 'multi-1',
          prompt: '',
          options: [0, 1, 2, 3].map((id) => ({ id, label: '' })),
          correctId: [0, 1, 2],
          answer: '',
        },
      ],
    };
  }

  async function renderMulti(maxWrongGuesses = 3) {
    const { result } = renderHook(() =>
      useQuizState(createMultiQuiz(maxWrongGuesses))
    );
    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });
    return result;
  }

  it('toggles an option in and out of the selection', async () => {
    const result = await renderMulti();
    act(() => result.current.selectOption(0));
    expect(result.current.selectedOptionIds).toEqual([0]);
    act(() => result.current.selectOption(0));
    expect(result.current.selectedOptionIds).toEqual([]);
  });

  it('is correct when a single genuine fallacy is picked', async () => {
    const result = await renderMulti();
    act(() => result.current.selectOption(0));
    act(() => result.current.onCheckAnswer());
    await waitFor(() => expect(result.current.showSolution).toBe(true));
    expect(result.current.correctQuestions).toStrictEqual(['multi-1']);
  });

  it('is correct when several genuine fallacies are picked', async () => {
    const result = await renderMulti();
    act(() => result.current.selectOption(0));
    act(() => result.current.selectOption(2));
    act(() => result.current.onCheckAnswer());
    await waitFor(() => expect(result.current.showSolution).toBe(true));
    expect(result.current.correctQuestions).toStrictEqual(['multi-1']);
  });

  it('is wrong if any pick is not a fallacy the passage commits', async () => {
    const result = await renderMulti();
    act(() => result.current.selectOption(0)); // genuine
    act(() => result.current.selectOption(3)); // not accepted
    act(() => result.current.onCheckAnswer());

    expect(result.current.showSolution).toBe(false);
    // wrong pick is flagged; genuine pick is kept for another try
    expect(result.current.previousGuesses).toStrictEqual([3]);
    expect(result.current.selectedOptionIds).toStrictEqual([0]);
    expect(result.current.correctQuestions).toStrictEqual([]);
  });

  it('reveals after maxWrongGuesses wrong submissions (counts attempts, not picks)', async () => {
    const result = await renderMulti(2);
    // First wrong submission with TWO bad picks — must count as one attempt.
    act(() => result.current.selectOption(0));
    act(() => result.current.selectOption(3));
    act(() => result.current.onCheckAnswer());
    expect(result.current.showSolution).toBe(false);

    // Second wrong submission → reveal.
    act(() => result.current.selectOption(3));
    act(() => result.current.onCheckAnswer());
    await waitFor(() => expect(result.current.showSolution).toBe(true));
  });

  it('does not score a question solved only after a wrong submission', async () => {
    const result = await renderMulti();
    act(() => result.current.selectOption(3)); // wrong
    act(() => result.current.onCheckAnswer());
    act(() => result.current.selectOption(0)); // now genuine
    act(() => result.current.onCheckAnswer());
    await waitFor(() => expect(result.current.showSolution).toBe(true));
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

    expect(captureAnalyticsEvent).toHaveBeenCalledTimes(1);
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
