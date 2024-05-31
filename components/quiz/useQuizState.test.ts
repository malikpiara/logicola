import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import useQuizState from './useQuizState';

describe('useQuizState', () => {
  it('initializes state correctly', () => {
    const chapterId = 1; // assuming chapter ID 1 exists
    const { result } = renderHook(() => useQuizState(chapterId));

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
    const chapterId = 1;
    const { result } = renderHook(() => useQuizState(chapterId));

    act(() => {
      result.current.handleNextQuestion();
    });

    expect(result.current.questionIdx).toBe(1);
  });
});

describe('Option selection and scoring', () => {
  it('selects an option and increments score if the answer is correct', () => {
    const chapterId = 1;
    const { result } = renderHook(() => useQuizState(chapterId));

    // Mocking the correct answer ID and the selection process
    const correctOptionId = 0;
    act(() => {
      result.current.selectOption(correctOptionId);
      result.current.incrementScore(correctOptionId, correctOptionId);
    });

    expect(result.current.selectedOptionId).toBe(correctOptionId);
    expect(result.current.numOfCorrectQuestions).toBe(1);
  });
});
