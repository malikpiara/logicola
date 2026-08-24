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
    'seed %i: forgot-underline hints sit on options with fewer underlines than the answer',
    (seed) => {
      // Set L's hints are authored (the 2008 DSL for this set has no
      // per-mistake feedback at all — just "Sorry, wrong"), so the bar
      // is anatomical truth: an option accused of forgetting an
      // underline must actually have fewer `\underline`s than the
      // correct option.
      const underlines = (label: string) =>
        label.split('\\underline').length - 1;
      const set = generateSetL(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          const correct = q.options.find((o) => q.correctId.includes(o.id))!;
          for (const o of q.options) {
            if (o.hint?.includes('forgot to underline')) {
              expect(underlines(o.label)).toBeLessThan(
                underlines(correct.label)
              );
            }
          }
        }
      }
    }
  );

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

  /** Textbook §12.1 / 2008 DSL *1 p=3: "Do A, only if you are doing
   *  B" = (A̲ ⊃ B) — the underlined IMPERATIVE is the antecedent.
   *  Keying the converse (Bu ⊃ A̲u) was a P0 (correct answer absent
   *  from the options entirely). */
  it('only-if prompts put the underlined imperative in the antecedent (all seeds)', () => {
    const onlyIfQs = [1, 42, 99, 12345, 7, 314].flatMap((seed) =>
      generateSetL(seed, 60)
        .subSets.flatMap((s) => s.questions)
        // Template-1 imperative only-if ("Do F, only if you E") —
        // template 14's deontic "duty … only if possible" is a
        // different, correctly non-underlined-antecedent form.
        .filter((q) => /^Do \w+, only if you /.test(q.prompt))
    );
    expect(onlyIfQs.length).toBeGreaterThan(0);
    for (const q of onlyIfQs) {
      const correct = q.options.find((o) => q.correctId.includes(o.id))!;
      // ($ (F\underline{u} \supset  Eu) $) — underline in the
      // antecedent, plain descriptive u in the consequent.
      expect(
        /\([A-Z]\\underline\{u\} \\supset\s+[A-Z]u\)/.test(correct.label),
        `"${correct.label}" (for "${q.prompt}") does not put the underlined imperative in the antecedent`
      ).toBe(true);
    }
  });
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
