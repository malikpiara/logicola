/**
 * Set A generator tests.
 *
 * Production behavior is **live random** (Math.random) — different
 * questions every mount. Tests pin determinism by passing a fixed
 * seed (`generateSetA(42)`) so snapshots stay stable across runs.
 *
 * Streaming-iterator tests sweep 100+ draws per seed to catch
 * generator-shape regressions (template that runs out, malformed
 * options, missing correct answer, etc.) without locking the
 * specific output.
 */

import { describe, expect, it } from 'vitest';
import { easyQuestions, generateSetA, hardQuestions } from './setA.generator';

const TEST_SEED = 42;
const TEST_PER_SUBSET = 10;

describe('setA generator — top-level', () => {
  it('matches snapshot for seed 42', () => {
    expect(generateSetA(TEST_SEED, TEST_PER_SUBSET)).toMatchSnapshot();
  });

  it('produces distinct outputs for different seeds', () => {
    const a = generateSetA(1, TEST_PER_SUBSET);
    const b = generateSetA(2, TEST_PER_SUBSET);
    // Compare prompts; very unlikely all 20 match by accident
    const promptsA = a.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    const promptsB = b.subSets.flatMap((s) => s.questions.map((q) => q.prompt));
    expect(promptsA).not.toEqual(promptsB);
  });

  it('respects perSubset count', () => {
    const set = generateSetA(TEST_SEED, 5);
    for (const subset of set.subSets) {
      expect(subset.questions.length).toBe(5);
    }
  });

  it('preserves the canonical Set metadata across seeds', () => {
    const set = generateSetA(TEST_SEED, 1);
    expect(set.name).toBe('Set A');
    expect(set.subSets[0]!.title).toMatch(/Easy/i);
    expect(set.subSets[1]!.title).toMatch(/Hard/i);
    expect(set.subSets[0]!.slugs).toEqual([
      'syllogistic',
      'translations',
      'basic',
    ]);
    expect(set.subSets[1]!.slugs).toEqual([
      'syllogistic',
      'translations',
      'hard',
    ]);
  });
});

describe('setA generator — property tests', () => {
  it.each([1, 42, 99, 12345])(
    'seed %i: every generated question has 4 unique-id options 0..3',
    (seed) => {
      const set = generateSetA(seed, TEST_PER_SUBSET);
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
      const set = generateSetA(seed, TEST_PER_SUBSET);
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

  it.each([1, 42, 99])('seed %i: all option labels are non-empty', (seed) => {
    const set = generateSetA(seed, TEST_PER_SUBSET);
    for (const subset of set.subSets) {
      for (const q of subset.questions) {
        for (const o of q.options) {
          expect(o.label.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it.each([1, 42, 99])('seed %i: all prompts are non-empty', (seed) => {
    const set = generateSetA(seed, TEST_PER_SUBSET);
    for (const subset of set.subSets) {
      for (const q of subset.questions) {
        expect(q.prompt.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it.each([1, 42, 99])(
    'seed %i: question ids are unique within a draw',
    (seed) => {
      const set = generateSetA(seed, TEST_PER_SUBSET);
      for (const subset of set.subSets) {
        const ids = subset.questions.map((q) => q.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  );
});

describe('setA generator — Gensler fidelity', () => {
  const SWEEP_SEEDS = [1, 42, 99, 12345];

  /** Gensler's eight wff forms (Introduction to Logic, 3rd ed., §2.1):
   *  wffs beginning with a word use two capitals; wffs beginning with
   *  a letter begin with a small letter. */
  const WFF_FORMS = [
    /^all [A-Z] is [A-Z]$/,
    /^no [A-Z] is [A-Z]$/,
    /^some [A-Z] is [A-Z]$/,
    /^some [A-Z] is not [A-Z]$/,
    /^[a-z] is [A-Za-z]$/,
    /^[a-z] is not [A-Za-z]$/,
  ];

  const allQuestions = (seed: number) =>
    generateSetA(seed, 50).subSets.flatMap((s) => s.questions);

  it.each(SWEEP_SEEDS)(
    'seed %i: every correct answer is one of the eight wff forms with correct case',
    (seed) => {
      for (const q of allQuestions(seed)) {
        const correct = q.options.find((o) => q.correctId.includes(o.id))!;
        expect(
          WFF_FORMS.some((re) => re.test(correct.label)),
          `"${correct.label}" (for "${q.prompt}") is not a wff`
        ).toBe(true);
      }
    }
  );

  it.each(SWEEP_SEEDS)(
    'seed %i: *0 proper name is lowercase, class predicate capital (s is H)',
    (seed) => {
      const qs = allQuestions(seed).filter((q) => q.id.startsWith('gen.A.0.'));
      expect(qs.length).toBeGreaterThan(0);
      for (const q of qs) {
        const correct = q.options.find((o) => q.correctId.includes(o.id))!;
        expect(correct.label).toMatch(/^[a-z] is [A-Z]$/);
        // subject letter = lowercased first letter of the name in the prompt
        expect(correct.label[0]).toBe(q.prompt[0]!.toLowerCase());
      }
    }
  );

  it.each(SWEEP_SEEDS)(
    'seed %i: *1 name and definite description are both lowercase (h is s)',
    (seed) => {
      const qs = allQuestions(seed).filter((q) => q.id.startsWith('gen.A.1.'));
      expect(qs.length).toBeGreaterThan(0);
      for (const q of qs) {
        const correct = q.options.find((o) => q.correctId.includes(o.id))!;
        expect(correct.label).toMatch(/^[a-z] is [a-z]$/);
        expect(correct.label[0]).toBe(q.prompt[0]!.toLowerCase());
      }
    }
  );

  it.each(SWEEP_SEEDS)(
    'seed %i: no option hint carries the type-answer letter instruction',
    (seed) => {
      for (const q of allQuestions(seed)) {
        for (const o of q.options) {
          if (o.hint) {
            expect(o.hint).not.toMatch(/first letter/i);
          }
        }
      }
    }
  );

  /** Gensler's 2008 grader treats four forms as order-insensitive
   *  ("the order doesn't matter with these four forms"):
   *  some A is B = some B is A; no A is B = no B is A;
   *  x is y = y is x; x is not y = y is not x.
   *  A distractor that is an order-swap of the correct answer is
   *  therefore a correct answer marked wrong (the *10 P0 bug). */
  const orderSwapped = (label: string): string | null => {
    let m = label.match(/^some ([A-Za-z]) is ([A-Za-z])$/);
    if (m) return `some ${m[2]} is ${m[1]}`;
    m = label.match(/^no ([A-Za-z]) is ([A-Za-z])$/);
    if (m) return `no ${m[2]} is ${m[1]}`;
    m = label.match(/^([a-z]) is ([a-z])$/);
    if (m) return `${m[2]} is ${m[1]}`;
    m = label.match(/^([a-z]) is not ([a-z])$/);
    if (m) return `${m[2]} is not ${m[1]}`;
    return null;
  };

  it.each(SWEEP_SEEDS)(
    'seed %i: no distractor is order-equivalent to the correct answer',
    (seed) => {
      for (const q of allQuestions(seed)) {
        const correct = q.options.find((o) => q.correctId.includes(o.id))!;
        const swapped = orderSwapped(correct.label);
        for (const o of q.options) {
          if (q.correctId.includes(o.id)) continue;
          expect(
            o.label,
            `distractor equals correct answer for "${q.prompt}"`
          ).not.toBe(correct.label);
          if (swapped !== null) {
            expect(
              o.label,
              `distractor "${o.label}" is order-equivalent to correct "${correct.label}" for "${q.prompt}"`
            ).not.toBe(swapped);
          }
        }
      }
    }
  );

  it.each(SWEEP_SEEDS)(
    "seed %i: *12 only/none-but switches the letters ('only C is A' = 'all A is C')",
    (seed) => {
      const qs = allQuestions(seed).filter((q) => q.id.startsWith('gen.A.12.'));
      expect(qs.length).toBeGreaterThan(0);
      for (const q of qs) {
        expect(q.prompt).toMatch(/^(Only|None but) /);
        const correct = q.options.find((o) => q.correctId.includes(o.id))!;
        const m = correct.label.match(/^all ([A-Z]) is ([A-Z])$/);
        expect(m, `"${correct.label}" is not an all-wff`).toBeTruthy();
        // The classic didn't-switch mistake must be offered as a distractor.
        expect(
          q.options.some(
            (o) =>
              !q.correctId.includes(o.id) &&
              o.label === `all ${m![2]} is ${m![1]}`
          )
        ).toBe(true);
      }
    }
  );
});

describe('setA generator — streaming iterators', () => {
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
