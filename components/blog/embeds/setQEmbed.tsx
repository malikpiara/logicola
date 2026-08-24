'use client';

import { useState } from 'react';
import Link from 'next/link';
import useQuizState from '@/components/quiz/useQuizState';
import Option from '@/components/option';
import { setQ } from '@/content/sets/setQ';
import type { SubSet } from '@/content/types';

/**
 * Set Q inside a blog post (Malik, 2026-08-24 — the Set Q announcement
 * wants the drill in the announcement). A small island over the real
 * engine: useQuizState grades, Option renders, nothing is re-derived —
 * the grading-truth rule holds because this component only reads the
 * hook's verdicts. No start screen (initialMode skips it, which also
 * keeps quiz_started analytics clean of embed noise), no scoring
 * economy, no sheet — a taste of the drill, then the CTA to the real
 * one.
 */
export function SetQEmbed({ count }: { count: number }) {
  // One draw per mount, in a lazy initializer (the same shape
  // generatedQuiz.tsx uses — the purity lint permits impurity there,
  // not in useMemo). Math.random is safe: the island renders nothing
  // on the server (next/dynamic client map), so there is no hydration
  // text to mismatch.
  const [subSet] = useState<SubSet>(() => {
    const bank = setQ.subSets[0]!;
    const questions = [...bank.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(1, Math.min(count, 10)));
    return { ...bank, title: `${bank.title} — sample`, questions };
  });

  const [attempt, setAttempt] = useState(0);
  return (
    <SetQEmbedRun
      key={attempt}
      subSet={subSet}
      onRetry={() => setAttempt((a) => a + 1)}
    />
  );
}

function SetQEmbedRun({
  subSet,
  onRetry,
}: {
  subSet: SubSet;
  onRetry: () => void;
}) {
  const quiz = useQuizState(subSet, {
    kind: 'count',
    total: subSet.questions.length,
  });
  const {
    currentQuestion,
    questionCounter,
    selectedOptionIndex,
    selectedOptionIds,
    showSolution,
    showEndScreen,
    correctQuestions,
    selectOption,
    onCheckAnswer,
    handleNextQuestion,
    willFinishOnNext,
  } = quiz;
  const isMulti = !!subSet.multiSelect;
  const total = subSet.questions.length;

  if (showEndScreen) {
    return (
      <div className='not-prose lx-embed'>
        <p className='lx-embed-eyebrow'>SAMPLE DRILL</p>
        <p className='lx-embed-score'>
          {correctQuestions.length} of {total} first try.
        </p>
        <div className='lx-embed-row'>
          <Link
            href='/informal/definitions/quiz'
            className='lx-embed-cta motion-button'
          >
            Take the full drill →
          </Link>
          <button
            type='button'
            onClick={onRetry}
            className='lx-embed-ghost motion-button'
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className='not-prose lx-embed'>
      <p className='lx-embed-eyebrow'>
        SAMPLE DRILL · {questionCounter} OF {total}
      </p>
      <p className='lx-embed-header'>{subSet.header}</p>
      <p className='lx-embed-prompt'>{currentQuestion.prompt}</p>
      <div className='lx-embed-options'>
        {currentQuestion.options.map((option, index) => (
          <Option
            key={option.id}
            index={index}
            showIndex
            label={option.label}
            isSelected={
              isMulti
                ? selectedOptionIds.includes(option.id)
                : index === selectedOptionIndex
            }
            isCorrect={currentQuestion.correctId.includes(option.id)}
            showSolution={showSolution}
            hasBeenIncorrectlyGuessed={quiz.previousGuesses.includes(option.id)}
            compact
            onClick={() => selectOption(index)}
          />
        ))}
      </div>
      <div className='lx-embed-row'>
        {showSolution ? (
          <button
            type='button'
            onClick={handleNextQuestion}
            className='lx-embed-cta motion-button'
          >
            {willFinishOnNext ? 'See result' : 'Next question'}
          </button>
        ) : (
          <button
            type='button'
            onClick={onCheckAnswer}
            className='lx-embed-cta motion-button'
            disabled={
              isMulti
                ? selectedOptionIds.length === 0
                : selectedOptionIndex == null
            }
          >
            Check answer
          </button>
        )}
        <Link
          href='/informal/definitions/quiz'
          className='lx-embed-ghost motion-button'
        >
          Full drill
        </Link>
      </div>
    </div>
  );
}
