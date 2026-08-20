import { describe, expect, it } from 'vitest';
import {
  getGenerator,
  registeredSetKeys,
  type GeneratedSetKey,
} from './generators';

describe('generators dispatcher', () => {
  it('returns undefined for unregistered keys', () => {
    // Cast through unknown — we want to test the runtime behavior
    // when an unknown string is passed (e.g., a typo or a setKey
    // that hasn't been wired yet).
    const result = getGenerator(
      'setDoesNotExist' as unknown as GeneratedSetKey
    );
    expect(result).toBeUndefined();
  });

  it('registeredSetKeys returns the currently registered generators', () => {
    const keys = registeredSetKeys();
    expect(keys).toContain('setA'); // T1.5 (May 9, 2026)
    expect(keys).toContain('setC'); // T1.6 (May 10, 2026)
    expect(keys).toContain('setJ'); // T1.4 (May 10, 2026)
    expect(keys).toContain('setL'); // T1.3 (May 10, 2026)
    expect(keys).toContain('setN'); // T1.2 (May 10, 2026)
  });

  it('getGenerator returns a callable function for setA', () => {
    const gen = getGenerator('setA');
    expect(gen).toBeDefined();
    const out = gen!(42, 3);
    expect(out.subSets.length).toBe(2);
    expect(out.subSets[0]!.questions.length).toBe(3);
  });

  // Regression guard for the double-correct distractor bug found in the
  // 2026-07 audit: several Set L distractors were logically equivalent to
  // the correct answer and shipped hints that openly admitted it (e.g.
  // "By De Morgan, this is logically equivalent", "a more verbose form").
  // A distractor that concedes equivalence is a second correct answer.
  // Sweep every generated option hint for that tell-tale wording.
  it('no distractor hint admits logical equivalence to the answer', () => {
    const FORBIDDEN =
      /logically equivalent|by de morgan|unnecessarily verbose|more verbose form|verbose but/i;
    for (const key of registeredSetKeys()) {
      const gen = getGenerator(key)!;
      for (const seed of [1, 7, 42, 99, 12345, 2718]) {
        const set = gen(seed, 20);
        for (const subset of set.subSets) {
          for (const q of subset.questions) {
            for (const opt of q.options) {
              expect(
                opt.hint == null || !FORBIDDEN.test(opt.hint),
                `${key} seed ${seed}: option "${opt.label}" hint admits equivalence: ${opt.hint}`
              ).toBe(true);
            }
          }
        }
      }
    }
  });

  // Regression guard for the setN `.replace('u', …)` bug: the underline
  // hint began with "You forgot…", so replacing the first "u" hit the one
  // in "You", rendering garbage like "Yo x forgot…". No hint should be
  // corrupted this way.
  it('no option hint is corrupted by a bad "You" replacement', () => {
    for (const key of registeredSetKeys()) {
      const gen = getGenerator(key)!;
      for (const seed of [1, 7, 42, 99, 12345]) {
        const set = gen(seed, 20);
        for (const subset of set.subSets) {
          for (const q of subset.questions) {
            for (const opt of q.options) {
              if (opt.hint) {
                expect(
                  /\bYo\b|Yox|Yo /.test(opt.hint),
                  `${key} seed ${seed}: corrupted hint: ${opt.hint}`
                ).toBe(false);
              }
            }
          }
        }
      }
    }
  });
});

/**
 * Superseded exonyms.
 *
 * The 2008 place catalog shipped `Kiev`. Frequency data cannot find that
 * kind of staleness — the word is neither rare nor falling, it simply
 * names a RENAMED ENTITY, and a name that has been superseded reads as
 * taking a side rather than as neutral flavor. So it gets a denylist
 * instead of a measurement, and the denylist sweeps rendered output
 * rather than the pool, because a place string can reach a student
 * through a template as easily as through the catalog.
 *
 * Deliberately excluded: Burma, Saigon and Turkey/Türkiye. Each is still
 * in live use by people making a considered choice, so pinning one form
 * would encode a position rather than a correction. Every entry below is
 * a renaming no major US style guide still contests, and each is a string
 * with no other common English meaning — `Macedonia` and `Georgia` are
 * out on that second test alone. (Malik, 2026-08-20)
 */
const SUPERSEDED_EXONYMS: Record<string, string> = {
  Kiev: 'Kyiv',
  Bombay: 'Mumbai',
  Calcutta: 'Kolkata',
  Madras: 'Chennai',
  Peking: 'Beijing',
  Rangoon: 'Yangon',
  Ceylon: 'Sri Lanka',
  Zaire: 'the DRC',
  Swaziland: 'Eswatini',
};

describe('place names', () => {
  it('no generated prompt uses a superseded exonym', () => {
    for (const key of registeredSetKeys()) {
      const gen = getGenerator(key)!;
      for (const seed of [1, 7, 42, 99, 12345]) {
        for (const subset of gen(seed, 20).subSets) {
          for (const q of subset.questions) {
            const texts = [q.prompt, ...q.options.map((o) => o.hint ?? '')];
            for (const text of texts) {
              for (const [stale, current] of Object.entries(
                SUPERSEDED_EXONYMS
              )) {
                expect(
                  new RegExp(`\\b${stale}\\b`).test(text),
                  `${key} seed ${seed}: "${stale}" is superseded by "${current}": ${text}`
                ).toBe(false);
              }
            }
          }
        }
      }
    }
  });

  it('Set A still offers Kyiv', () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 200; seed++) {
      for (const subset of getGenerator('setA')!(seed, 20).subSets) {
        for (const q of subset.questions) seen.add(q.prompt);
      }
    }
    expect([...seen].some((p) => p.includes('Kyiv'))).toBe(true);
  });
});
