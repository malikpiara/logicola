import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LEVEL,
  SCORING_PROFILES,
  TARGET_SCORE,
  beginProblem,
  canScore,
  chargeFor,
  clampLevel,
  createScoreState,
  isComplete,
  minPerfectRun,
  openingPenalty,
  profileForSet,
  progress,
  registerCorrect,
  registerMiss,
  type ScoreFloor,
  type ScoreState,
  type ScoringProfile,
} from './scoring';

const R = SCORING_PROFILES.R!; // +8, penalty zeroes after one miss, forfeits
const A = SCORING_PROFILES.A!; // +5, penalty halves, no forfeit
const Q = SCORING_PROFILES.Q!; // +7, penalty halves (reconstructed), no forfeit

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

describe('profiles match each set’s own scoring', () => {
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
    expect(Q.pointsPerCorrect).toBe(7);
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

  it('re-arms the penalty to 2*level on the next problem', () => {
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

  // The tallies count PROBLEMS, not events — even on sets that never
  // forfeit. Until 2026-08-24 both were derived from pointsAvailable,
  // which only Set R ever moves, so a twice-missed Set A problem
  // counted as two misses AND a clean solve (the end screen's ratio
  // and score_percentage both lied). problemMissed pins the truth.
  it('a problem missed twice then solved counts one miss, zero clean', () => {
    let s = beginProblem(createScoreState(A, 7));
    s = registerMiss(s);
    s = registerMiss(s);
    s = registerCorrect(s);
    expect(s.missed).toBe(1);
    expect(s.solvedClean).toBe(0);
    // The next problem starts clean again.
    s = registerCorrect(beginProblem(s));
    expect(s.solvedClean).toBe(1);
    expect(s.missed).toBe(1);
  });
});

describe('Set Q — +7, decay reconstructed for LC3’s retries', () => {
  it('charges the first miss at the full 2*level, as the original does', () => {
    // The one charge Gensler's single-shot program ever made.
    expect(registerMiss(beginProblem(createScoreState(Q, 7))).score).toBe(-14);
  });

  it('tapers after that, rather than charging a one-shot price three times', () => {
    let s = beginProblem(createScoreState(Q, 7));
    const charged: number[] = [];
    let prev = s.score;
    for (let i = 0; i < 3; i++) {
      s = registerMiss(s);
      charged.push(prev - s.score);
      prev = s.score;
    }
    expect(charged).toEqual([14, 7, 3]);
  });

  it('lands a botched item on Gensler’s own net at the shipped level', () => {
    // He charged -2*level once and awarded nothing on a missed item: -10.
    // LC3 charges 10+5+2 across three attempts and still pays the 7, which
    // nets the same -10. The old 'none' reading — his one-shot price billed
    // three times, then +7 — was -23.
    expect(missThenSolve(createScoreState(Q, 5), 3).score).toBe(-10);
  });

  it('costs the same as ’zero’ would on a second-attempt solve', () => {
    // The case the reconstruction is for: the first miss is charged in full
    // under either decay, so 'halve' buys the retry nothing extra. The two
    // only diverge from the third attempt on.
    expect(missThenSolve(createScoreState(Q, 5), 1).score).toBe(-10 + 7);
  });

  it('still awards 7 afterwards — Q never forfeits', () => {
    expect(missThenSolve(createScoreState(Q, 7), 2).score).toBe(-21 + 7);
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

describe('the no-deeper floor — LC3’s one departure from the 2008 engine', () => {
  /** Every set opens under the shipped floor for these. */
  const floored = (p: ScoringProfile, level = 5) =>
    createScoreState(p, level, 'no-deeper');

  it('still charges the first miss in full — the deficit is entered, not skipped', () => {
    // The floor is not "no penalties". Being at 0 is not being in the red.
    expect(registerMiss(beginProblem(floored(Q))).score).toBe(-10);
  });

  it('charges in full from a positive score, even past zero', () => {
    // At 3 points a 10-point penalty still lands whole: you were not in the
    // red when you answered. This is the case a clamp-at-zero floor would
    // have softened to 0 and this one deliberately does not.
    const s = registerMiss({ ...beginProblem(floored(Q)), score: 3 });
    expect(s.score).toBe(-7);
  });

  it('charges nothing once the run is already in the red', () => {
    let s = beginProblem(floored(Q));
    s = registerMiss(s); // -10, the run's one paid miss
    for (let i = 0; i < 5; i++) s = registerMiss(beginProblem(s));
    expect(s.score).toBe(-10); // and never deeper, across problems
  });

  it('re-arms the charge as soon as the learner climbs back out', () => {
    let s = registerMiss(beginProblem(floored(Q))); // -10
    s = registerCorrect(s); // +7 -> -3, still in the red
    expect(registerMiss(beginProblem(s)).score).toBe(-3); // free
    s = registerCorrect(beginProblem(s)); // +7 -> 4, out
    expect(registerMiss(beginProblem(s)).score).toBe(-6); // charged in full
  });

  it('caps the deficit at one penalty, where ’none’ compounds without limit', () => {
    let free = beginProblem(floored(R, 9));
    let faithful = beginProblem(createScoreState(R, 9)); // floor 'none'
    for (let i = 0; i < 3; i++) {
      free = registerMiss(beginProblem(free));
      faithful = registerMiss(beginProblem(faithful));
    }
    expect(free.score).toBe(-18);
    expect(faithful.score).toBe(-54);
  });

  it('buys mercy on points, never credit for the answer', () => {
    // A free miss is still a miss: Set R forfeits its +8, the penalty
    // register still decays, and the problem still counts as missed.
    let s = registerMiss(beginProblem(floored(R))); // -10, in the red
    s = beginProblem(s);
    const before = s.missed;
    s = registerMiss(s); // free
    expect(s.score).toBe(-10);
    expect(s.missed).toBe(before + 1);
    expect(s.pointsAvailable).toBe(0); // forfeited anyway
    expect(registerCorrect(s).score).toBe(-10); // so solving pays nothing
  });

  it('leaves every set’s economy alone — the floor is a run policy', () => {
    // Rewards and penalty shapes are untouched; only the accumulator is
    // fenced. A clean run is bit-identical under either floor.
    for (const p of [R, A, Q] as ScoringProfile[]) {
      let free = floored(p, 9);
      let faithful = createScoreState(p, 9);
      for (let i = 0; i < 13; i++) {
        free = clean(free);
        faithful = clean(faithful);
      }
      expect(free.score).toBe(faithful.score);
    }
  });

  it('chargeFor answers for the UI exactly what registerMiss will do', () => {
    for (const floor of ['none', 'no-deeper'] as const) {
      for (const p of [R, A, Q] as ScoringProfile[]) {
        let s = beginProblem(createScoreState(p, 7, floor));
        for (let i = 0; i < 4; i++) {
          const quoted = chargeFor(s);
          const after = registerMiss(s);
          expect(s.score - after.score).toBe(quoted);
          s = beginProblem(after);
        }
      }
    }
  });

  /** A full 60-question pool at the shipped level, half the problems botched. */
  const halfRight = (floor: ScoreFloor) => {
    let s = createScoreState(Q, 5, floor);
    let low = 0;
    for (let i = 0; i < 60 && !isComplete(s); i++) {
      s = beginProblem(s);
      if (i % 2) for (let k = 0; k < 3; k++) s = registerMiss(s); // botched
      s = registerCorrect(s);
      low = Math.min(low, s.score);
    }
    return { ...s, low };
  };

  it('turns an unpayable debt into a visible setback', () => {
    // The outcome the change is actually for. Same learner, same answers:
    // without the floor they finish the pool deep under water, having
    // watched an empty bar for an hour; under the floor they end level,
    // and were never more than a few points down.
    expect(halfRight('none').score).toBeLessThan(-50);
    expect(halfRight('no-deeper').score).toBeGreaterThanOrEqual(0);
    expect(halfRight('no-deeper').low).toBeGreaterThan(-2 * 5); // one penalty
  });

  it('does NOT make a sub-break-even run winnable — that is a separate lever', () => {
    // Worth pinning, because it is the tempting thing to assume. The floor
    // only forgives charges taken BELOW zero, and reaching 100 is spent
    // almost entirely above zero, where the economy is untouched. Measured
    // over 200 problems at 1% steps, the minimum first-try accuracy that
    // reaches 100 is identical under both floors: 74% for the translation
    // sets, 62% for Q, 58% for R at level 5. Closing that gap means a
    // per-problem charge cap or a lower SHIPPED_LEVEL, not this.
    expect(isComplete(halfRight('no-deeper'))).toBe(false);
    expect(isComplete(halfRight('none'))).toBe(false);
  });
});

describe('faithful edge cases', () => {
  it('lets the score go negative — the original never clamps', () => {
    let s = createScoreState(R, 9);
    for (let i = 0; i < 3; i++) s = registerMiss(beginProblem(s));
    expect(s.score).toBe(-54);
  });

  it('defaults to the faithful floor, so the restoration is what you get', () => {
    expect(createScoreState(R, 9).floor).toBe('none');
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
