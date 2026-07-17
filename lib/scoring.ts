/**
 * LogiCola scoring — a restoration of the 2008 engine's model, per set.
 *
 * Source of truth: the XOR-0x11-decoded PILOT-dialect programs Gensler
 * shipped inside LCEXE_2008.exe, at
 * logicola-ghidra/notes/exercises/2008/decoded/set_*.txt.
 *
 * The single most important fact: THERE IS NO GLOBAL SCORING MODEL. Every
 * set scores differently, and the differences are not cosmetic — they are
 * different economies. Derived by reading each set's own `k:` directives
 * (note they hide behind labels, e.g. `*j k:+5+q+q`, so a naive `^k` grep
 * misses them):
 *
 *   Set        reward          penalty on a miss              forfeit?
 *   ---------  --------------  -----------------------------  --------
 *   A C J L N  k:+5+q+q        k:-t, t := 2*level, C:tt/2     no
 *   Q          ky:+7           kn:-2*$s (flat, every miss)    no
 *   R          ky:+$r  (r=8)   ky:-2*$q once, then q := 0      YES (r := 0)
 *
 * What's shared: everyone starts at 0, targets 100, and the level only ever
 * scales the PENALTY. The 2008 help says so twice — "The scoring level
 * doesn't influence how hard the problems are, but only how many points you
 * lose for wrong answers." The problems drawn are identical at level 1 and 9.
 *
 * What differs, and why it matters:
 *
 *   - `+5+q+q` is NOT "5 + 2*level". Bare `q` is an integer register, and in
 *     the translation sets it's the type-the-answer flag (`*y jq:q` jumps to
 *     the "Type the correct translation" routine). So the reward is 5 for
 *     multiple-choice and 7 for typing. LC3 has no type mode, so it's 5.
 *   - Set A resets `t := 2*level` per problem (`j:y` ends every template, and
 *     `*y` re-runs the init), then HALVES it on each miss: 2L, L, L/2, L/4…
 *     Set R instead zeroes its penalty after one miss. Same intent — don't
 *     punish grinding one problem — opposite implementation.
 *   - Only Set R forfeits. Its `r0` means a missed problem can never pay its
 *     8 out, so a level-9 miss is an 18-point charge PLUS 8 never earned: a
 *     26-point swing on a 100-point target. In Set A you still collect the
 *     full +5 after any number of misses.
 *
 * Unpublished sets are deliberately absent. B/D/E/F/P are bespoke (five
 * different reward values in B alone), and the proofs sets (G/I/K/M/O) have
 * NO reward directive at all — only `-2*$s*q` and `-$s/2` penalties — which
 * needs its own investigation before anyone can claim to have ported them.
 *
 * Deliberately faithful details that look like bugs:
 *   - No floor. The score can go negative; the original never clamps, and
 *     clamping would silently defuse high levels.
 *   - Completion is a threshold, not a length. There is no problem count.
 *   - Nothing is recorded on failure or abandonment ("no fault" scoring).
 */

/** Points needed to complete an exercise (2008 help: "only when you reach 100 points"). */
export const TARGET_SCORE = 100;

/**
 * Scoring levels. 1–9 are live; 0 means scoring is off, which the original
 * offers as an OPTIONS setting for practice that isn't recorded.
 */
export const MIN_LEVEL = 1;
export const MAX_LEVEL = 9;
export const SCORING_OFF = 0;

/**
 * Gensler's own courses expect 7: "Try to do the exercises at an average
 * level of 7 or higher… You get a +1 bonus for each number N is above 7."
 * Note this is a per-course setting in the original — LogiSkor has a LEVEL
 * option under TOOLS, and e.g. Carleton's PHIL 2001 sets it to 6 — so 7 is
 * the author's default, not a law.
 */
export const DEFAULT_LEVEL = 7;

/** How a set's penalty changes after each miss on the same problem. */
export type PenaltyDecay =
  /** Set R: `c0<y:q0` — charged once, then free. */
  | 'zero'
  /** Sets A/C/J/L/N: `C:tt/2` — halves each miss (integer division). */
  | 'halve'
  /** Set Q: no decay directive — the full penalty, every miss. */
  | 'none';

export interface ScoringProfile {
  /** Points a clean solve awards (Set R `r8`; translations `+5`; Q `+7`). */
  readonly pointsPerCorrect: number;
  readonly decay: PenaltyDecay;
  /** Set R alone zeroes `r`, so a missed problem never pays out. */
  readonly forfeitOnMiss: boolean;
}

/** A/C/J/L/N share one program shape, so they share one profile. */
const TRANSLATION_PROFILE: ScoringProfile = {
  // `+5+q+q` with q = the type-the-answer flag, which LC3 never sets.
  pointsPerCorrect: 5,
  decay: 'halve',
  forfeitOnMiss: false,
};

/** Keyed by the set letter in `subSet.name` ('Set R' -> 'R'). */
export const SCORING_PROFILES: Readonly<Record<string, ScoringProfile>> = {
  A: TRANSLATION_PROFILE,
  C: TRANSLATION_PROFILE,
  J: TRANSLATION_PROFILE,
  L: TRANSLATION_PROFILE,
  N: TRANSLATION_PROFILE,
  Q: { pointsPerCorrect: 7, decay: 'none', forfeitOnMiss: false },
  R: { pointsPerCorrect: 8, decay: 'zero', forfeitOnMiss: true },
};

/**
 * Resolve a set's profile from its `name` ('Set R'). Returns undefined for
 * sets whose original scoring hasn't been derived — callers must not invent
 * one, because a wrong constant is worse than no scored run.
 */
export function profileForSet(
  setName: string | undefined
): ScoringProfile | undefined {
  const letter = /^Set\s+([A-Z])$/.exec((setName ?? '').trim())?.[1];
  return letter ? SCORING_PROFILES[letter] : undefined;
}

export function canScore(setName: string | undefined): boolean {
  return profileForSet(setName) !== undefined;
}

export interface ScoreState {
  /** Running total. Starts at 0, may go negative — see module docstring. */
  readonly score: number;
  /** 1–9, or 0 for scoring off. Constant for a run. */
  readonly level: number;
  readonly profile: ScoringProfile;
  /** Points the current problem can still award. */
  readonly pointsAvailable: number;
  /** What the next miss on this problem costs, after decay. */
  readonly penaltyDue: number;
  /** Problems solved first try — for the end screen. */
  readonly solvedClean: number;
  /** Problems where at least one miss happened. */
  readonly missed: number;
}

/** The opening penalty for any set: `2 * level` (`t2*$s`, `-2*$s`, `-2*$q`). */
export function openingPenalty(level: number): number {
  return 2 * clampLevel(level);
}

export function clampLevel(level: number): number {
  if (!Number.isFinite(level)) return DEFAULT_LEVEL;
  const n = Math.trunc(level);
  if (n <= SCORING_OFF) return SCORING_OFF;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, n));
}

export function createScoreState(
  profile: ScoringProfile,
  level: number = DEFAULT_LEVEL
): ScoreState {
  const lvl = clampLevel(level);
  return {
    score: 0,
    level: lvl,
    profile,
    pointsAvailable: profile.pointsPerCorrect,
    penaltyDue: openingPenalty(lvl),
    solvedClean: 0,
    missed: 0,
  };
}

/** Arm a fresh problem — both registers restored, so a miss never leaks forward. */
export function beginProblem(state: ScoreState): ScoreState {
  return {
    ...state,
    pointsAvailable: state.profile.pointsPerCorrect,
    penaltyDue: openingPenalty(state.level),
  };
}

function decayed(due: number, decay: PenaltyDecay): number {
  switch (decay) {
    case 'zero':
      return 0;
    // `C:tt/2` on an integer register — truncating division, so it walks
    // 2L, L, L/2 … down to 0 rather than approaching it asymptotically.
    case 'halve':
      return Math.floor(due / 2);
    case 'none':
      return due;
  }
}

/** Record a miss: charge what's due, forfeit if this set forfeits, then decay. */
export function registerMiss(state: ScoreState): ScoreState {
  const firstMiss = state.pointsAvailable === state.profile.pointsPerCorrect;
  return {
    ...state,
    score: state.score - state.penaltyDue,
    pointsAvailable: state.profile.forfeitOnMiss ? 0 : state.pointsAvailable,
    penaltyDue: decayed(state.penaltyDue, state.profile.decay),
    missed: firstMiss ? state.missed + 1 : state.missed,
  };
}

/** Record a correct answer: award whatever the problem has left. */
export function registerCorrect(state: ScoreState): ScoreState {
  const clean = state.pointsAvailable === state.profile.pointsPerCorrect;
  return {
    ...state,
    score: state.score + state.pointsAvailable,
    solvedClean: clean ? state.solvedClean + 1 : state.solvedClean,
  };
}

/** Has the run reached the target? */
export function isComplete(state: ScoreState): boolean {
  return state.score >= TARGET_SCORE;
}

/** Fewest clean answers that can reach the target, for this set. */
export function minPerfectRun(profile: ScoringProfile): number {
  return Math.ceil(TARGET_SCORE / profile.pointsPerCorrect);
}

/** Progress toward the target, 0–1. Clamped: the score can be negative, a bar can't. */
export function progress(state: ScoreState): number {
  return Math.min(1, Math.max(0, state.score / TARGET_SCORE));
}
