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
  it('matches the original header pools', () => {
    expect(SURNAMES).toHaveLength(16);
    expect(CARS).toHaveLength(8);
    expect(PARTIES).toHaveLength(5);
    expect(PARTIES.find((p) => p.noun === 'democrat')?.adj).toBe('democratic');
    expect(GENDERS).toHaveLength(2);
  });
});
