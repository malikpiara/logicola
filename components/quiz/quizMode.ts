/**
 * How a quiz run ends.
 *
 * PROTOTYPE — wired to feel the mechanic, not to ship.
 *
 * The two shapes are genuinely different, which is why this is a union and
 * not a nullable number:
 *
 *   - `count` — the Khan-style fixed run. Has a denominator: "3 of 10".
 *   - `score` — the 2008 LogiCola run. Has NO denominator. It ends when you
 *     reach 100 points, which might be problem 13 or problem 31. Asking it
 *     "how many questions?" is a category error.
 *
 * Everything that used to hardcode `10` should ask this instead. Before this
 * existed the number was restated in five places (two logic, three as English
 * text with the digit typed in), so changing it silently produced a UI that
 * lied — "3 of 10" on question 17.
 */

import { DEFAULT_LEVEL, TARGET_SCORE, clampLevel } from '@/lib/scoring';

export type QuizMode =
  | { readonly kind: 'count'; readonly total: number }
  | { readonly kind: 'score'; readonly level: number };

/** The default: a cold visitor from search gets a run that promises an ending. */
export const DEFAULT_QUIZ_MODE: QuizMode = { kind: 'count', total: 10 };

export function scoreMode(level: number = DEFAULT_LEVEL): QuizMode {
  return { kind: 'score', level: clampLevel(level) };
}

/**
 * Progress label for the quiz chrome.
 *
 * `count` mode can say how far through you are. `score` mode can't — it
 * reports distance to the target instead, because there is no total.
 */
export function progressLabel(mode: QuizMode, questionCounter: number, score: number): string {
  return mode.kind === 'count'
    ? `${questionCounter} of ${mode.total}`
    : `${score} / ${TARGET_SCORE} points`;
}

/** What the start screen promises before you begin. */
export function modeBlurb(mode: QuizMode): string {
  return mode.kind === 'count'
    ? `${mode.total} questions`
    : `To ${TARGET_SCORE} points · level ${mode.level}`;
}
