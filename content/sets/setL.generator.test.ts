/**
 * Set L generator tests.
 *
 * Same shape as setA/setC/setJ.generator.test.ts: deterministic
 * snapshot at fixed seed, plus property tests covering option
 * count, hint presence on wrong options, KaTeX delimiter
 * integrity (with the deontic-specific `\underline{...}` macro
 * for imperative agent letters), and ID uniqueness.
 *
 * Imperative-marker shape-test: every option label that contains
 * an imperative agent letter must use `\underline{...}` rather
 * than the raw `{x}` shorthand from the spec table.
 */

import { describe, expect, it } from 'vitest';
import {
  deonticQuestions,
  generateSetL,
  imperativeQuestions,
} from './setL.generator';

const TEST_SEED = 42;
const TEST_PER_SUBSET = 10;

describe('setL generator — top-level', () => {
  it('matches snapshot for seed 42', () => {
    expect(generateSetL(TEST_SEED, TEST_PER_SUBSET)).toMatchSnapshot();
  });

  it('produces distinct outputs for different seeds', () => {
    const a = generateSetL(1, TEST_PER_SUBSET);
    const b = generateSetL(2, TEST_PER_SUBSET);
    const promptsA = a.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    const promptsB = b.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    expect(promptsA).not.toEqual(promptsB);
  });

  it('respects perSubset count', () => {
    const set = generateSetL(TEST_SEED, 5);
    for (const subset of set.subSets) {
      expect(subset.questions.length).toBe(5);
    }
  });

  it('preserves the canonical Set metadata across seeds', () => {
    const set = generateSetL(TEST_SEED, 1);
    expect(set.name).toBe('Set L');
    expect(set.subSets[0]!.title).toMatch(/Imperative/i);
    expect(set.subSets[1]!.title).toMatch(/Deontic/i);
    expect(set.subSets[0]!.slugs).toEqual([
      'Deontic',
      'translations',
      'Imperative',
    ]);
    expect(set.subSets[1]!.slugs).toEqual([
      'Deontic',
      'translations',
      'Deontic',
    ]);
  });
});

describe('setL generator — property tests', () => {
  it.each([1, 42, 99, 12345])(
    'seed %i: every generated question has 4 unique-id options 0..3',
    (seed) => {
      const set = generateSetL(seed, TEST_PER_SUBSET);
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
      const set = generateSetL(seed, TEST_PER_SUBSET);
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
    'seed %i: option labels are well-formed KaTeX with no leftover spec markers',
    (seed) => {
      const set = generateSetL(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          for (const o of q.options) {
            expect(o.label).toMatch(/^\$ .+ \$$/);
            // Forbid raw Unicode operator chars in the rendered KaTeX.
            expect(o.label).not.toMatch(/[·∨⊃≡∼☐◇∃]/);
            // Forbid the spec's {X} shorthand — should have been
            // converted to \underline{X}.
            expect(o.label).not.toMatch(/(?<!\\underline)\{[A-Za-z]\}/);
          }
        }
      }
    }
  );

  it.each([1, 42, 99])(
    'seed %i: every wrong option carries a hint (Layer 1 always)',
    (seed) => {
      const set = generateSetL(seed, TEST_PER_SUBSET);
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
    const set = generateSetL(seed, TEST_PER_SUBSET);
    for (const subset of set.subSets) {
      for (const q of subset.questions) {
        expect(q.prompt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it.each([1, 42, 99])(
    'seed %i: question ids are unique within a draw',
    (seed) => {
      const set = generateSetL(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        const ids = subset.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  );
});

describe('setL generator — streaming iterators', () => {
  it('imperativeQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = imperativeQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('deonticQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = deonticQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('iterators are deterministic given the same seed', () => {
    const a = imperativeQuestions(TEST_SEED);
    const b = imperativeQuestions(TEST_SEED);
    for (let i = 0; i < 20; i++) {
      expect(a.next().value).toEqual(b.next().value);
    }
  });
});
