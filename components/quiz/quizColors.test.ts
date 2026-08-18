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
      tabColor: '#FF4E99',
    });
    expect(getQuizScreenColors(subSetNamed('Set C'))).toEqual({
      surfaceColor: '#E7F099',
      foregroundColor: '#02302C',
      countColor: '#BD00AD',
      tabColor: '#939B0C',
    });
    expect(getQuizScreenColors(subSetNamed('Set J'))).toEqual({
      surfaceColor: '#E6ACF4',
      foregroundColor: '#1C3601',
      countColor: '#674900',
      tabColor: '#DF57FE',
    });
    expect(getQuizScreenColors(subSetNamed('Set L'))).toEqual({
      surfaceColor: '#CFF6DD',
      foregroundColor: '#3F0167',
      countColor: '#BD00AD',
      tabColor: '#00AA68',
    });
    expect(getQuizScreenColors(subSetNamed('Set N'))).toEqual({
      surfaceColor: '#9EDAFF',
      foregroundColor: '#4A1040',
      countColor: '#8D0381',
      tabColor: '#0C9EDC',
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
      tabColor: '#BD8C0E',
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
      tabColor: '#FF5F42',
    });
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
describe('tab colour gates (browser chrome, both extremes)', () => {
  /** Chrome's light tab strip, and a representative dark one. */
  const LIGHT = '#FFFFFF';
  const DARK = '#333333';

  it.each(PALETTES)(
    '%s clears 3:1 on light AND dark chrome',
    (_name, colors) => {
      const tab = colors.tabColor;
      expect(tab).toBeDefined();
      expect(contrastRatio(tab!, LIGHT)).toBeGreaterThanOrEqual(3);
      expect(contrastRatio(tab!, DARK)).toBeGreaterThanOrEqual(3);
    }
  );

  it('spends a distinct colour on every set — a shared tab says nothing', () => {
    const tabs = PALETTES.map(([, colors]) => colors.tabColor);
    expect(new Set(tabs).size).toBe(PALETTES.length);
  });

  it('sits clear of the default mark, or root and a drill would match', () => {
    // app/icon.svg ships in the brand magenta; useQuizFavicon swaps it out.
    const DEFAULT_MARK = '#BD00AD';
    for (const [, colors] of PALETTES) {
      expect(colors.tabColor).not.toBe(DEFAULT_MARK);
    }
  });
});

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
