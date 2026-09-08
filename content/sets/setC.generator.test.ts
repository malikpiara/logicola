/**
 * Set C generator tests.
 *
 * Same shape as setA.generator.test.ts: deterministic snapshot at a
 * fixed seed, plus property tests sweeping multiple seeds to catch
 * generator-shape regressions (option count, ID uniqueness, hint
 * presence on wrong options, KaTeX delimiter integrity, etc.).
 */

import { describe, expect, it } from 'vitest';
import {
  drawSetCTemplate,
  easyQuestions,
  generateSetC,
  hardQuestions,
  renderSetCTemplate,
  SET_C_TEMPLATE_COUNT,
} from './setC.generator';

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

  it.each([1, 42, 99, 12345])(
    'seed %i: no hint repeats a line (Layer-1 duplicated into Layer-2)',
    (seed) => {
      // Templates 21 and 32 shipped with their Layer-1 sentence also
      // seated in Layer-2, printing e.g. the not-iff line twice in one
      // hint. The 2008 `*e` block never does this — its conditions are
      // mutually exclusive per option.
      const set = generateSetC(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          for (const o of q.options) {
            if (!o.hint) continue;
            const lines = o.hint
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean);
            expect(new Set(lines).size).toBe(lines.length);
          }
        }
      }
    }
  );

  it.each([1, 42, 99, 12345])(
    'seed %i: negation-mistake hints match the mistake anatomy (2008 *e block)',
    (seed) => {
      // Domain truth from the original program (set_C.txt `*e` block):
      // "Why did you put in an extra ‘∼’?" is only ever attached to an
      // option with MORE negations than the correct answer, and "You
      // forgot the second ‘∼’!" only to an option missing one of a
      // two-negation answer's ‘∼’s. Counting `\sim` in the rendered
      // KaTeX makes this checkable without reference to template
      // indices — a mis-seated hint fails here whatever slot it's in.
      const simCount = (label: string) => label.split('\\sim').length - 1;
      const set = generateSetC(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        for (const q of subset.questions) {
          const correct = q.options.find((o) => q.correctId.includes(o.id))!;
          for (const o of q.options) {
            if (!o.hint) continue;
            if (o.hint.includes('extra ‘∼’')) {
              expect(simCount(o.label)).toBeGreaterThan(
                simCount(correct.label)
              );
            }
            if (o.hint.includes('forgot the second ‘∼’')) {
              expect(simCount(correct.label)).toBeGreaterThanOrEqual(2);
              expect(simCount(o.label)).toBeLessThan(simCount(correct.label));
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

describe('renderSetCTemplate — one template, one draw', () => {
  it('carries every 2008 template, *0 through *33', () => {
    expect(SET_C_TEMPLATE_COUNT).toBe(34);
    for (let num = 0; num < SET_C_TEMPLATE_COUNT; num++) {
      const q = renderSetCTemplate(num, TEST_SEED);
      expect(q, `template *${num}`).toBeDefined();
      expect(q!.options).toHaveLength(4);
      expect(q!.correctId).toEqual([0]);
    }
  });

  it('is reproducible for a seed and varies across seeds', () => {
    expect(renderSetCTemplate(21, 7)).toEqual(renderSetCTemplate(21, 7));
    const prompts = new Set(
      [1, 2, 3, 4, 5, 6].map((seed) => renderSetCTemplate(21, seed)!.prompt)
    );
    expect(prompts.size).toBeGreaterThan(1);
  });

  it('returns undefined for a number the set never had', () => {
    expect(renderSetCTemplate(99)).toBeUndefined();
  });

  it('reports the bindings behind a draw', () => {
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const draw = drawSetCTemplate(21, seed)!;
      const { adjectives, letters, form } = draw.bindings;
      // *21 uses $j and $q, bound to $B and $D.
      expect(Object.keys(letters).sort()).toEqual(['j', 'q']);
      expect(letters.j).toBe(adjectives.B![0]!.toUpperCase());
      expect(letters.q).toBe(adjectives.D![0]!.toUpperCase());
      if (form === 'english') {
        expect(draw.question.prompt).toContain(adjectives.B!);
      } else {
        expect(draw.question.prompt).toContain(letters.j!);
      }
      expect(draw.question).toEqual(renderSetCTemplate(21, seed));
    }
  });
});
