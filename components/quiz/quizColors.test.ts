import { describe, expect, it } from 'vitest';
import {
  getQuizScreenColors,
  MEANINGS_AND_DEFINITIONS_SUBSET_ID,
} from './quizColors';
import { contrastRatio, oklchLightness } from '@/lib/contrast';
import type { SubSet } from '@/content/types';

function subSetNamed(name: string, id = 999): SubSet {
  return {
    name,
    logicType: 'test',
    slugs: [],
    id,
    title: name,
    header: '',
    questions: [],
  };
}

/** Every palletised set, resolved the way the quiz shell resolves them. */
const PALETTES = [
  ['Set A', getQuizScreenColors(subSetNamed('Set A'))],
  ['Set C', getQuizScreenColors(subSetNamed('Set C'))],
  ['Set J', getQuizScreenColors(subSetNamed('Set J'))],
  ['Set L', getQuizScreenColors(subSetNamed('Set L'))],
  ['Set N', getQuizScreenColors(subSetNamed('Set N'))],
  [
    'Set Q (Meanings & Definitions)',
    getQuizScreenColors(
      subSetNamed('Meanings & Definitions', MEANINGS_AND_DEFINITIONS_SUBSET_ID)
    ),
  ],
  ['Set R', getQuizScreenColors(subSetNamed('Set R'))],
] as const;

describe('getQuizScreenColors', () => {
  it('ships the decided palette table (redesign-handoff.md)', () => {
    expect(getQuizScreenColors(subSetNamed('Set A'))).toEqual({
      surfaceColor: '#FFABC6',
      foregroundColor: '#4A1040',
      countColor: '#674900',
      tabColor: '#FF268F',
    });
    expect(getQuizScreenColors(subSetNamed('Set C'))).toEqual({
      surfaceColor: '#E7F099',
      foregroundColor: '#02302C',
      countColor: '#BD00AD',
      tabColor: '#878E0B',
    });
    expect(getQuizScreenColors(subSetNamed('Set J'))).toEqual({
      surfaceColor: '#E6ACF4',
      foregroundColor: '#1C3601',
      countColor: '#674900',
      tabColor: '#D001F4',
    });
    expect(getQuizScreenColors(subSetNamed('Set L'))).toEqual({
      surfaceColor: '#CFF6DD',
      foregroundColor: '#3F0167',
      countColor: '#BD00AD',
      tabColor: '#049C5F',
    });
    expect(getQuizScreenColors(subSetNamed('Set N'))).toEqual({
      surfaceColor: '#9EDAFF',
      foregroundColor: '#4A1040',
      countColor: '#8D0381',
      tabColor: '#0791CA',
    });
  });

  it('matches Set Q by subset id, never by name (the special case must survive)', () => {
    const byId = getQuizScreenColors(
      subSetNamed('Anything At All', MEANINGS_AND_DEFINITIONS_SUBSET_ID)
    );
    expect(byId).toEqual({
      surfaceColor: '#D9CCF9',
      foregroundColor: '#3E1060',
      countColor: '#745400',
      tabColor: '#9B53FE',
    });
    expect(getQuizScreenColors(subSetNamed('Set Q'))).toEqual({});
  });

  it('Set R wears S1 at gate-clearing values (Malik 2026-08-08, still changeable)', () => {
    // Surface is S1's lilac verbatim; ink and accent keep S1's hues at
    // legal depths (verbatim S1's rust ink is 3.84:1 on the lilac and
    // its accent sits below the ink — see quizColors.ts). If R changes
    // again, update here AND re-run the gates below, which is the point.
    expect(getQuizScreenColors(subSetNamed('Set R'))).toEqual({
      surfaceColor: '#E4BDF7',
      foregroundColor: '#751100',
      countColor: '#824616',
      tabColor: '#D064FE',
    });
  });

  it('every tab colour survives BOTH light and dark browser chrome', () => {
    // Malik, 2026-08-18: the tab colour is the set's primary, adjusted to
    // work in light AND dark mode. Both directions are the requirement, so
    // both are gated — a change that fixes one by breaking the other fails.
    for (const [name, colors] of PALETTES) {
      const tab = colors.tabColor;
      expect(tab, `${name} has no tab colour`).toBeTruthy();
      expect(
        contrastRatio(tab!, '#FFFFFF'),
        `${name} tab ${tab} on light chrome`
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(tab!, '#333333'),
        `${name} tab ${tab} on dark chrome`
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it('no two sets share a tab colour, and none is the root magenta', () => {
    // The whole point of the tier is telling one open drill from another;
    // and the default mark is #BD00AD, so no set may wear it either.
    const tabs = PALETTES.map(([, c]) => c.tabColor);
    expect(new Set(tabs).size, 'duplicate tab colours').toBe(tabs.length);
    expect(tabs).not.toContain('#BD00AD');
  });

  it('returns no colours for unpalettised sets (defaults apply downstream)', () => {
    expect(getQuizScreenColors(subSetNamed('Set B'))).toEqual({});
  });
});

/**
 * Accessibility gates, per docs/redesign-handoff.md and the auto-memory
 * rule that WCAG is a blocker, not a trade-off. These lock the palette:
 * any future colour change that regresses a gate fails here, not in a
 * university's accessibility audit.
 */
describe('palette accessibility gates', () => {
  it.each(PALETTES)('%s: ink ≥ 7:1 on its surface (AAA body text)', (_, p) => {
    expect(
      contrastRatio(p.foregroundColor!, p.surfaceColor!)
    ).toBeGreaterThanOrEqual(7);
  });

  it.each(PALETTES)(
    '%s: accent ≥ 4.5:1 on its surface (AA text, and clears 1.4.11 non-text)',
    (_, p) => {
      expect(
        contrastRatio(p.countColor!, p.surfaceColor!)
      ).toBeGreaterThanOrEqual(4.5);
    }
  );

  it.each(PALETTES)(
    '%s: gate 3 — accent sits ≥ ~0.10 OKLCH-L above the ink',
    (_, p) => {
      const dL =
        oklchLightness(p.countColor!) - oklchLightness(p.foregroundColor!);
      expect(dL).toBeGreaterThanOrEqual(0.095);
    }
  );

  it.each(PALETTES)(
    '%s: ink and accent are BELOW 3:1 against each other — the marks may never touch',
    (_, p) => {
      // Not a pass/fail gate but the documented fact that makes the 2px
      // surface gap between focus and selection structural: if this ever
      // rises above 3:1 the gap rule could be revisited; until then any
      // two marks in ink and accent must be separated by surface.
      expect(contrastRatio(p.foregroundColor!, p.countColor!)).toBeLessThan(3);
    }
  );
});

/** color-mix(in srgb, a P%, b) — plain per-channel interpolation. */
function mixHex(a: string, b: string, weightA: number): string {
  const channels = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [ca, cb] = [channels(a), channels(b)];
  return (
    '#' +
    ca
      .map((v, i) =>
        Math.round(v * weightA + cb[i] * (1 - weightA))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}

/**
 * Decision 7 (accent chips), resolved by Malik + arithmetic 2026-08-08:
 * the REFERENCE's chips carry the accent (text in the accent over a 10%
 * accent plate on the white sheet); the CARD's chips stay ink, because
 * the accents sit at ~4.6:1 on their bare surfaces and have no AA
 * headroom over any darkened plate. These gates lock both halves.
 */
/**
 * The tab tier's ONE gate. Unlike the other three colours, a favicon sits on
 * a background we do not control, so it must clear both extremes of browser
 * chrome — not one of them. 3:1 is 1.4.11's non-text threshold; the tab strip
 * is not our UI, but the release standard is (Malik, 2026-08-18).
 */
describe('guide accent-chip gates (white sheet)', () => {
  it.each(PALETTES)(
    '%s: accent text ≥ 4.5:1 over its 10%-accent plate on white',
    (_, p) => {
      const plate = mixHex(p.countColor!, '#ffffff', 0.1);
      expect(contrastRatio(p.countColor!, plate)).toBeGreaterThanOrEqual(4.5);
    }
  );

  it.each(PALETTES)(
    '%s: accent ≥ 4.5:1 on plain white (the code column)',
    (_, p) => {
      expect(contrastRatio(p.countColor!, '#ffffff')).toBeGreaterThanOrEqual(
        4.5
      );
    }
  );

  it('the card constraint is real: C’s accent fails over its own tint on-surface', () => {
    // The reason card chips stay ink. If a future palette change gives
    // the accents headroom, this test failing is the signal to revisit.
    const p = getQuizScreenColors(subSetNamed('Set C'));
    const cardPlate = mixHex(p.countColor!, p.surfaceColor!, 0.12);
    expect(contrastRatio(p.countColor!, cardPlate)).toBeLessThan(4.5);
  });
});
