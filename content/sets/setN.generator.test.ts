/**
 * Set N generator tests.
 *
 * Same shape as setA/setC/setJ/setL.generator.test.ts: deterministic
 * snapshot at fixed seed, plus property tests covering option count,
 * hint presence on wrong options, KaTeX delimiter integrity (with
 * the belief-specific `\underline{...}` macro for imperative-believe
 * letters), three-subset structure, and ID uniqueness.
 *
 * Set N specifically guards against the P0 prompt-truncation bug
 * documented in `notes/audits/setN.md` (where the static `setN.ts`
 * had all 6 Rationality questions sharing the same prompt with 6
 * different answers): the test "Rationality subset has unique
 * prompts within a draw" ensures the generator never reproduces
 * that pattern.
 */

import { describe, expect, it } from 'vitest';
import {
  believingQuestions,
  generateSetN,
  rationalityQuestions,
  willingQuestions,
} from './setN.generator';

const TEST_SEED = 42;
const TEST_PER_SUBSET = 10;

describe('setN generator — top-level', () => {
  it('matches snapshot for seed 42', () => {
    expect(generateSetN(TEST_SEED, TEST_PER_SUBSET)).toMatchSnapshot();
  });

  it('produces distinct outputs for different seeds', () => {
    const a = generateSetN(1, TEST_PER_SUBSET);
    const b = generateSetN(2, TEST_PER_SUBSET);
    const promptsA = a.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    const promptsB = b.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    expect(promptsA).not.toEqual(promptsB);
  });

  it('respects perSubset count', () => {
    const set = generateSetN(TEST_SEED, 5);
    for (const subset of set.subSets) {
      expect(subset.questions.length).toBe(5);
    }
  });

  it('preserves the canonical Set metadata across seeds (3 subsets)', () => {
    const set = generateSetN(TEST_SEED, 1);
    expect(set.name).toBe('Set N');
    expect(set.subSets.length).toBe(3);
    expect(set.subSets[0]!.title).toMatch(/Believing/i);
    expect(set.subSets[1]!.title).toMatch(/Willing/i);
    expect(set.subSets[2]!.title).toMatch(/Rationality/i);
    expect(set.subSets[0]!.slugs).toEqual(['belief', 'translations', 'basic']);
    expect(set.subSets[1]!.slugs).toEqual([
      'belief',
      'translations',
      'willing',
    ]);
    expect(set.subSets[2]!.slugs).toEqual([
      'belief',
      'translations',
      'rationality',
    ]);
  });
});

describe('setN generator — property tests', () => {
  it.each([1, 42, 99, 12345])(
    'seed %i: every generated question has 4 unique-id options 0..3',
    (seed) => {
      const set = generateSetN(seed, TEST_PER_SUBSET);
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
      const set = generateSetN(seed, TEST_PER_SUBSET);
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
      const set = generateSetN(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          for (const o of q.options) {
            expect(o.label).toMatch(/^\$ .+ \$$/);
            expect(o.label).not.toMatch(/[·∨⊃≡∼☐◇∃]/);
            // No leftover {X} shorthand from the spec.
            expect(o.label).not.toMatch(/(?<!\\underline)\{[A-Za-z]\}/);
          }
        }
      }
    }
  );

  it.each([1, 42, 99])(
    'seed %i: every wrong option carries a hint (Layer 1 always)',
    (seed) => {
      const set = generateSetN(seed, TEST_PER_SUBSET);
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
    const set = generateSetN(seed, TEST_PER_SUBSET);
    for (const subset of set.subSets) {
      for (const q of subset.questions) {
        expect(q.prompt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it.each([1, 42, 99])(
    'seed %i: question ids are unique within a draw',
    (seed) => {
      const set = generateSetN(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        const ids = subset.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  );

  /**
   * P0 regression guard. Per `notes/audits/setN.md`, the static
   * `setN.ts` had all 6 Rationality questions sharing the same
   * prompt. The generator must never produce that pattern: across
   * a 30-question draw of the Rationality subset, distinct
   * formulas should imply distinct prompts.
   */
  it.each([1, 42, 99])(
    'seed %i: Rationality subset prompts in a 30-question draw look diverse (P0 guard)',
    (seed) => {
      const set = generateSetN(seed, 30);
      const rationalitySubset = set.subSets[2]!;
      const prompts = rationalitySubset.questions.map((q) => q.prompt);
      const unique = new Set(prompts);
      // With 30 draws over 7 templates × random letters, we should
      // see at least 5 distinct prompts. The static-snapshot bug
      // had exactly 1 unique prompt across 6 questions; this guard
      // catches that regression at orders of magnitude.
      expect(unique.size).toBeGreaterThanOrEqual(5);
    }
  );

  /** 2008 *15 / feedback *37 ("Underline both parts."): the willing
   *  don't-combine forbids combining two ATTITUDES — both conjuncts
   *  are willing formulas with the u before the colon underlined:
   *  ∼(u̲:OAu̲ · ∼u̲:Au̲). A descriptive second conjunct (∼Au) was a
   *  fidelity bug that graded the textbook-taught answer wrong. */
  it.each([1, 42, 99, 12345])(
    'seed %i: willing don’t-combine underlines both attitude conjuncts',
    (seed) => {
      // Willing is subSets[1]; the gen.N.4.* id prefix alone is
      // ambiguous (believingNoPosition also numbers 4).
      const qs = generateSetN(seed, 30).subSets[1]!.questions.filter((q) =>
        q.id.startsWith('gen.N.4.')
      );
      expect(qs.length).toBeGreaterThan(0);
      for (const q of qs) {
        const correct = q.options.find((o) => q.correctId.includes(o.id))!;
        // ∼(u̲:OAu̲ · ∼u̲:Au̲) with both u-before-colon underlined.
        expect(
          /\\sim \(\\underline\{u\}:O[A-Z]\\underline\{u\} \\cdot\s+\\sim \\underline\{u\}:[A-Z]\\underline\{u\}\)/.test(
            correct.label
          ),
          `"${correct.label}" (for "${q.prompt}") does not underline both attitude conjuncts`
        ).toBe(true);
      }
    }
  );
});

describe('setN generator — streaming iterators', () => {
  it('believingQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = believingQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('willingQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = willingQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('rationalityQuestions yields indefinitely (sanity-check first 100)', () => {
    const it = rationalityQuestions(TEST_SEED);
    for (let i = 0; i < 100; i++) {
      const r = it.next();
      expect(r.done).toBe(false);
      expect(r.value).toBeDefined();
    }
  });

  it('iterators are deterministic given the same seed', () => {
    const a = believingQuestions(TEST_SEED);
    const b = believingQuestions(TEST_SEED);
    for (let i = 0; i < 20; i++) {
      expect(a.next().value).toEqual(b.next().value);
    }
  });
});
