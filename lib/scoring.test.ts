import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LEVEL,
  SCORING_PROFILES,
  TARGET_SCORE,
  beginProblem,
  canScore,
  clampLevel,
  createScoreState,
  isComplete,
  minPerfectRun,
  openingPenalty,
  profileForSet,
  progress,
  registerCorrect,
  registerMiss,
  type ScoreState,
  type ScoringProfile,
} from './scoring';

const R = SCORING_PROFILES.R!; // +8, penalty zeroes after one miss, forfeits
const A = SCORING_PROFILES.A!; // +5, penalty halves, no forfeit
const Q = SCORING_PROFILES.Q!; // +7, penalty flat, no forfeit

/** Solve a problem cleanly: arm, then answer right. */
function clean(s: ScoreState): ScoreState {
  return registerCorrect(beginProblem(s));
}

/** Miss `n` times on one problem, then solve it. */
function missThenSolve(s: ScoreState, n = 1): ScoreState {
  let out = beginProblem(s);
  for (let i = 0; i < n; i++) out = registerMiss(out);
  return registerCorrect(out);
}

describe('profiles match each set’s own DSL', () => {
  it('reads the set letter out of subSet.name', () => {
    expect(profileForSet('Set R')).toBe(R);
    expect(profileForSet('Set A')).toBe(A);
    expect(profileForSet('Set Q')).toBe(Q);
    expect(canScore('Set R')).toBe(true);
  });

  it('refuses sets whose scoring has not been derived, rather than guessing', () => {
    // B/D/E/F/P are bespoke; G/I/K/M/O have no reward directive at all.
    for (const name of ['Set B', 'Set D', 'Set G', 'Set K', 'Set P']) {
      expect(profileForSet(name)).toBeUndefined();
      expect(canScore(name)).toBe(false);
    }
    expect(profileForSet(undefined)).toBeUndefined();
    expect(profileForSet('Informal Fallacies')).toBeUndefined();
  });

  it('pins the three rewards: translations 5, Q 7, R 8', () => {
    expect(A.pointsPerCorrect).toBe(5); // +5+q+q with q=0 (no type mode)
    expect(Q.pointsPerCorrect).toBe(7); // ky:+7
    expect(R.pointsPerCorrect).toBe(8); // r8
  });

  it('shares the opening penalty: 2 * level, every set', () => {
    for (const level of [1, 5, 9])
      expect(openingPenalty(level)).toBe(2 * level);
  });

  it('makes only Set R forfeit', () => {
    expect(R.forfeitOnMiss).toBe(true);
    expect(A.forfeitOnMiss).toBe(false);
    expect(Q.forfeitOnMiss).toBe(false);
  });
});

describe('Set R — +8, charged once, forfeits', () => {
  it('awards 8 clean, and needs 13 of them (12*8=96 falls short)', () => {
    expect(clean(createScoreState(R, 5)).score).toBe(8);
    expect(minPerfectRun(R)).toBe(13);
    let s = createScoreState(R, 9);
    for (let i = 0; i < 12; i++) s = clean(s);
    expect(isComplete(s)).toBe(false);
    expect(clean(s).score).toBe(104);
  });

  it('charges 2*level once and forfeits the 8', () => {
    const s = missThenSolve(createScoreState(R, 9));
    expect(s.score).toBe(-18); // -18 charged, +0 awarded
    expect(s.solvedClean).toBe(0);
  });

  it('is free to keep missing the same problem (q was zeroed)', () => {
    expect(missThenSolve(createScoreState(R, 9), 1).score).toBe(-18);
    expect(missThenSolve(createScoreState(R, 9), 6).score).toBe(-18);
  });

  it('swings 26 points at level 9 between a clean answer and a miss', () => {
    expect(
      clean(createScoreState(R, 9)).score -
        missThenSolve(createScoreState(R, 9)).score
    ).toBe(26);
  });
});

describe('Set A — +5, penalty halves, no forfeit', () => {
  it('still pays the full 5 after any number of misses', () => {
    // This is the sharpest difference from R: A never forfeits.
    const s = missThenSolve(createScoreState(A, 7), 1);
    expect(s.score).toBe(-14 + 5); // -9
  });

  it('halves the penalty on each successive miss: 14, 7, 3, 1, 0', () => {
    let s = beginProblem(createScoreState(A, 7)); // t = 14
    const charged: number[] = [];
    let prev = s.score;
    for (let i = 0; i < 5; i++) {
      s = registerMiss(s);
      charged.push(prev - s.score);
      prev = s.score;
    }
    expect(charged).toEqual([14, 7, 3, 1, 0]); // C:tt/2 on an int register
  });

  it('re-arms t to 2*level on the next problem (j:y re-runs *y)', () => {
    let s = beginProblem(createScoreState(A, 9));
    s = registerMiss(s); // t: 18 -> 9
    expect(s.penaltyDue).toBe(9);
    s = beginProblem(s);
    expect(s.penaltyDue).toBe(18);
  });

  it('needs 20 clean answers to reach 100', () => {
    expect(minPerfectRun(A)).toBe(20);
    let s = createScoreState(A, 9);
    for (let i = 0; i < 19; i++) s = clean(s);
    expect(s.score).toBe(95);
    expect(isComplete(s)).toBe(false);
    expect(isComplete(clean(s))).toBe(true);
  });
});

describe('Set Q — +7, flat penalty, no forfeit', () => {
  it('charges the full 2*level on every miss, without decay', () => {
    let s = beginProblem(createScoreState(Q, 7));
    s = registerMiss(s);
    s = registerMiss(s);
    s = registerMiss(s);
    expect(s.score).toBe(-42); // 3 x -14, no mercy
  });

  it('still awards 7 afterwards', () => {
    expect(missThenSolve(createScoreState(Q, 7), 2).score).toBe(-28 + 7);
  });
});

describe('the level scales the penalty and never the reward', () => {
  it('holds for every set', () => {
    for (const p of [R, A, Q] as ScoringProfile[]) {
      for (const level of [1, 5, 9]) {
        expect(clean(createScoreState(p, level)).score).toBe(
          p.pointsPerCorrect
        );
        expect(beginProblem(createScoreState(p, level)).penaltyDue).toBe(
          2 * level
        );
      }
    }
  });
});

describe('faithful edge cases', () => {
  it('lets the score go negative — the original never clamps', () => {
    let s = createScoreState(R, 9);
    for (let i = 0; i < 3; i++) s = registerMiss(beginProblem(s));
    expect(s.score).toBe(-54);
  });

  it('level 0 turns scoring off: no penalty', () => {
    expect(registerMiss(beginProblem(createScoreState(R, 0))).score).toBe(0);
    expect(registerMiss(beginProblem(createScoreState(A, 0))).score).toBe(0);
  });

  it('clamps out-of-range levels rather than trusting the caller', () => {
    expect(clampLevel(12)).toBe(9);
    expect(clampLevel(-3)).toBe(0);
    expect(clampLevel(4.7)).toBe(4);
    expect(clampLevel(NaN)).toBe(DEFAULT_LEVEL);
  });

  it('reports progress clamped to 0..1 even when the score is negative', () => {
    expect(progress(createScoreState(R, 9))).toBe(0);
    expect(progress(registerMiss(beginProblem(createScoreState(R, 9))))).toBe(
      0
    );
    expect(progress({ ...createScoreState(R, 9), score: 50 })).toBe(0.5);
    expect(progress({ ...createScoreState(R, 9), score: 104 })).toBe(1);
  });

  it('targets 100 for every set', () => {
    expect(TARGET_SCORE).toBe(100);
  });
});
