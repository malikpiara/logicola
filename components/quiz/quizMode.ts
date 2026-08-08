/**
 * How a quiz run ends.
 *
 * The two shapes are genuinely different, which is why this is a union and
 * not a nullable number:
 *
 *   - `count` — the Khan-style fixed run. Has a denominator: "3 of 10".
 *   - `score` — the 2008 LogiCola run. Has NO denominator. It ends when you
 *     reach 100 points, which might be problem 13 or problem 31. Asking it
 *     "how many questions?" is a category error.
 *
 * RELEASE SCOPE (Malik, 2026-08-06): the scored run REPLACES count mode.
 * Every set whose original scoring has been derived (`canScore`) runs
 * scored-only — no "n of 10", no mode-choice link, no cells progress. The
 * `count` branch stays as dormant code for the future quiz-mode reform,
 * and as the live fallback for sets that cannot honestly score.
 *
 * Everything that used to hardcode `10` should ask this instead. Before this
 * existed the number was restated in five places (two logic, three as English
 * text with the digit typed in), so changing it silently produced a UI that
 * lied — "3 of 10" on question 17.
 */

import {
  DEFAULT_LEVEL,
  TARGET_SCORE,
  canScore,
  clampLevel,
} from '@/lib/scoring';

export type QuizMode =
  | { readonly kind: 'count'; readonly total: number }
  | { readonly kind: 'score'; readonly level: number };

/**
 * The dormant fixed-length run — the fallback for sets with no derived
 * scoring profile, and the shape the future quiz-mode reform picks back up.
 */
export const DEFAULT_QUIZ_MODE: QuizMode = { kind: 'count', total: 10 };

export function scoreMode(level: number = DEFAULT_LEVEL): QuizMode {
  return { kind: 'score', level: clampLevel(level) };
}

/**
 * The mode a set opens in. Scored wherever the set's own 2008 economy has
 * been derived; the count run only survives where scoring one would mean
 * inventing numbers.
 */
export function defaultModeForSet(setName: string | undefined): QuizMode {
  return canScore(setName) ? scoreMode() : DEFAULT_QUIZ_MODE;
}

/**
 * Progress label for the quiz chrome.
 *
 * `count` mode can say how far through you are. `score` mode can't — it
 * reports distance to the target instead, because there is no total.
 */
export function progressLabel(
  mode: QuizMode,
  questionCounter: number,
  score: number
): string {
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
