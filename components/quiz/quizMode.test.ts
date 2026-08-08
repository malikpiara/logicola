import { describe, expect, it } from 'vitest';
import {
  DEFAULT_QUIZ_MODE,
  defaultModeForSet,
  modeBlurb,
  progressLabel,
  scoreMode,
} from './quizMode';
import { DEFAULT_LEVEL } from '@/lib/scoring';

describe('defaultModeForSet — the scored run is the release mode', () => {
  it.each(['Set A', 'Set C', 'Set J', 'Set L', 'Set N', 'Set Q', 'Set R'])(
    '%s opens scored at the default level',
    (name) => {
      expect(defaultModeForSet(name)).toEqual({
        kind: 'score',
        level: DEFAULT_LEVEL,
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
    expect(scoreMode(99)).toEqual({ kind: 'score', level: 9 });
    expect(scoreMode(-3)).toEqual({ kind: 'score', level: 0 });
  });
});
