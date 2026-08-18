import { SubSet } from '@/content/types';

/**
 * The per-set quiz palette — the colour system decided in the pattern lab
 * (docs/redesign-handoff.md § "The decided palette"; reasoning archive in
 * docs/color-system.md, palette log in docs/color-handoff.md).
 *
 * Each set owns exactly three colours and every screen spends only those:
 *
 *   - `surfaceColor`  — the card's field.
 *   - `foregroundColor` — the INK: prose, options, the revealed answer.
 *   - `countColor`    — the ACCENT: the points label, the progress fill,
 *     and the selection mark. Held to the accent tier's three gates
 *     (≥ 4.5:1 on the surface; ≥ ~0.10 OKLCH-L above the ink; in-gamut
 *     chroma) — see lib/contrast.ts and the palette tests.
 *
 * Lab ids for the record: A = A7, L = L4, N = N10 (the plain letters
 * belong to retired schemes — whether the bases get promoted is open
 * decision 2 in the handoff). C, J, Q ship under their own letters.
 */

export interface QuizScreenColors {
  surfaceColor?: string;
  foregroundColor?: string;
  countColor?: string;
  /**
   * The BROWSER TAB colour — the set's hue at a lightness that survives a
   * background we do not control (`useQuizFavicon`). A FOURTH colour rather
   * than a reuse of one of the three, because the duotone is pale-surface +
   * very-dark-ink by construction and a favicon needs exactly the mid-tone
   * that sits between them. Measured 2026-08-18 against white and dark tab
   * strips: the best of all 21 shipped set colours reaches only 2.27:1 on
   * its weaker side, and darkening a surface to fix light chrome breaks
   * dark chrome by the same step — it is a trade, not a fix.
   *
   * Each is the most chromatic in-gamut colour at its set's own hue that
   * clears **3:1 on white AND on dark** (1.4.11's non-text threshold,
   * applied by choice — the tab strip is not our UI, but the release
   * standard is). All seven sit ≥30° apart so they stay tellable apart.
   * Ratios are recorded per set below. Signed off by Malik, 2026-08-18.
   *
   * Spends no new HUES: every one is a hue its set already owns.
   */
  tabColor?: string;
}

/**
 * The pattern's accent pool — the lab's `SET_SURFACES` plus Set A's
 * magenta, VERBATIM. This list is what every pattern render Malik
 * judged in the prototype was made with, so it is the source of truth
 * even though four entries are stale against the shipped palette
 * (old L mint, old N sky, old R peach, Set A's ex-surface forest —
 * an ink now). Refreshing it to the shipped surfaces changes every
 * render's accents (a first port did exactly that, and the colours
 * read wrong against the prototype). Open item 4 in
 * docs/color-handoff.md: rewriting this pool is its own judgement
 * call, Malik's to make in the lab — never a port-time tidy-up.
 */
export const QUIZ_SURFACE_POOL: readonly string[] = [
  '#1C3601',
  '#E7F099',
  '#E6ACF4',
  '#C8F0E3',
  '#ADE2E9',
  '#F2CDA6',
  '#F233DF',
];

const SET_A_NAME = 'Set A';
const SET_C_NAME = 'Set C';
const SET_J_NAME = 'Set J';
const SET_L_NAME = 'Set L';
const SET_N_NAME = 'Set N';
const SET_R_NAME = 'Set R';

/**
 * Set Q's "Meanings & Definitions" subset is matched by id, not by name —
 * a special case that must survive every refactor (the subset's name does
 * not carry the set letter).
 */
export const MEANINGS_AND_DEFINITIONS_SUBSET_ID = 3;

export function getQuizScreenColors(subSet: SubSet): QuizScreenColors {
  if (subSet.name === SET_A_NAME) {
    return {
      surfaceColor: '#FFABC6',
      foregroundColor: '#4A1040',
      countColor: '#674900',
      // tab: the surface's own hue at mid-lightness · 3.09:1 white / 4.09 dark
      tabColor: '#FF4E99',
    };
  }

  if (subSet.name === SET_C_NAME) {
    return {
      surfaceColor: '#E7F099',
      foregroundColor: '#02302C',
      countColor: '#BD00AD',
      // tab: the surface's own hue at mid-lightness · 3.03:1 white / 4.17 dark
      tabColor: '#939B0C',
    };
  }

  if (subSet.name === SET_J_NAME) {
    return {
      surfaceColor: '#E6ACF4',
      foregroundColor: '#1C3601',
      countColor: '#674900',
      // tab: the surface's own hue at mid-lightness · 3.03:1 white / 4.17 dark
      tabColor: '#DF57FE',
    };
  }

  if (subSet.name === SET_L_NAME) {
    return {
      surfaceColor: '#CFF6DD',
      foregroundColor: '#3F0167',
      countColor: '#BD00AD',
      // tab: the mint surface's hue, but at 65% of the in-gamut chroma. At
      // full chroma it lands 9° from the RETIRED brand green and reads as
      // the old default mark rather than as this set; the plum ink was the
      // other candidate and sits 15° from Set J. Chroma was the only lever
      // left (Malik, 2026-08-18) · 3.08:1 white / 4.11 dark
      tabColor: '#56A276',
    };
  }

  if (subSet.name === SET_N_NAME) {
    return {
      surfaceColor: '#9EDAFF',
      foregroundColor: '#4A1040',
      countColor: '#8D0381',
      // tab: the surface's own hue at mid-lightness · 3.03:1 white / 4.18 dark
      tabColor: '#0C9EDC',
    };
  }

  if (subSet.name === SET_R_NAME) {
    // Set R wears S1 (Malik, 2026-08-08 — "I'll probably still want to
    // change it later"): the lab's starred lilac-and-rust free agent.
    // The surface is S1's verbatim. The ink and accent keep S1's HUES
    // at gate-clearing values, because verbatim S1 fails hard gates the
    // release cannot ship: its rust ink measures 3.84:1 on the lilac
    // (below AA for the text that carries every option), and its
    // accent sits 0.10 BELOW the ink in OKLCH-L (gate 3 inverted — the
    // palette log's "one compromise"). Rust #AD3821 → #751100 (same
    // hue/chroma, 7.04:1); orange #723800 → #824616 (same hue, lifted
    // to L .46 — 4.55:1 on the surface, +0.096 above the ink). The lab's
    // S1 entry itself is untouched for the later judgement.
    return {
      surfaceColor: '#E4BDF7',
      foregroundColor: '#751100',
      countColor: '#824616',
      // tab: from the RUST INK's hue at 70% chroma, not the lilac surface —
      // J, R and Q are three lilacs within 22° and merged at mid-lightness
      // (R's lilac lands 5° from J). Full chroma on the rust read as neon
      // coral instead of as this set's rust, so the hue stays and the
      // loudness goes (Malik, 2026-08-18) · 3.06:1 white / 4.13 dark
      tabColor: '#E4725B',
    };
  }

  if (subSet.id === MEANINGS_AND_DEFINITIONS_SUBSET_ID) {
    return {
      surfaceColor: '#D9CCF9',
      foregroundColor: '#3E1060',
      countColor: '#745400',
      // tab: from the OLIVE ACCENT's hue, for the same lilac collision as
      // Set R · 3.03:1 white / 4.16 dark
      tabColor: '#BD8C0E',
    };
  }

  return {};
}
