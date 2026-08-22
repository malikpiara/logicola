import classNames from 'classnames';
import React from 'react';
import KatexSpan from './katexSpan';
import { CheckIcon, TimesIcon } from './quiz/pixelIcons';
import { CURSOR_W, FOCUS_W, focusR, ringBand, spriteClip } from '@/lib/pixel';
import { PixelTip } from '@/components/ui/pixelTip';
import { shortcutsUsed } from '@/lib/shortcutTeaching';

/** Selection band width (the Tint treatment's `sringw`). */
const SELECT_W = 4;

/**
 * Silhouettes per corner radius, computed once at module scope — R=24 for
 * list pills, R=12 for the grid's compact cells (a 24px corner on a 40px
 * box is nearly a stadium). Ring width and clip inset come from ONE
 * number so pill + band always occupy the same silhouette as an unringed
 * pill: selection changes an option's colour, never its size.
 */
function geometryFor(R: number) {
  return {
    clip: {
      0: spriteClip(0, R),
      [CURSOR_W]: spriteClip(CURSOR_W, R),
      [SELECT_W]: spriteClip(SELECT_W, R),
    } as Record<number, string>,
    band: {
      [CURSOR_W]: ringBand('sprite', CURSOR_W, R),
      [SELECT_W]: ringBand('sprite', SELECT_W, R),
    } as Record<number, string>,
    // Focus stands 2px off the silhouette; its radius grows by the same
    // 4px so it stays concentric instead of tightening at the corners.
    focusBand: ringBand('sprite', FOCUS_W, focusR(R)),
  };
}

const SPRITE_LIST = geometryFor(24);
const SPRITE_GRID = geometryFor(12);

/**
 * The badge silhouette — open decision 8, working value DIAMOND (Malik,
 * 2026-08-08): MaterialShapes' puffy diamond rasterised onto the badge's
 * 4px grid — row widths 2·4·6·8·8·6·4·2 cells, the straight-edged pixel
 * diamond fattened one row at the waist. It happens to echo the ◇ of the
 * modal-logic content. Expressed in percentages of the lab's literal
 * 32px polygon (all points land on clean eighths), so one clip serves
 * both badge sizes — with a caveat CARRIED FOR REVIEW on Sets Q and R:
 * their compact badges run 28px, where the eighths land on 3.5px steps,
 * off the 4px grid. The square chip (`gemClip()` from lib/pixel) stays
 * the dormant alternative.
 */
const BADGE_CLIP =
  'polygon(37.5% 0%, 62.5% 0%, 62.5% 12.5%, 75% 12.5%, 75% 25%, 87.5% 25%, ' +
  '87.5% 37.5%, 100% 37.5%, 100% 62.5%, 87.5% 62.5%, 87.5% 75%, 75% 75%, ' +
  '75% 87.5%, 62.5% 87.5%, 62.5% 100%, 37.5% 100%, 37.5% 87.5%, 25% 87.5%, ' +
  '25% 75%, 12.5% 75%, 12.5% 62.5%, 0% 62.5%, 0% 37.5%, 12.5% 37.5%, ' +
  '12.5% 25%, 25% 25%, 25% 12.5%, 37.5% 12.5%)';

export interface OptionProps {
  ref?: React.Ref<HTMLButtonElement>;
  index?: number;
  showIndex?: boolean;
  label: React.ReactNode; // Allow label to be string or rendered content
  isSelected: boolean;
  isCorrect: boolean;
  showSolution: boolean;
  onClick: () => void;
  hasBeenIncorrectlyGuessed?: boolean;
  /** Tighter paddings and smaller type, for grid-layout subsets. */
  compact?: boolean;
  /** Typeable code shown as the prefix instead of the index (e.g. 'ah'). */
  abbreviation?: string;
  /**
   * Keyboard cursor is on this option (multi-select, where the cursor is
   * distinct from the committed selection). Renders as a 2px full-strength
   * band in the focus colour ON the silhouette — "where I am" apart from
   * "what I've picked" by position and width, not hue alone (WCAG 1.4.1).
   */
  isCursor?: boolean;
  /**
   * Render for the immersive (set-colored) quiz surface: sprite-clipped
   * pills in the Tint treatment (ink washes at rest, the accent arriving
   * on selection), the mono prefix in a filled square chip — an homage to
   * the original LogiCola, which highlighted the typed abbreviation in a
   * filled box.
   */
  immersive?: boolean;
}

/**
 * One answer option. A single visual language across every set — a quiet
 * mono prefix (the option's number, or its typeable code on abbreviation
 * sets) in a chip before a regular-weight label, with the set's accent
 * marking the selection — in two sizes: `compact` for the 18-option grids,
 * roomy for the classic four-option lists.
 *
 * State ladder (the lab's Tint treatment, docs/pattern-lab.html
 * OPTION_TREATMENTS): idle = 9% ink wash → hover 15% → selected = 14%
 * accent composited on the surface + 4px accent band → revealed = solid
 * ink (inverts, like the CTA) → ruled = 5% ink recede in the error tone.
 * The colour tokens live in globals.css (`--qo-*`), fed by the set's own
 * three colours.
 */
const Option = React.forwardRef<HTMLButtonElement, OptionProps>(
  (
    {
      index,
      showIndex,
      label,
      isSelected,
      isCorrect,
      showSolution,
      onClick,
      hasBeenIncorrectlyGuessed = false,
      compact = false,
      abbreviation,
      isCursor = false,
      immersive = false,
    },
    ref
  ) => {
    const isRevealedCorrect = showSolution && isCorrect;
    const isRuledOut =
      (showSolution && !isCorrect) || hasBeenIncorrectlyGuessed;

    // Long loop (lib/shortcutTeaching.ts): once this device has selected
    // by key, the shortcut-tip scaffold retires. Hooks live ABOVE the
    // non-immersive early return (rules of hooks); effect-gated so SSR
    // and first paint agree. Retirement lands from the next question on.
    const [tipRetired, setTipRetired] = React.useState(false);
    React.useEffect(() => {
      setTipRetired(shortcutsUsed());
    }, []);

    if (!immersive) {
      return (
        <button
          type='button'
          ref={ref}
          onClick={onClick}
          aria-pressed={isSelected}
          data-solution={showSolution ? 'shown' : 'hidden'}
          className={classNames(
            'motion-option w-full cursor-pointer ps-4 pe-4 text-left text-base leading-6 text-gray-900 flex items-start border rounded-xl focus:outline-fuchsia-500',
            {
              'border-gray-200': !isSelected && !showSolution,
              'bg-[#1ad85f]': showSolution && isCorrect,
              'border-rose-200 text-red-500': isRuledOut,
              'border-fuchsia-500 bg-fuchsia-50': !showSolution && isSelected,
              'border-fuchsia-300': !showSolution && !isSelected && isCursor,
              'hover:border-fuchsia-300 focus:border-fuchsia-400':
                !showSolution,
            }
          )}
        >
          <div
            className={classNames(
              'flex items-baseline',
              compact ? 'gap-2.5' : 'gap-3'
            )}
          >
            {showIndex && (
              <span
                className={classNames(
                  'shrink-0 font-mono lowercase tabular-nums',
                  compact ? 'text-xs' : 'text-sm',
                  showSolution
                    ? isCorrect
                      ? 'text-gray-800'
                      : 'text-red-400'
                    : isSelected
                      ? 'text-fuchsia-700'
                      : 'text-gray-400'
                )}
              >
                {abbreviation ?? index}
              </span>
            )}
            <div
              className={
                compact
                  ? 'py-3.5 text-sm leading-5 font-normal'
                  : 'py-4 font-normal'
              }
            >
              <KatexSpan text={label} />
            </div>
          </div>
        </button>
      );
    }

    const isSelectedLive = isSelected && !showSolution;
    // The cursor mark only ever modifies an untouched option — once a pill
    // is picked, ruled or revealed, that state owns the silhouette (when
    // the cursor sits on a picked option, the focus band outside does the
    // "where I am" job).
    const showCursorBand =
      isCursor && !isSelectedLive && !isRuledOut && !isRevealedCorrect;

    const geo = compact ? SPRITE_GRID : SPRITE_LIST;
    const ringW = isRevealedCorrect
      ? 0
      : isSelectedLive
        ? SELECT_W
        : showCursorBand
          ? CURSOR_W
          : 0;
    const ringColor = showCursorBand ? 'var(--qo-focus)' : 'var(--qo-sring)';

    const wrapStyle = {
      // Set on EVERY wrapper, ringed or not: the band fades rather than
      // popping, so it needs a silhouette on the way out too — with the
      // clip unset the fade-out would flash a full rectangle.
      '--qo-rc': ringColor,
      '--qo-band': geo.band[ringW || SELECT_W],
      '--qo-fband': geo.focusBand,
    } as React.CSSProperties;

    const pill = (
      <button
        type='button'
        ref={ref}
        onClick={onClick}
        aria-pressed={isSelected}
        data-solution={showSolution ? 'shown' : 'hidden'}
        style={{ clipPath: geo.clip[ringW] }}
        className={classNames('qopt', {
          'is-compact': compact,
          'is-selected': isSelectedLive,
          'is-revealed': isRevealedCorrect,
          'is-ruled': isRuledOut && !isRevealedCorrect,
        })}
      >
        {showIndex && (
          <span className='qbadge' style={{ clipPath: BADGE_CLIP }}>
            {/* The ✕ marks only options the learner actually guessed, so
                the mark stays personal; options merely receding at reveal
                keep their number. The ✓ belongs to the revealed answer. */}
            {isRevealedCorrect ? (
              <span className='qbadge-mark'>
                <CheckIcon />
                <span className='sr-only'>Correct answer</span>
              </span>
            ) : hasBeenIncorrectlyGuessed ? (
              <span className='qbadge-mark'>
                <TimesIcon />
                <span className='sr-only'>Ruled out</span>
              </span>
            ) : (
              (abbreviation ?? index)
            )}
          </span>
        )}
        <span className='qopt-label'>
          <KatexSpan text={label} />
        </span>
      </button>
    );

    // Wrong-pick feedback lives in the reserved slot above the options
    // (components/quiz/feedbackSlot.tsx), never attached to the pill — so
    // the palette holds still whatever happens.
    //
    // `is-ringed`, NOT the lab's `ring`: in the app that word is Tailwind
    // v4's ring utility (a 1px currentColor box-shadow), and the collision
    // drew a stray rectangle around every ringed pill.
    //
    // Shortcut-teaching tooltip (Malik, 2026-08-22; docs/pixel-ui.md §
    // Tooltips): a labeled control may carry a tip when it teaches
    // something the label doesn't — here, that the badge is a KEY.
    // Hover-only (keyboard users are already pressing keys; arrow-driven
    // focus would flash a tip on every move), desktop-only by the
    // hover:none rule, and silent once the solution shows — a finished
    // question teaches nothing.
    const shortcutTip = abbreviation ? (
      <>
        Type <kbd className='qtip-kbd'>{abbreviation}</kbd>
      </>
    ) : typeof index === 'number' && index >= 1 && index <= 9 ? (
      <>
        Press <kbd className='qtip-kbd'>{index}</kbd>
      </>
    ) : null;
    return (
      <div
        className={classNames('qopt-wrap', {
          'is-compact': compact,
          'is-ringed': ringW > 0,
        })}
        style={wrapStyle}
      >
        {shortcutTip && !showSolution && !tipRetired ? (
          <PixelTip tip={shortcutTip} side='top' hoverOnly>
            {pill}
          </PixelTip>
        ) : (
          pill
        )}
      </div>
    );
  }
);

Option.displayName = 'Option'; // Add display name here

export default Option;
