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
   * The BROWSER TAB colour — what `useQuizFavicon` paints the mark in for
   * the duration of a run, so a strip of open drills says which set each
   * one is.
   *
   * Every one is the set's PRIMARY colour — its surface, the colour that
   * fills the screen you are looking at — adjusted to survive a background
   * we do not control (Malik, 2026-08-18). Same hue as the surface, always;
   * only lightness and chroma move.
   *
   * The adjustment: the surfaces are pale by construction (1.17–1.81:1 on
   * white) and vanish on a light tab strip, while anything dark enough to
   * fix that vanishes on a dark one. Each colour therefore sits at the
   * lightness that maximises the WEAKER of its two chrome contrasts — the
   * balance point, ~3.55:1 on both — with chroma pushed back to the gamut
   * edge, because taking a pale low-chroma surface down without restoring
   * chroma yields grey (#FFABC6 → a muddy #AB5F79).
   *
   * THE LILAC TRIO is the one compromise. J (320°), R (315°) and Q (298°)
   * have surfaces within 22° of each other — at the balance point they were
   * one colour (J–R measured ΔOK 0.035, where <0.10 reads as identical).
   * Since the hue is fixed by the primary, separation had to come from
   * lightness: J and Q sit at the light-chrome-favouring end of their band,
   * R at the dark-favouring end. All three still clear 3:1 both ways, and
   * the trio ends up just past tellable-apart (min ΔOK 0.101). If those
   * three sets ever read as one in the tab strip, this is why, and the fix
   * is a surface change in the palette, not here.
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
      // tab: the pink primary at its balance point · 3.54:1 white / 3.57 dark
      tabColor: '#FF268F',
    };
  }

  if (subSet.name === SET_C_NAME) {
    return {
      surfaceColor: '#E7F099',
      foregroundColor: '#02302C',
      countColor: '#BD00AD',
      // tab: the lime primary at its balance point · 3.56:1 white / 3.55 dark
      tabColor: '#878E0B',
    };
  }

  if (subSet.name === SET_J_NAME) {
    return {
      surfaceColor: '#E6ACF4',
      foregroundColor: '#1C3601',
      countColor: '#674900',
      // tab: the lilac primary, pushed to the LIGHT-favouring end of its
      // band to clear Set R — see the lilac-trio note on tabColor
      // · 4.21:1 white / 3.00 dark
      tabColor: '#D001F4',
    };
  }

  if (subSet.name === SET_L_NAME) {
    return {
      surfaceColor: '#CFF6DD',
      foregroundColor: '#3F0167',
      countColor: '#BD00AD',
      // tab: the mint primary at its balance point · 3.54:1 white / 3.57 dark
      tabColor: '#049C5F',
    };
  }

  if (subSet.name === SET_N_NAME) {
    return {
      surfaceColor: '#9EDAFF',
      foregroundColor: '#4A1040',
      countColor: '#8D0381',
      // tab: the sky primary at its balance point · 3.55:1 white / 3.56 dark
      tabColor: '#0791CA',
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
      // tab: the lilac primary, pushed to the DARK-favouring end of its band
      // so it clears Set J, whose surface sits 5° away · 3.03:1 white / 4.17 dark
      tabColor: '#D064FE',
    };
  }

  if (subSet.id === MEANINGS_AND_DEFINITIONS_SUBSET_ID) {
    return {
      surfaceColor: '#D9CCF9',
      foregroundColor: '#3E1060',
      countColor: '#745400',
      // tab: the lilac primary, light-favouring end, clearing Set R
      // · 4.15:1 white / 3.05 dark
      tabColor: '#9B53FE',
    };
  }

  return {};
}
