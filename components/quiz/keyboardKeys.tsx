import { spriteClip } from '@/lib/pixel';
import { ArrowLeftIcon, ArrowRightIcon } from './pixelIcons';

/**
 * Pixel keycaps instead of prose (docs/pixel-ui.md § Keyboard hints).
 * Each cap is a 22px sprite chip (R=8 corners) in ink-glass with a 2px
 * darker bottom lip — the 8-bit reading of key depth while staying flat
 * colour. Verb labels ("picks", "checks") replace the old full sentence:
 * the caps carry the what, the verbs carry the so-what.
 *
 * The row is aria-hidden, as in the lab: it is a signifier for sighted
 * keyboard users; the controls themselves are the accessible surface.
 */

const KEYCAP_CLIP = spriteClip(0, 8);

interface KeyboardKeysProps {
  /**
   * Number of options in the current question. Drives the upper bound of
   * the "[1] – [N]" caps. Defaults to 4 (the common case across most
   * sets); Set Q's "Meanings & Definitions" subset has 7 options.
   */
  optionCount?: number;
  /**
   * Options carry typeable abbreviation codes (Set R). The caps then show
   * the first and last codes — the truthful reading of "type its
   * abbreviation" — instead of digits that would lie beside an
   * eighteen-cell grid.
   */
  hasAbbreviations?: boolean;
  /** First and last typeable codes, for abbreviation sets. */
  firstAbbreviation?: string;
  lastAbbreviation?: string;
  /**
   * Options are laid out as a 2D grid (Set R), so Left/Right move between
   * columns — the caps show all four arrows.
   */
  twoDimensional?: boolean;
  /**
   * Multiple options can be picked (Set R): Space toggles the option
   * under the cursor, and the caps say so.
   */
  multiSelect?: boolean;
}

function Key({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <kbd
      className={wide ? 'qkey qkey-wide' : 'qkey'}
      style={{ clipPath: KEYCAP_CLIP }}
    >
      {children}
    </kbd>
  );
}

export function KeyboardKeys({
  optionCount = 4,
  hasAbbreviations = false,
  firstAbbreviation,
  lastAbbreviation,
  twoDimensional = false,
  multiSelect = false,
}: KeyboardKeysProps) {
  // Digits only reach nine options, and abbreviation sets type codes
  // instead — either way a digit cap past that range would lie.
  const showDigitKeys = !hasAbbreviations && optionCount <= 9;
  const upperKey = Math.max(2, Math.min(optionCount, 9));
  const showPickCaps =
    showDigitKeys ||
    (hasAbbreviations && firstAbbreviation && lastAbbreviation);

  return (
    <span className='qkeys hidden lg:inline-flex' aria-hidden='true'>
      {showPickCaps && (
        <>
          <Key>{hasAbbreviations ? firstAbbreviation : 1}</Key>
          <span className='qkeys-sep'>–</span>
          <Key>{hasAbbreviations ? lastAbbreviation : upperKey}</Key>
          <span className='qkeys-label'>picks</span>
        </>
      )}
      {twoDimensional && (
        <>
          <Key>
            <ArrowLeftIcon />
          </Key>
          <Key>
            <ArrowRightIcon />
          </Key>
        </>
      )}
      <Key>
        <ArrowLeftIcon className='rotate-90' />
      </Key>
      <Key>
        <ArrowRightIcon className='rotate-90' />
      </Key>
      <span className='qkeys-label'>moves</span>
      {multiSelect && (
        <>
          <Key wide>space</Key>
          <span className='qkeys-label'>toggles</span>
        </>
      )}
      <Key wide>enter</Key>
      <span className='qkeys-label'>checks</span>
    </span>
  );
}
