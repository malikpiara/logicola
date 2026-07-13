import { describe, expect, it } from 'vitest';
import { mulberry32, pickFrom, rngFromSeed } from './rng';

describe('mulberry32', () => {
  it('returns floats in [0, 1)', () => {
    const rng = mulberry32(12345);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('is deterministic for the same seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      expect(a()).toBe(b());
    }
  });

  it('produces different sequences for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    let differences = 0;
    for (let i = 0; i < 100; i++) {
      if (a() !== b()) differences++;
    }
    // All 100 should differ; allow a tiny margin for paranoia
    expect(differences).toBeGreaterThan(95);
  });

  it('first 5 values match a recorded golden (catches accidental algorithm changes)', () => {
    // If this test breaks, you've changed the PRNG and broken every
    // existing snapshot test that was seeded with this PRNG. Update
    // intentionally and re-snapshot every dependent test.
    const rng = mulberry32(42);
    const sample = Array.from({ length: 5 }, () => rng());
    expect(sample).toMatchSnapshot();
  });
});

describe('rngFromSeed', () => {
  it('returns Math.random when seed is undefined', () => {
    expect(rngFromSeed(undefined)).toBe(Math.random);
  });

  it('returns a deterministic PRNG when seed is provided', () => {
    const a = rngFromSeed(7);
    const b = rngFromSeed(7);
    expect(a()).toBe(b());
  });

  it('treats seed=0 as a valid seed (not falsy fallback)', () => {
    const rng = rngFromSeed(0);
    expect(rng).not.toBe(Math.random);
    // Same seed must produce same first value
    expect(rngFromSeed(0)()).toBe(rngFromSeed(0)());
  });
});

describe('pickFrom', () => {
  it('returns an element from the pool', () => {
    const rng = mulberry32(1);
    const pool = ['a', 'b', 'c'] as const;
    for (let i = 0; i < 100; i++) {
      expect(pool).toContain(pickFrom(rng, pool));
    }
  });

  it('is deterministic when given a seeded rng', () => {
    const pool = ['a', 'b', 'c', 'd', 'e'] as const;
    const a = mulberry32(99);
    const b = mulberry32(99);
    for (let i = 0; i < 20; i++) {
      expect(pickFrom(a, pool)).toBe(pickFrom(b, pool));
    }
  });

  it('throws on empty pool', () => {
    expect(() => pickFrom(Math.random, [])).toThrow('pickFrom: pool is empty');
  });
});
