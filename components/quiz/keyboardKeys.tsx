interface KeyboardKeysProps {
  /**
   * Number of options in the current question. Drives the upper
   * bound shown in the "use keys 1 to N" hint. Defaults to 4 (the
   * common case across most sets); Set Q's "Meanings & Definitions"
   * subset has 7 options.
   */
  optionCount?: number;
  /**
   * Options carry typeable abbreviation codes (Set R). The hint then
   * advertises "type its abbreviation" instead of digit keys.
   */
  hasAbbreviations?: boolean;
  /**
   * Options are laid out as a 2D grid (Set R), so Left/Right move
   * between columns. The hint then shows all four arrow keys — the
   * signifier for the horizontal navigation.
   */
  twoDimensional?: boolean;
  /**
   * Multiple options can be picked (Set R). Arrows move the cursor,
   * Space toggles the option under it, and Enter checks — so the hint
   * spells that out instead of "arrows + Enter to navigate".
   */
  multiSelect?: boolean;
}

const arrowKeyClassName =
  'inline-flex items-center px-2 py-1.5 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg';
const keyCapClassName =
  'px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg';

/** A single arrow-key glyph: one triangle rotated to face `direction`. */
function ArrowKey({
  direction,
}: {
  direction: 'up' | 'down' | 'left' | 'right';
}) {
  const rotation = {
    down: '',
    up: 'rotate-180',
    left: 'rotate-90',
    right: '-rotate-90',
  }[direction];
  return (
    <kbd className={arrowKeyClassName}>
      <svg
        className={`w-2.5 h-2.5 ${rotation}`}
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 16 10'
      >
        <path d='M15.434 1.235A2 2 0 0 0 13.586 0H2.414A2 2 0 0 0 1 3.414L6.586 9a2 2 0 0 0 2.828 0L15 3.414a2 2 0 0 0 .434-2.179Z' />
      </svg>
      <span className='sr-only'>Arrow key {direction}</span>
    </kbd>
  );
}

export function KeyboardKeys({
  optionCount = 4,
  hasAbbreviations = false,
  twoDimensional = false,
  multiSelect = false,
}: KeyboardKeysProps) {
  // Clamp to the digit range the keyboard handler supports. On
  // abbreviation subsets digits are disabled, and past 9 options digit
  // keys can't reach everything — either way the digit hint would lie.
  const showDigitKeys = !hasAbbreviations && optionCount <= 9;
  const upperKey = Math.max(2, Math.min(optionCount, 9));
  return (
    <p className='text-gray-500 hidden lg:block'>
      You can{' '}
      {hasAbbreviations && (
        <>
          type a fallacy’s abbreviation (e.g.{' '}
          <kbd className={keyCapClassName}>ah</kbd>) or{' '}
        </>
      )}
      use{' '}
      {showDigitKeys && (
        <>
          keys <kbd className={keyCapClassName}>1</kbd> to{' '}
          <kbd className={keyCapClassName}>{upperKey}</kbd>
          {' or '}
        </>
      )}
      {twoDimensional && (
        <>
          <ArrowKey direction='left' /> <ArrowKey direction='right' />{' '}
        </>
      )}
      <ArrowKey direction='up' /> <ArrowKey direction='down' />
      {multiSelect ? (
        <>
          {' to move, '}
          <kbd className={keyCapClassName}>Space</kbd> to select, and{' '}
          <kbd className={keyCapClassName}>Enter</kbd> to check.
        </>
      ) : (
        <>
          {' + '}
          <kbd className={keyCapClassName}>Enter</kbd> to navigate the quiz.
        </>
      )}
    </p>
  );
}
