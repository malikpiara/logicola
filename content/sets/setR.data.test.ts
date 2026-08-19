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
  SECTIONS,
  SURNAMES,
  type FallacyCode,
} from './setR.data';

const EXPECTED_VARIANT_COUNTS: Record<FallacyCode, number> = {
  aa: 6,
  ac: 6,
  ae: 7,
  af: 6,
  ah: 11,
  ai: 8,
  am: 7,
  bp: 7,
  bw: 7,
  ci: 9,
  cq: 7,
  fs: 7,
  ge: 6,
  op: 3,
  pc: 4,
  ph: 8,
  pw: 9,
  sm: 6,
};

const KNOWN_TOKENS = ['a', 'A', 'b', 'B', 'hc', 'hC', 'HC', 'd', 'D', 'E', 'g'];

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

  it('keeps every 2008 car except the retired one', () => {
    for (const car of [
      'Honda',
      'Ford',
      'Chevrolet',
      'Toyota',
      'Volkswagen',
      'Buick',
      'Dodge',
    ]) {
      expect(CARS).toContain(car);
    }
    // Discontinued in 2010; retired in the Set R port's CARS_RETIRED.
    expect(CARS).not.toContain('Pontiac');
  });

  it('leaves the party and gender pools at the 2008 text', () => {
    expect(PARTIES).toHaveLength(5);
    expect(PARTIES.find((p) => p.noun === 'democrat')?.adj).toBe('democratic');
    expect(GENDERS).toHaveLength(2);
  });

  it('has no duplicate entries in either modernised pool', () => {
    expect(new Set(SURNAMES).size).toBe(SURNAMES.length);
    expect(new Set(CARS).size).toBe(CARS.length);
  });
});
