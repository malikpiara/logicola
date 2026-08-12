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
  TARGET_SCORE,
  canScore,
  clampLevel,
  type ScoreFloor,
} from '@/lib/scoring';

export type QuizMode =
  | { readonly kind: 'count'; readonly total: number }
  | {
      readonly kind: 'score';
      readonly level: number;
      /** See `ScoreFloor`. Carried on the mode so a retry keeps it. */
      readonly floor: ScoreFloor;
    };

/**
 * The dormant fixed-length run — the fallback for sets with no derived
 * scoring profile, and the shape the future quiz-mode reform picks back up.
 */
export const DEFAULT_QUIZ_MODE: QuizMode = { kind: 'count', total: 10 };

/**
 * The level the app ships at (Malik, 2026-08-09). Deliberately NOT
 * `DEFAULT_LEVEL`: that constant records Gensler's own default of 7
 * ("try to do the exercises at an average level of 7 or higher"), which
 * is a fact about the original and shouldn't move. This is our product
 * choice — a gentler starting cost while the level dial is hidden, so
 * a first run isn't quietly punishing.
 */
export const SHIPPED_LEVEL = 5;

/**
 * The deficit policy the app ships at (Malik, 2026-08-12). Same split as
 * `SHIPPED_LEVEL` above: `lib/scoring.ts` defaults to `'none'` because it is
 * the restoration of Gensler's engine, and this is the product's departure
 * from it. Flipping this constant to `'none'` is the whole of "give me the
 * original economy back" — and a future "Gensler" mode is a second
 * `scoreMode(DEFAULT_LEVEL, 'none')` on the start screen, not a rewrite.
 *
 * Rationale in `ScoreFloor`; the short version is that under `'none'` a
 * struggling learner accumulates unpayable debt behind a progress bar
 * clamped at 0, so nothing they get right registers. This bounds the debt.
 * It does not change who can reach 100 — see the note there.
 */
export const SHIPPED_FLOOR: ScoreFloor = 'no-deeper';

export function scoreMode(
  level: number = SHIPPED_LEVEL,
  floor: ScoreFloor = SHIPPED_FLOOR
): QuizMode {
  return { kind: 'score', level: clampLevel(level), floor };
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
