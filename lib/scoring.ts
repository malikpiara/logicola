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
 *   Q          ky:+7           kn:-2*$s (ONE shot — see below) no
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
 *   - SET Q HAS NO DECAY DIRECTIVE BECAUSE IT HAS NO SECOND ATTEMPT (traced
 *     2026-08-12). Its program is one shot per item: every problem ends
 *     `j:a` into the single present/accept/grade routine at `*a`, and there
 *     is no jump back to the accept anywhere in the file. Set A by contrast
 *     has an accept label `*d` and two wrong-answer routines (`*e` wrong
 *     translation, `*w` malformed wff) that both end `j:d` — back to re-ask.
 *     The wording tracks the structure: R says "Please try again", Q says
 *     only "Sorry, #x is wrong" and shows the violated rule. So Q was never
 *     "the full penalty every miss" — it was +7 or -2*level, once, and then
 *     the next item.
 *
 *     Reading the silence as `decay: 'none'` was faithful to the directive
 *     and wrong about the intent, and it cost real money: LC3 gives Q three
 *     attempts (`maxWrongGuesses`), so a botched item charged 3 x 2*level
 *     where Gensler charged one. At the shipped level that is -23 against
 *     his -10. `'halve'` is the honest reconstruction — see the profile.
 *
 * Unpublished sets are deliberately absent. B/D/E/F/P are bespoke (five
 * different reward values in B alone), and the proofs sets (G/I/K/M/O) have
 * NO reward directive at all — only `-2*$s*q` and `-$s/2` penalties — which
 * needs its own investigation before anyone can claim to have ported them.
 *
 * Deliberately faithful details that look like bugs:
 *   - No floor. The score can go negative; the original never clamps, and
 *     clamping would silently defuse high levels. See `ScoreFloor` — the
 *     shipped default now departs from this on purpose, and the departure
 *     is a run policy, not a change to any set's economy.
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
  /**
   * Q's decay is LC3's, not Gensler's — the one reconstructed constant here,
   * and it is reconstructed because LC3 changed the interaction first.
   *
   * The original was one pick from seven (`c:^1234567`), graded once. LC3
   * made Q multi-select with the subset rule, deliberately, because a
   * definition can have more than one flaw — so the single-shot economy no
   * longer has the interaction it was calibrated to. Grafting Gensler's
   * one-charge penalty onto a three-attempt item is not fidelity; it just
   * charges his once-per-item price up to three times per item.
   *
   * `'halve'` over `'zero'` for three reasons (Malik, 2026-08-12):
   *   - Both cost the same on a second-attempt solve (the FIRST miss is
   *     charged in full under either), so the case this change is for —
   *     someone who gets it on the retry — is served identically.
   *   - They differ only from the third attempt on, and Q is the only
   *     scored set with no per-option hints: a wrong pick is flagged and
   *     stripped, but nothing explains it. Free late attempts on the set
   *     that teaches least between attempts is elimination-guessing.
   *   - It lands on Gensler's own magnitude. A fully botched item costs
   *     -(10+5+2)+7 = -10 at the shipped level — exactly his -10 for a
   *     missed item — where `'zero'` would charge -3.
   *
   * Flip to `'zero'` for a gentler run; nothing else has to move.
   */
  Q: { pointsPerCorrect: 7, decay: 'halve', forfeitOnMiss: false },
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

/**
 * How far a run is allowed to fall into deficit (Malik, 2026-08-12, from
 * playtest feedback: "users can keep getting negative points after their
 * points are already negative").
 *
 * This is the one place LC3 knowingly diverges from the 2008 engine, so it
 * is modelled as a property of the RUN, not of a set: `ScoringProfile` stays
 * a pure record of what Gensler's DSL does, and every set keeps its own
 * reward, decay and forfeit untouched under either floor.
 *
 * Why a floor at all. Under the 2008 economy the deficit compounds without
 * limit, and `progress()` clamps at 0 — so a learner in the red watches an
 * empty bar that does not move when they get one RIGHT. They are paying off
 * invisible debt. Measured at the shipped level 5, a Set Q learner who
 * botches half the problems finishes the 60-question pool around -90 (it
 * was -300 before Q's decay was reconstructed). Under this floor the same
 * learner, giving the same answers, ends level and is never more than one
 * penalty down.
 *
 * What it does NOT do, deliberately recorded so nobody assumes otherwise:
 * it does not make a weak run winnable. The minimum first-try accuracy that
 * can reach 100 is unchanged by the floor — 74% for the translation sets,
 * 62% for Q, 58% for R at level 5 — because forgiveness only applies BELOW
 * zero and the climb to 100 happens almost entirely above it. Closing that
 * gap is a different lever (a per-problem charge cap, or a lower
 * SHIPPED_LEVEL) and has not been pulled.
 *
 * Note those thresholds are NOT a property of the floor and move when an
 * economy is corrected: Q's was 78% until its decay was fixed.
 */
export type ScoreFloor =
  /**
   * The 2008 engine: no floor, the deficit compounds without limit. Kept
   * live (and tested) because it is the restoration — this is the value a
   * future "Gensler" mode would select.
   */
  | 'none'
  /**
   * Shipped default. A miss charges in full while the score is at or above
   * zero, so the first one still bites and can push the run into deficit —
   * but once there, further misses cost nothing until the learner climbs
   * back out. The deficit is therefore at most one penalty deep instead of
   * unbounded, and a couple of correct answers always restores the bar.
   *
   * Only the CHARGE is suppressed. A free miss still forfeits (Set R), still
   * decays the penalty register, and still counts toward `missed` and the
   * reveal budget — being in the red buys mercy on points, not credit for
   * answers the learner did not get right.
   */
  | 'no-deeper';

export interface ScoreState {
  /** Running total. Starts at 0, may go negative — see module docstring. */
  readonly score: number;
  /** 1–9, or 0 for scoring off. Constant for a run. */
  readonly level: number;
  readonly profile: ScoringProfile;
  /** Deficit policy for the run. Constant for a run, like `level`. */
  readonly floor: ScoreFloor;
  /** Points the current problem can still award. */
  readonly pointsAvailable: number;
  /**
   * What the next miss on this problem costs BEFORE the floor is consulted.
   * This is the DSL's penalty register; `chargeFor()` is what actually lands.
   */
  readonly penaltyDue: number;
  /** Problems solved first try — for the end screen. */
  readonly solvedClean: number;
  /** Problems where at least one miss happened. */
  readonly missed: number;
  /**
   * The current problem has already been missed. This flag — not the
   * points register — is what makes solvedClean/missed mean what their
   * docstrings say: until 2026-08-24 both were derived from
   * `pointsAvailable === pointsPerCorrect`, which only ever moves on
   * the one forfeiting set (R), so on A/C/J/L/N/Q `missed` counted
   * every repeat miss and `solvedClean` counted dirty solves. The
   * ECONOMY (score/pointsAvailable/penaltyDue) is untouched: this flag
   * feeds only the tallies.
   */
  readonly problemMissed: boolean;
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

/**
 * `floor` defaults to the faithful `'none'` on purpose: this module is the
 * restoration, so the harsh behaviour is what you get if nobody chooses.
 * The product default lives with the other product choices, next to
 * `SHIPPED_LEVEL` in components/quiz/quizMode.ts.
 */
export function createScoreState(
  profile: ScoringProfile,
  level: number = DEFAULT_LEVEL,
  floor: ScoreFloor = 'none'
): ScoreState {
  const lvl = clampLevel(level);
  return {
    score: 0,
    level: lvl,
    profile,
    floor,
    pointsAvailable: profile.pointsPerCorrect,
    penaltyDue: openingPenalty(lvl),
    solvedClean: 0,
    missed: 0,
    problemMissed: false,
  };
}

/** Arm a fresh problem — both registers restored, so a miss never leaks forward. */
export function beginProblem(state: ScoreState): ScoreState {
  return {
    ...state,
    pointsAvailable: state.profile.pointsPerCorrect,
    penaltyDue: openingPenalty(state.level),
    problemMissed: false,
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

/**
 * What a miss would actually cost right now — `penaltyDue` after the run's
 * floor has had its say. Exported because the UI needs the same answer the
 * engine will give: the progress bar's damage flash is a lie when nothing
 * is taken (a run in the red under `'no-deeper'`, or a penalty register the
 * DSL has already decayed to 0).
 */
export function chargeFor(state: ScoreState): number {
  if (state.floor === 'no-deeper' && state.score < 0) return 0;
  return state.penaltyDue;
}

/** Record a miss: charge what's due, forfeit if this set forfeits, then decay. */
export function registerMiss(state: ScoreState): ScoreState {
  return {
    ...state,
    // Everything below the score is deliberately floor-blind: a free miss is
    // still a miss. See `ScoreFloor`.
    score: state.score - chargeFor(state),
    pointsAvailable: state.profile.forfeitOnMiss ? 0 : state.pointsAvailable,
    penaltyDue: decayed(state.penaltyDue, state.profile.decay),
    missed: state.problemMissed ? state.missed : state.missed + 1,
    problemMissed: true,
  };
}

/** Record a correct answer: award whatever the problem has left. */
export function registerCorrect(state: ScoreState): ScoreState {
  return {
    ...state,
    score: state.score + state.pointsAvailable,
    solvedClean: state.problemMissed ? state.solvedClean : state.solvedClean + 1,
  };
}

/**
 * Problems this run has resolved — each counted once, clean or missed.
 * The denominator for any per-run rate (analytics score_percentage,
 * the end screen's ratio). Lives here so every consumer shares one
 * definition.
 */
export function problemsResolved(state: ScoreState): number {
  return state.solvedClean + state.missed;
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
