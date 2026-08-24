import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import useQuizState, { getRevealThreshold } from './useQuizState';
import { SHIPPED_FLOOR, scoreMode } from './quizMode';
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

    expect(result.current.questionCounter).toBe(1);
    expect(result.current.selectedOptionIndex).toBeNull();
    expect(result.current.showSolution).toBe(false);
    expect(result.current.showStartScreen).toBe(true);
    expect(result.current.showEndScreen).toBe(false);
    expect(result.current.correctQuestions).toStrictEqual([]);
  });

  it('opens in the dormant count mode for a set with no derived economy', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    expect(result.current.mode).toEqual({ kind: 'count', total: 10 });
  });

  it('opens scored for a scoreable set — the release mode', async () => {
    const { result } = renderHook(() =>
      useQuizState({ ...mockQuiz, name: 'Set R' })
    );

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    expect(result.current.mode).toEqual({
      kind: 'score',
      level: 5,
      floor: SHIPPED_FLOOR,
    });
    expect(result.current.scoreState.level).toBe(5);
    expect(result.current.scoreState.floor).toBe(SHIPPED_FLOOR);
  });

  it('Set R charges ONCE per problem — the second wrong pick is free (2008 law)', async () => {
    const { result } = renderHook(() =>
      useQuizState({ ...mockQuiz, name: 'Set R', shuffleOptions: false })
    );

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => result.current.onShowStartScreen());
    // correctId is [0]; pick wrong option 1, check: −10 at level 5.
    act(() => result.current.selectOption(1));
    act(() => result.current.onCheckAnswer());
    expect(result.current.scoreState.score).toBe(-10);
    // Second wrong pick on the SAME problem: charged once, then free.
    act(() => result.current.selectOption(2));
    act(() => result.current.onCheckAnswer());
    expect(result.current.scoreState.score).toBe(-10);
  });

  it('Set A stops charging once the run is in the red (shipped floor)', async () => {
    const { result } = renderHook(() =>
      useQuizState({ ...mockQuiz, name: 'Set A', shuffleOptions: false })
    );

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => result.current.onShowStartScreen());
    act(() => result.current.selectOption(1));
    act(() => result.current.onCheckAnswer());
    expect(result.current.scoreState.score).toBe(-10);
    // The 2008 engine would halve and charge 5 more here. The shipped floor
    // charges nothing: the run is already in deficit.
    act(() => result.current.selectOption(2));
    act(() => result.current.onCheckAnswer());
    expect(result.current.scoreState.score).toBe(-10);
    // Still a miss in every other respect — the register decayed underneath.
    expect(result.current.scoreState.penaltyDue).toBe(2);
  });

  it('Set A halves the charge per miss: −10 then −15 (2008 law, floor off)', async () => {
    // The reversibility seam, exercised through the real hook: a run opened
    // with floor 'none' is the restored economy, unchanged by the default.
    const { result } = renderHook(() =>
      useQuizState({ ...mockQuiz, name: 'Set A', shuffleOptions: false })
    );

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => result.current.onShowStartScreen(scoreMode(5, 'none')));
    act(() => result.current.selectOption(1));
    act(() => result.current.onCheckAnswer());
    expect(result.current.scoreState.score).toBe(-10);
    act(() => result.current.selectOption(2));
    act(() => result.current.onCheckAnswer());
    expect(result.current.scoreState.score).toBe(-15);
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

    expect(result.current.questionCounter).toBe(2);
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

  it('clears the cursor on a wrong submission — a reveal shows the answer, not the last pick', async () => {
    const result = await renderMulti(1); // reveal on the first wrong submission
    act(() => result.current.selectOption(3)); // wrong — cursor lands here
    act(() => result.current.onCheckAnswer());
    await waitFor(() => expect(result.current.showSolution).toBe(true));
    // With the cursor still on the wrong pick, the shell's review rule put
    // that option's hint where the answer explanation belongs.
    expect(result.current.selectedOptionIndex).toBeNull();
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
    // Scope the counter to THIS test — earlier describes also start runs.
    vi.mocked(captureAnalyticsEvent).mockClear();
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

  it('flags willFinishOnNext on the last question only', async () => {
    const longQuiz = createMockQuiz(60);
    const { result } = renderHook(() => useQuizState(longQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    act(() => {
      result.current.onShowStartScreen();
    });

    for (let i = 0; i < 10; i++) {
      // The advance transition branches on this (the end screen is not a
      // question it can push in) — it must flip on the final question only.
      expect(result.current.willFinishOnNext).toBe(i === 9);

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
      result.current.captureRetry();
    });

    // captureRetry only logs the ending run's stats — the actual reset is
    // the shell's key-remount, which rebuilds the hook from initializers.
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
  });

  it('starts immediately in the given mode on a retry mount', async () => {
    vi.mocked(captureAnalyticsEvent).mockClear();
    const { result } = renderHook(() =>
      useQuizState(mockQuiz, { kind: 'count', total: 10 })
    );

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    // A retry mount skips the start screen and begins as a fresh run…
    expect(result.current.showStartScreen).toBe(false);
    expect(result.current.showEndScreen).toBe(false);
    expect(result.current.mode).toStrictEqual({ kind: 'count', total: 10 });
    expect(result.current.questionCounter).toBe(1);
    expect(result.current.correctQuestions).toStrictEqual([]);
    // …and never re-fires quiz_started (the retry already fired
    // quiz_retried from the ending session).
    expect(captureAnalyticsEvent).not.toHaveBeenCalled();
  });

  it('onCheckAnswer reports the graded outcome', async () => {
    const { result } = renderHook(() => useQuizState(mockQuiz));

    await waitFor(() => {
      expect(result.current.currentQuestion).toBeDefined();
    });

    // Nothing selected → nothing graded.
    let outcome: 'correct' | 'miss' | undefined;
    act(() => {
      outcome = result.current.onCheckAnswer();
    });
    expect(outcome).toBeUndefined();

    const { correctId, options } = result.current.currentQuestion!;
    const wrongIndex = options.findIndex((o) => !correctId.includes(o.id));
    act(() => {
      result.current.selectOption(wrongIndex);
    });
    act(() => {
      outcome = result.current.onCheckAnswer();
    });
    expect(outcome).toBe('miss');

    const correctIndex = options.findIndex((o) => correctId.includes(o.id));
    act(() => {
      result.current.selectOption(correctIndex);
    });
    act(() => {
      outcome = result.current.onCheckAnswer();
    });
    expect(outcome).toBe('correct');
  });
});
