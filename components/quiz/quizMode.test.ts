import { describe, expect, it } from 'vitest';
import {
  DEFAULT_QUIZ_MODE,
  SHIPPED_FLOOR,
  SHIPPED_LEVEL,
  compactProgressLabel,
  defaultModeForSet,
  modeBlurb,
  progressLabel,
  scoreMode,
} from './quizMode';
import {
  DEFAULT_LEVEL,
  SCORING_PROFILES,
  createScoreState,
} from '@/lib/scoring';

describe('defaultModeForSet — the scored run is the release mode', () => {
  it('ships at level 5, deliberately below Gensler’s own default of 7', () => {
    // The two are allowed to differ; DEFAULT_LEVEL records the original,
    // SHIPPED_LEVEL is our product choice while the dial is hidden.
    expect(SHIPPED_LEVEL).toBe(5);
    expect(DEFAULT_LEVEL).toBe(7);
  });

  it('ships the forgiving floor, while lib/scoring stays faithful by default', () => {
    // Same split as the levels: the engine restores Gensler, the product
    // chooses. Flipping SHIPPED_FLOOR to 'none' restores the 2008 economy.
    expect(SHIPPED_FLOOR).toBe('no-deeper');
    expect(createScoreState(SCORING_PROFILES.A!).floor).toBe('none');
  });

  it.each(['Set A', 'Set C', 'Set J', 'Set L', 'Set N', 'Set Q', 'Set R'])(
    '%s opens scored at the shipped level and floor',
    (name) => {
      expect(defaultModeForSet(name)).toEqual({
        kind: 'score',
        level: SHIPPED_LEVEL,
        floor: SHIPPED_FLOOR,
      });
    }
  );

  it('sets without a derived economy fall back to the dormant count run', () => {
    expect(defaultModeForSet('Set B')).toEqual(DEFAULT_QUIZ_MODE);
    expect(defaultModeForSet(undefined)).toEqual(DEFAULT_QUIZ_MODE);
    expect(defaultModeForSet('')).toEqual(DEFAULT_QUIZ_MODE);
  });
});

describe('labels', () => {
  it('scored progress reads points, never a question count', () => {
    expect(progressLabel(scoreMode(7), 4, 30)).toBe('30 / 100 points');
  });

  it('count progress (dormant) still reads n of total', () => {
    expect(progressLabel(DEFAULT_QUIZ_MODE, 3, 0)).toBe('3 of 10');
  });

  it('scored blurb states the target and the level', () => {
    expect(modeBlurb(scoreMode(7))).toBe('To 100 points · level 7');
  });

  it('scoreMode clamps out-of-range levels', () => {
    expect(scoreMode(99)).toEqual({
      kind: 'score',
      level: 9,
      floor: SHIPPED_FLOOR,
    });
    expect(scoreMode(-3)).toEqual({
      kind: 'score',
      level: 0,
      floor: SHIPPED_FLOOR,
    });
  });

  it('the phone readout drops the words, never the denominator', () => {
    expect(compactProgressLabel(scoreMode(), 7, 45)).toBe('45/100');
    expect(compactProgressLabel(DEFAULT_QUIZ_MODE, 3, 0)).toBe('3/10');
  });

  it('survives a negative score — the run has no floor at zero', () => {
    // SHIPPED_FLOOR bounds further debt; it does not clamp the score to 0,
    // so the phone row has to hold a minus sign on one line.
    expect(compactProgressLabel(scoreMode(), 4, -10)).toBe('-10/100');
  });

  it('takes an explicit floor — the seam a future “Gensler” mode uses', () => {
    expect(scoreMode(DEFAULT_LEVEL, 'none')).toEqual({
      kind: 'score',
      level: 7,
      floor: 'none',
    });
  });
});
