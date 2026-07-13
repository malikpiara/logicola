/**
 * Set C generator tests.
 *
 * Same shape as setA.generator.test.ts: deterministic snapshot at a
 * fixed seed, plus property tests sweeping multiple seeds to catch
 * generator-shape regressions (option count, ID uniqueness, hint
 * presence on wrong options, KaTeX delimiter integrity, etc.).
 */

import { describe, expect, it } from 'vitest';
import { easyQuestions, generateSetC, hardQuestions } from './setC.generator';

const TEST_SEED = 42;
const TEST_PER_SUBSET = 10;

describe('setC generator — top-level', () => {
  it('matches snapshot for seed 42', () => {
    expect(generateSetC(TEST_SEED, TEST_PER_SUBSET)).toMatchSnapshot();
  });

  it('produces distinct outputs for different seeds', () => {
    const a = generateSetC(1, TEST_PER_SUBSET);
    const b = generateSetC(2, TEST_PER_SUBSET);
    const promptsA = a.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    const promptsB = b.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    expect(promptsA).not.toEqual(promptsB);
  });

  it('respects perSubset count', () => {
    const set = generateSetC(TEST_SEED, 5);
    for (const subset of set.subSets) {
      expect(subset.questions.length).toBe(5);
    }
  });

  it('preserves the canonical Set metadata across seeds', () => {
    const set = generateSetC(TEST_SEED, 1);
    expect(set.name).toBe('Set C');
    expect(set.subSets[0]!.title).toMatch(/Easy/i);
    expect(set.subSets[1]!.title).toMatch(/Hard/i);
    expect(set.subSets[0]!.slugs).toEqual(['propositional', 'translations']);
    expect(set.subSets[1]!.slugs).toEqual([
      'propositional',
      'translations',
      'hard',
    ]);
  });
});

describe('setC generator — property tests', () => {
  it.each([1, 42, 99, 12345])(
    'seed %i: every generated question has 4 unique-id options 0..3',
    (seed) => {
      const set = generateSetC(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          expect(q.options.length).toBe(4);
          const ids = q.options.map((o) => o.id);
          expect(new Set(ids).size).toBe(4);
          expect([...ids].sort((a, b) => a - b)).toEqual([0, 1, 2, 3]);
        }
      }
    }
  );

  it.each([1, 42, 99, 12345])(
    'seed %i: every correctId references a valid option id',
    (seed) => {
      const set = generateSetC(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          const optionIds = new Set(q.options.map((o) => o.id));
          for (const cid of q.correctId) {
            expect(optionIds.has(cid)).toBe(true);
          }
          expect(q.correctId.length).toBeGreaterThan(0);
        }
      }
    }
  );

  it.each([1, 42, 99])(
    'seed %i: option labels are well-formed KaTeX with `$ ... $` delimiters',
    (seed) => {
      const set = generateSetC(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          for (const o of q.options) {
            expect(o.label).toMatch(/^\$ .+ \$$/);
            // Forbid raw Unicode operator chars in the rendered KaTeX
            // (they should have been replaced with \cdot, \vee, etc.).
            expect(o.label).not.toMatch(/[·∨⊃≡∼]/);
          }
        }
      }
    }
  );

  it.each([1, 42, 99])(
    'seed %i: every wrong option carries a hint (Layer 1 always; correct option has no hint)',
    (seed) => {
      const set = generateSetC(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          for (const o of q.options) {
            const isCorrect = q.correctId.includes(o.id);
            if (isCorrect) {
              expect(o.hint).toBeUndefined();
            } else {
              expect(o.hint).toBeDefined();
              expect(o.hint!.trim().length).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  );

  it.each([1, 42, 99])('seed %i: all prompts are non-empty', (seed) => {
    const set = generateSetC(seed, TEST_PER_SUBSET);
    for (const subset of set.subSets) {
      for (const q of subset.questions) {
        expect(q.prompt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it.each([1, 42, 99])(
    'seed %i: question ids are unique within a draw',
    (seed) => {
      const set = generateSetC(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        const ids = subset.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  );
});

describe('setC generator — streaming iterators', () => {
  it('easyQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = easyQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('hardQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = hardQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('iterators are deterministic given the same seed', () => {
    const a = easyQuestions(TEST_SEED);
    const b = easyQuestions(TEST_SEED);
    for (let i = 0; i < 20; i++) {
      expect(a.next().value).toEqual(b.next().value);
    }
  });
});
