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
import { FANTASY_REALM } from '../lexicons';

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

  // Professor report, 2026-08-24: "I'm the smartest influencer in LA"
  // keyed `i is i` — the pronoun subject is always i (u for "you"),
  // and the profession pool carries i-words, so one letter named two
  // individuals. The rule is Gensler's own (his name pool avoids every
  // reserved initial): no option may carry the same letter on both
  // sides of `is`, in either case.
  it.each(SWEEP_SEEDS)(
    'seed %i: no option pairs a letter with itself across `is`',
    (seed) => {
      for (const q of allQuestions(seed)) {
        for (const o of q.options) {
          const m = o.label.match(/\b([A-Za-z]) is (?:not )?([A-Za-z])\b/);
          if (m) {
            expect(
              m[1]!.toLowerCase(),
              `"${o.label}" (${q.id}: ${q.prompt})`
            ).not.toBe(m[2]!.toLowerCase());
          }
        }
      }
    }
  );

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

  // main's e5c4a5e asserted only/none-but switching on *12; at the
  // 2026-08-24 merge that drill settled at *23 (covered by the
  // restoration suite below), and *12 stayed LC3's All/Some variant —
  // so this test pins *12's own property: the quantifier tracks the
  // prompt, and the other quantifier is offered as a distractor.
  it.each(SWEEP_SEEDS)(
    'seed %i: *12 quantifier follows the prompt, with the other quantifier as a distractor',
    (seed) => {
      const qs = allQuestions(seed).filter((q) => q.id.startsWith('gen.A.12.'));
      expect(qs.length).toBeGreaterThan(0);
      for (const q of qs) {
        const m = q.prompt.match(/^(All|Some) /);
        expect(m, `"${q.prompt}" is not an All/Some prompt`).toBeTruthy();
        const quant = m![1]!.toLowerCase();
        const otherQuant = quant === 'all' ? 'some' : 'all';
        const correct = q.options.find((o) => q.correctId.includes(o.id))!;
        const c = correct.label.match(/^(all|some) ([A-Z]) is ([A-Z])$/);
        expect(c, `"${correct.label}" is not a quantified wff`).toBeTruthy();
        expect(c![1]).toBe(quant);
        expect(
          q.options.some(
            (o) =>
              !q.correctId.includes(o.id) &&
              o.label === `${otherQuant} ${c![2]} is ${c![3]}`
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

/**
 * Realm coherence (2026-08-20). Fantasy names and fantasy class nouns draw
 * places from their own franchise only; real names draw real places; real
 * nouns roam everywhere — the asymmetry is deliberate ("all bachelors in
 * Essos" is a joke, "all Lannisters in Minneapolis" is a glitch). Reads
 * rendered output, because every grammar bug this file has ever had was
 * invisible to structural tests.
 */
describe('setA realm coherence', () => {
  const PLACES_BY_REALM: Record<string, string[]> = {
    westeros: [
      'Essos',
      'King’s Landing',
      'Harrenhal',
      'Winterfell',
      'Casterly Rock',
      'Dragonstone',
      'Braavos',
    ],
    dc: ['Gotham', 'Metropolis', 'Arkham', 'Krypton', 'Smallville'],
    marvel: ['Asgard', 'Wakanda', 'Sakaar', 'the TVA'],
  };
  const ALL_FANTASY_PLACES = Object.values(PLACES_BY_REALM).flat();

  it('no fantasy word ever appears with another realm’s place', () => {
    let fantasyDraws = 0;
    for (let seed = 1; seed <= 300; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) {
          const word = Object.keys(FANTASY_REALM).find((w) =>
            new RegExp(`\\b${w}`).test(q.prompt)
          );
          if (!word || !/ in /.test(q.prompt)) continue;
          const own = PLACES_BY_REALM[FANTASY_REALM[word]!]!;
          const isName = /^[A-Z]/.test(q.prompt) && q.prompt.startsWith(word);
          const foreign = ALL_FANTASY_PLACES.filter((p) => !own.includes(p));
          for (const p of foreign) {
            expect(q.prompt, `cross-realm: ${q.prompt}`).not.toContain(p);
          }
          if (isName) {
            // a named individual also never visits the real world
            const hasOwn = own.some((p) => q.prompt.includes(p));
            expect(hasOwn, `fantasy name in real place: ${q.prompt}`).toBe(
              true
            );
          }
          fantasyDraws++;
        }
      }
    }
    expect(fantasyDraws).toBeGreaterThan(50); // the guard must not go vacuous
  });
});

/**
 * The restored only/none-but idiom (*23) and full hint coverage,
 * 2026-08-20. Three guards born from the same audit: template *12 was
 * mis-ported (2008's "Only/None but" with the REVERSED answer became
 * an unreversed All/Some), 23 wrong options rendered a blank feedback
 * slot, and *15/*18 carried "he or she".
 */
describe('setA — only/none-but restoration and hint coverage', () => {
  it('*23 reverses the letters, and the unreversed mistake is a hinted distractor', () => {
    let draws = 0,
      sawOnly = false,
      sawNoneBut = false;
    for (let seed = 1; seed <= 200; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) {
          if (!q.id.startsWith('gen.A.23.')) continue;
          draws++;
          const m = /^(Only|None but) (\S+) people are (\S+)\.$/.exec(q.prompt);
          expect(m, `unparseable *23 prompt: ${q.prompt}`).toBeTruthy();
          const [, S, adj, nounPlural] = m!;
          if (S === 'Only') sawOnly = true;
          else sawNoneBut = true;
          const C = adj![0]!.toUpperCase();
          const A = nounPlural![0]!.toUpperCase();
          const correct = q.options.find((o) => q.correctId.includes(o.id))!;
          expect(correct.label, `not reversed: ${q.prompt}`).toBe(
            `all ${A} is ${C}`
          );
          const canonical = q.options.find(
            (o) => o.label === `all ${C} is ${A}`
          );
          expect(
            canonical,
            `missing unreversed distractor: ${q.prompt}`
          ).toBeTruthy();
          expect(canonical!.hint).toMatch(/switch the parts around/);
          expect(canonical!.hint).toContain(S.toLowerCase());
        }
      }
    }
    expect(draws).toBeGreaterThan(50);
    expect(sawOnly && sawNoneBut).toBe(true);
  });

  it('every wrong option in every question carries a hint', () => {
    for (let seed = 1; seed <= 60; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) {
          for (const o of q.options) {
            if (q.correctId.includes(o.id)) continue;
            expect(
              o.hint,
              `blank feedback slot: ${q.id} "${q.prompt}" option "${o.label}"`
            ).toBeTruthy();
          }
        }
      }
    }
  });

  it('no prompt says "he or she"', () => {
    for (let seed = 1; seed <= 60; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) {
          expect(q.prompt).not.toMatch(/\bhe or she\b/);
        }
      }
    }
  });
});

/**
 * The 2026-08-20 idiom expansion (*24–*29): the contradictories quartet,
 * the conditional bridge, without-being, and verb-predicate rephrasing.
 * Each test parses rendered prompts, because that is where every Set A
 * bug has ever lived.
 */
describe('setA — idiom expansion', () => {
  const collect = (prefix: string, perSubset = 12, seeds = 150) => {
    const out: { prompt: string; correct: string; options: string[] }[] = [];
    for (let seed = 1; seed <= seeds; seed++) {
      for (const subSet of generateSetA(seed, perSubset).subSets) {
        for (const q of subSet.questions) {
          if (!q.id.startsWith(prefix)) continue;
          const correct = q.options.find((o) => q.correctId.includes(o.id))!;
          out.push({
            prompt: q.prompt,
            correct: correct.label,
            options: q.options.map((o) => o.label),
          });
        }
      }
    }
    return out;
  };

  it('*24/*25 complete the contradictories quartet', () => {
    const falseAll = collect('gen.A.24.');
    const falseNo = collect('gen.A.25.');
    expect(falseAll.length).toBeGreaterThan(20);
    expect(falseNo.length).toBeGreaterThan(20);
    for (const q of falseAll) {
      const m = /^It's false that all (\S+) are (\S+)\.$/.exec(q.prompt);
      expect(m, q.prompt).toBeTruthy();
      const A = m![1]![0]!.toUpperCase();
      const B = m![2]![0]!.toUpperCase();
      expect(q.correct).toBe(`some ${A} is not ${B}`);
      // the contrary must be present as a hinted trap
      expect(q.options).toContain(`no ${A} is ${B}`);
    }
    for (const q of falseNo) {
      const m = /^It's false that no (\S+) are (\S+)\.$/.exec(q.prompt);
      expect(m, q.prompt).toBeTruthy();
      const A = m![1]![0]!.toUpperCase();
      const B = m![2]![0]!.toUpperCase();
      expect(q.correct).toBe(`some ${A} is ${B}`);
      expect(q.options).toContain(`all ${A} is ${B}`);
    }
  });

  it('*26/*27 translate conditionals as all/no, in both surfaces', () => {
    const pos = collect('gen.A.26.');
    const neg = collect('gen.A.27.');
    expect(pos.length).toBeGreaterThan(20);
    expect(neg.length).toBeGreaterThan(20);
    const surfaces = new Set<string>();
    for (const q of pos) {
      const m =
        /^(?:If a person is|If you're) (\S+), then (?:they're|you're) (\S+)\.$/.exec(
          q.prompt
        );
      expect(m, q.prompt).toBeTruthy();
      surfaces.add(q.prompt.startsWith('If a person') ? 'person' : 'you');
      expect(q.correct).toBe(
        `all ${m![1]![0]!.toUpperCase()} is ${m![2]![0]!.toUpperCase()}`
      );
    }
    expect(surfaces.size).toBe(2);
    for (const q of neg) {
      const m =
        /^(?:If a person is|If you're) (\S+), then (?:they aren't|you aren't) (\S+)\.$/.exec(
          q.prompt
        );
      expect(m, q.prompt).toBeTruthy();
      expect(q.correct).toBe(
        `no ${m![1]![0]!.toUpperCase()} is ${m![2]![0]!.toUpperCase()}`
      );
    }
  });

  it('*28 renders the no-that-means-all trap with its distractor', () => {
    const qs = collect('gen.A.28.');
    expect(qs.length).toBeGreaterThan(20);
    for (const q of qs) {
      const m = /^No one is (\S+) without being (\S+)\.$/.exec(q.prompt);
      expect(m, q.prompt).toBeTruthy();
      const B = m![1]![0]!.toUpperCase();
      const D = m![2]![0]!.toUpperCase();
      expect(q.correct).toBe(`all ${B} is ${D}`);
      expect(q.options).toContain(`no ${B} is ${D}`);
    }
  });

  it('*29 derives the predicate letter from a bare verb', () => {
    const qs = collect('gen.A.29.');
    expect(qs.length).toBeGreaterThan(20);
    const surfaces = new Set<string>();
    for (const q of qs) {
      const m = /^(All|Every|Each) (\S+) ([a-z]+)\.$/.exec(q.prompt);
      expect(m, q.prompt).toBeTruthy();
      surfaces.add(m![1]!);
      const A = m![2]![0]!.toUpperCase();
      const V = m![3]![0]!.toUpperCase();
      expect(q.correct).toBe(`all ${A} is ${V}`);
      expect(A).not.toBe(V);
      if (m![1] !== 'All') {
        // singular subject must carry a conjugated verb, never the bare
        // plural form ("Every economist complains", not "complain")
        expect(m![3], q.prompt).toMatch(/s$/);
      }
    }
    expect(surfaces.size, 'not all *29 surfaces rendered').toBe(3);
  });

  it('the surface rotations all appear (*17, *19/*20, *21)', () => {
    const prompts = new Set<string>();
    for (let seed = 1; seed <= 150; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) prompts.add(q.prompt);
      }
    }
    const all = [...prompts].join('\n');
    for (const surface of [
      "There isn't a single",
      'Not any',
      'Those who are',
      'Every ',
      'Each ',
      'At least some',
      'are sometimes',
    ]) {
      expect(all, `surface never rendered: ${surface}`).toContain(surface);
    }
  });
});

describe('setA — inversions (*30) and any (*31)', () => {
  it('*30 reverses surface order in both streams', () => {
    let authored = 0,
      generated = 0;
    for (let seed = 1; seed <= 200; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) {
          if (!q.id.startsWith('gen.A.30.')) continue;
          const correct = q.options.find((o) => q.correctId.includes(o.id))!;
          const m = /^all ([A-Z]) is ([A-Z])$/.exec(correct.label);
          expect(m, correct.label).toBeTruthy();
          const [, S, P] = m!;
          // the switched trap must be present and hinted with the rule
          const switched = q.options.find(
            (o) => o.label === `all ${P} is ${S}`
          );
          expect(switched, q.prompt).toBeTruthy();
          expect(switched!.hint).toMatch(/subject comes last/);
          const gen = /^(\S+) are the (\S+)\.$/.exec(q.prompt);
          if (gen && !q.prompt.includes('uses of adversity')) {
            // generated or simple authored: predicate first, subject last
            expect(gen[1]![0]!.toUpperCase(), q.prompt).toBe(P);
            expect(gen[2]![0]!.toUpperCase(), q.prompt).toBe(S);
            generated++;
          } else {
            authored++;
          }
        }
      }
    }
    expect(generated).toBeGreaterThan(10);
    expect(authored + generated).toBeGreaterThan(30);
  });

  it('*31 renders both faces of any with opposite answers', () => {
    let bare = 0,
      negated = 0;
    for (let seed = 1; seed <= 200; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) {
          if (!q.id.startsWith('gen.A.31.')) continue;
          const correct = q.options.find((o) => q.correctId.includes(o.id))!;
          if (q.prompt.startsWith('Not any')) {
            negated++;
            expect(correct.label, q.prompt).toMatch(/^no /);
          } else {
            bare++;
            expect(q.prompt).toMatch(/^Any /);
            expect(correct.label, q.prompt).toMatch(/^all /);
            // the some-misreading trap must be present
            expect(
              q.options.some((o) => o.label.startsWith('some ')),
              q.prompt
            ).toBe(true);
          }
        }
      }
    }
    expect(bare).toBeGreaterThan(10);
    expect(negated).toBeGreaterThan(10);
  });
});

/**
 * *32 pins every motto to its exact translation — the content is fixed,
 * so the test doubles as the review record for each authored item.
 */
describe('setA — mottos (*32)', () => {
  const EXPECTED: Record<string, string> = {
    'Lannisters always pay their debts.': 'all L is P',
    'No Targaryen fears fire.': 'no T is F',
    'Some Targaryens ride dragons.': 'some T is R',
    "Some Avengers aren't human.": 'some A is not H',
    'Only Starks hold Winterfell.': 'all H is S',
    'Not all heroes wear capes.': 'some H is not W',
    'Batman works alone.': 'b is W',
    'Banner is always angry.': 'b is A',
    'Barry is the fastest man alive.': 'b is f',
    'Everyone at the TVA is a variant.': 'all T is V',
    'Loki is burdened with glorious purpose.': 'l is B',
    'No evil shall escape my sight.': 'no E is S',
    'All Wakandans guard vibranium.': 'all W is G',
  };

  it('every motto translates to its pinned wff, and all eight render', () => {
    const seen = new Map<string, string>();
    for (let seed = 1; seed <= 300; seed++) {
      for (const subSet of generateSetA(seed, 12).subSets) {
        for (const q of subSet.questions) {
          if (!q.id.startsWith('gen.A.32.')) continue;
          const correct = q.options.find((o) => q.correctId.includes(o.id))!;
          seen.set(q.prompt, correct.label);
        }
      }
    }
    expect(seen.size, 'not all mottos rendered').toBe(
      Object.keys(EXPECTED).length
    );
    for (const [prompt, wff] of Object.entries(EXPECTED)) {
      expect(seen.get(prompt), prompt).toBe(wff);
    }
  });
});
