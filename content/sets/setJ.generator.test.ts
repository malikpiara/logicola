/**
 * Set J generator tests.
 *
 * Same shape as setA/setC.generator.test.ts: deterministic snapshot
 * at a fixed seed, plus property tests covering option count, hint
 * presence, KaTeX delimiter integrity (with the modal-specific
 * \square / \lozenge macros), and ID uniqueness.
 *
 * Set J is the first generator with **plain-text options**
 * (the "Ambiguous between X and Y" choice — see Gensler §10.1's
 * box-inside vs box-outside ambiguity), so the option-label
 * shape-tests admit either KaTeX-delimited wffs OR plain text
 * starting with "Ambiguous".
 */

import { describe, expect, it } from 'vitest';
import {
  basicQuestions,
  generateSetJ,
  quantifiedQuestions,
} from './setJ.generator';

const TEST_SEED = 42;
const TEST_PER_SUBSET = 10;

describe('setJ generator — top-level', () => {
  it('matches snapshot for seed 42', () => {
    expect(generateSetJ(TEST_SEED, TEST_PER_SUBSET)).toMatchSnapshot();
  });

  it('produces distinct outputs for different seeds', () => {
    const a = generateSetJ(1, TEST_PER_SUBSET);
    const b = generateSetJ(2, TEST_PER_SUBSET);
    const promptsA = a.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    const promptsB = b.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    expect(promptsA).not.toEqual(promptsB);
  });

  it('respects perSubset count', () => {
    const set = generateSetJ(TEST_SEED, 5);
    for (const subset of set.subSets) {
      expect(subset.questions.length).toBe(5);
    }
  });

  it('preserves the canonical Set metadata across seeds', () => {
    const set = generateSetJ(TEST_SEED, 1);
    expect(set.name).toBe('Set J');
    expect(set.subSets[0]!.title).toMatch(/Basic/i);
    expect(set.subSets[1]!.title).toMatch(/Quantified/i);
    expect(set.subSets[0]!.slugs).toEqual(['modal', 'translations', 'basic']);
    expect(set.subSets[1]!.slugs).toEqual([
      'modal',
      'translations',
      'quantified',
    ]);
  });
});

describe('setJ generator — property tests', () => {
  it.each([1, 42, 99, 12345])(
    'seed %i: the truth-vs-statement mixup hint only sits on conjunction-shaped options',
    (seed) => {
      // Domain truth (2008 *56/*57): "You translated ‘contingent truth’
      // instead of ‘contingent statement’ (or vice versa)" only makes
      // sense on an option that IS the other idiom's translation — and
      // both translations are conjunctions. A lone ‘◇J’ is neither
      // (2008 gives it "‘Contingent’ means more than ‘possible’"), so a
      // mixup hint on a conjunction-free option is a mis-seated hint.
      const set = generateSetJ(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          for (const o of q.options) {
            if (o.hint?.includes('instead of ‘contingent')) {
              expect(o.label).toContain('\\cdot');
            }
          }
        }
      }
    }
  );

  it.each([1, 42, 99, 12345])(
    'seed %i: every generated question has 4 unique-id options 0..3',
    (seed) => {
      const set = generateSetJ(seed, TEST_PER_SUBSET);
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
      const set = generateSetJ(seed, TEST_PER_SUBSET);
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
    'seed %i: option labels are either KaTeX wffs or plain "Ambiguous between..." text',
    (seed) => {
      const set = generateSetJ(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          for (const o of q.options) {
            const isKatex = /^\$ .+ \$$/.test(o.label);
            const isAmbiguous = o.label.startsWith('Ambiguous between');
            expect(
              isKatex || isAmbiguous,
              `bad label: ${JSON.stringify(o.label)}`
            ).toBe(true);
            // KaTeX options must not contain raw modal Unicode.
            if (isKatex) {
              expect(o.label).not.toMatch(/[☐◇·∨⊃≡∼∃]/);
            }
          }
        }
      }
    }
  );

  it.each([1, 42, 99])(
    'seed %i: every wrong option carries a hint (Layer 1 always)',
    (seed) => {
      const set = generateSetJ(seed, TEST_PER_SUBSET);
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
    const set = generateSetJ(seed, TEST_PER_SUBSET);
    for (const subset of set.subSets) {
      for (const q of subset.questions) {
        expect(q.prompt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it.each([1, 42, 99])(
    'seed %i: question ids are unique within a draw',
    (seed) => {
      const set = generateSetJ(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        const ids = subset.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  );
});

describe('setJ generator — streaming iterators', () => {
  it('basicQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = basicQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('quantifiedQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = quantifiedQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('iterators are deterministic given the same seed', () => {
    const a = basicQuestions(TEST_SEED);
    const b = basicQuestions(TEST_SEED);
    for (let i = 0; i < 20; i++) {
      expect(a.next().value).toEqual(b.next().value);
    }
  });
});
