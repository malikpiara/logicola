/**
 * Set R data fidelity tests.
 *
 * The variant-count table below is the original program's own per-section count
 * table, so these tests pin the port to the original —
 * including section 14 (op/pc), which the legacy parsed JSON in the
 * the original program repo silently drops.
 */

import { describe, expect, it } from 'vitest';
import {
  CARS,
  FALLACIES,
  GENDERS,
  PARTIES,
  POLITICIANS,
  SECTIONS,
  SURNAMES,
  type FallacyCode,
} from './setR.data';

const EXPECTED_VARIANT_COUNTS: Record<FallacyCode, number> = {
  aa: 14,
  ac: 10,
  ae: 9,
  af: 8,
  ah: 11,
  ai: 9,
  am: 14,
  bp: 11,
  bw: 9,
  ci: 9,
  cq: 10,
  fs: 11,
  ge: 13,
  op: 10,
  pc: 11,
  ph: 13,
  pw: 11,
  sm: 8,
};

const KNOWN_TOKENS = [
  'a',
  'A',
  'b',
  'B',
  'hc',
  'hC',
  'HC',
  'd',
  'D',
  'E',
  'g',
  'p',
  'P',
  'l',
  'f',
  's',
  'S',
];

const allVariants = SECTIONS.flatMap((section) =>
  section.variants.map((variant) => ({ section, variant }))
);

describe('setR data — fallacy catalog', () => {
  it('has 18 fallacies with ids 0-17 in grid order', () => {
    expect(FALLACIES).toHaveLength(18);
    FALLACIES.forEach((fallacy, index) => {
      expect(fallacy.id).toBe(index);
    });
    const codes = FALLACIES.map((f) => f.code);
    expect(codes).toEqual([...codes].sort());
  });

  it('has non-empty names and descriptions', () => {
    for (const fallacy of FALLACIES) {
      expect(fallacy.name.length).toBeGreaterThan(2);
      expect(fallacy.description.length).toBeGreaterThan(10);
    }
  });

  it('carries the numbered clauses referenced by answer notes (aa, ah)', () => {
    const byCode = Object.fromEntries(FALLACIES.map((f) => [f.code, f]));
    expect(byCode.aa!.clauses).toHaveLength(3);
    expect(byCode.ah!.clauses).toHaveLength(2);
  });
});

describe('setR data — sections', () => {
  it('matches the original engine variant-count table exactly', () => {
    const counts = Object.fromEntries(
      SECTIONS.map((s) => [s.code, s.variants.length])
    );
    expect(counts).toEqual(EXPECTED_VARIANT_COUNTS);
  });

  it('never accepts more than 3 fallacies (the UI pick cap depends on it)', () => {
    // useQuizState caps multi-select at 3 picks; if a future passage
    // accepts four, that cap must move with it.
    for (const { variant } of allVariants) {
      expect(variant.accepted.length).toBeLessThanOrEqual(3);
    }
  });

  it('lists the primary fallacy first in every accepted array', () => {
    for (const { section, variant } of allVariants) {
      expect(variant.accepted[0]).toBe(section.code);
      expect(new Set(variant.accepted).size).toBe(variant.accepted.length);
    }
  });

  it('has exactly one mirror variant (the ai coin-flip pair)', () => {
    const mirrored = allVariants.filter(({ variant }) => variant.mirror);
    expect(mirrored).toHaveLength(1);
    expect(mirrored[0]!.section.code).toBe('ai');
    expect(mirrored[0]!.variant.template).toContain('honest');
  });

  it('uses only whitelisted substitution tokens', () => {
    for (const { variant } of allVariants) {
      for (const text of [variant.template, variant.mirror, variant.note]) {
        if (!text) continue;
        for (const match of text.matchAll(/\{([^}]*)\}/g)) {
          expect(KNOWN_TOKENS).toContain(match[1]);
        }
      }
    }
  });

  it('pairs every {g} token with a word pool', () => {
    for (const { variant } of allVariants) {
      if (variant.template.includes('{g}')) {
        expect(variant.pool?.length).toBeGreaterThan(1);
      }
    }
  });

  it('contains no bare $ outside the KaTeX-safe literal-dollar pattern', () => {
    // KatexSpan treats bare $ as a math delimiter with no escape handling,
    // so literal amounts must ship as inline-math dollars: $\$20$
    for (const { variant } of allVariants) {
      for (const text of [variant.template, variant.mirror, variant.note]) {
        if (!text) continue;
        const stripped = text.replaceAll('$\\$20$', '');
        expect(stripped).not.toContain('$');
      }
    }
  });
});

describe('setR data — original multi-answer (M-code) fidelity', () => {
  const variantsFor = (code: FallacyCode) =>
    SECTIONS.find((s) => s.code === code)!.variants;

  it('accepts ae+op+fs for the "typically nauseating" passage', () => {
    const variant = variantsFor('ae').find((v) =>
      v.template.includes('typically nauseating')
    )!;
    expect(variant.accepted).toEqual(['ae', 'op', 'fs']);
  });

  it('accepts ah+ae+fs for the "cowardly homosexual communists" passage', () => {
    const variant = variantsFor('ah').find((v) =>
      v.template.includes('opposed the war')
    )!;
    expect(variant.accepted).toEqual(['ah', 'ae', 'fs']);
  });

  it('accepts ci as a secondary answer on every complex-question passage', () => {
    for (const variant of variantsFor('cq')) {
      expect(variant.accepted).toContain('ci');
    }
  });

  it('keeps op and pc drilled (section *14 was dropped by the legacy JSON)', () => {
    expect(variantsFor('op')[0]!.template).toContain('dirty {D}s');
    expect(
      variantsFor('pc').every(
        (v) => v.note?.startsWith('What are the') || v.note
      )
    ).toBe(true);
  });
});

describe('setR data — substitution pools', () => {
  /**
   * These pools are layered the same way content/lexicons.ts is: the 2008
   * header block is frozen in the Set R port as SURNAMES_2008 / CARS_2008, and
   * the live pools are (baseline − retired) + modern additions. So the
   * assertion is no longer an exact count — it is that every 2008 entry
   * survived, minus the one deliberate retirement.
   *
   * Names and brands are safe to modernise in a way the passages are not:
   * substituting them changes who a passage is about, never what it argues.
   */
  it('keeps every 2008 surname', () => {
    for (const surname of [
      'Martinez',
      'Smith',
      'Jones',
      'Brown',
      'Greene',
      'Fernandez',
      'Connolly',
      'Wong',
      'Weiss',
      'Gensler', // the author's own name — an easter egg the port preserves
      'Wilson',
      'Rogers',
      'Hilton',
      'Miller',
      'Boyle',
      'Hughes',
    ]) {
      expect(SURNAMES).toContain(surname);
    }
    expect(SURNAMES.length).toBeGreaterThan(16);
  });

  it('keeps every 2008 car except the retired ones', () => {
    for (const car of ['Honda', 'Ford', 'Chevrolet', 'Toyota', 'Volkswagen']) {
      expect(CARS).toContain(car);
    }
    // Two retirement criteria (the Set R port): Pontiac died as a marque
    // (2010); Buick and Dodge are alive but globally illegible — retired
    // 2026-08-21 on Malik's call. Mercedes and Lexus were considered as
    // replacements and excluded: "{d}s" pluralizes with a bare -s, and
    // "Mercedess" is not a word.
    for (const retired of ['Pontiac', 'Buick', 'Dodge']) {
      expect(CARS).not.toContain(retired);
    }
    for (const global of ['BMW', 'Audi', 'Volvo', 'Ferrari']) {
      expect(CARS).toContain(global);
    }
  });

  /**
   * The party pool is the corpus's political-safety mechanism: seven passages
   * carry {D}/{E}, so the same sentence indicts a different side on every
   * draw and no single rendering of it is representative. That only holds if
   * the pool stays balanced, which is what this pins.
   */
  it('keeps every 2008 party label', () => {
    for (const noun of [
      'socialist',
      'republican',
      'democrat',
      'conservative',
      'liberal',
    ]) {
      expect(PARTIES.map((p) => p.noun)).toContain(noun);
    }
    expect(PARTIES.find((p) => p.noun === 'democrat')?.adj).toBe('democratic');
  });

  it('stays balanced left and right', () => {
    const nouns = PARTIES.map((p) => p.noun);
    const left = ['socialist', 'democrat', 'liberal', 'progressive', 'green'];
    const right = ['republican', 'conservative', 'libertarian', 'nationalist'];
    const count = (side: string[]) =>
      nouns.filter((n) => side.includes(n)).length;
    expect(Math.abs(count(left) - count(right))).toBeLessThanOrEqual(1);
  });

  it('every party label survives all four token slots', () => {
    for (const { noun, adj } of PARTIES) {
      // "us {D}s" — the noun must pluralise with a bare -s
      expect(noun).not.toMatch(/[sxz]$/);
      // "the {E} party" / "the {E} candidate" — single word, no article
      expect(adj).not.toContain(' ');
    }
  });

  /**
   * The roster's safety is its balance, exactly as with the party pool: the
   * same sentence names a different side on every draw, so no single
   * rendering of "this proposal from X is typically nauseating" is
   * representative. If someone adds three figures from one side, this fails.
   */
  it('the politician roster stays balanced', () => {
    const right = [
      'Orbán',
      'Meloni',
      'Reagan',
      'Thatcher',
      'Milei',
      'Merkel',
      'Trump',
      'Modi',
    ];
    const left = [
      'Obama',
      'Blair',
      'Starmer',
      'Ardern',
      'Sanders',
      'Mamdani',
      'Harris',
      'Hillary Clinton',
      'John F. Kennedy',
    ];
    const names = POLITICIANS.map((p) => p.name);
    for (const n of [...right, ...left]) expect(names).toContain(n);
    const count = (side: string[]) =>
      names.filter((n) => side.includes(n)).length;
    expect(Math.abs(count(left) - count(right))).toBeLessThanOrEqual(1);
  });

  /**
   * Pronouns travel with the figure rather than being drawn. Without this,
   * "most people favor Thatcher... So I'm going to vote for him" ships.
   */
  it('every politician carries a self-consistent pronoun set', () => {
    for (const p of POLITICIANS) {
      expect(p.label.length).toBeGreaterThan(0);
      expect(p.B).toBe(p.b[0]!.toUpperCase() + p.b.slice(1));
      expect(p.HC).toBe(p.hC[0]!.toUpperCase() + p.hC.slice(1));
      expect(['he', 'she', 'they']).toContain(p.b);
    }
  });

  /**
   * A surname naming more than one prominent figure cannot carry an honest
   * label or pronoun, so those entries use a full name. Pinned because the
   * failure is silent: "Clinton, the democrat candidate... vote for her"
   * reads fine unless you meant Bill.
   */
  it('disambiguates surnames shared by several figures', () => {
    const names = POLITICIANS.map((p) => p.name);
    for (const bare of ['Clinton', 'Kennedy']) {
      expect(names).not.toContain(bare);
      expect(names.some((n) => n.endsWith(bare))).toBe(true);
    }
  });

  it('leaves the gender pool at the 2008 text', () => {
    expect(GENDERS).toHaveLength(2);
  });

  it('has no duplicate entries in either modernised pool', () => {
    expect(new Set(SURNAMES).size).toBe(SURNAMES.length);
    expect(new Set(CARS).size).toBe(CARS.length);
  });
});
