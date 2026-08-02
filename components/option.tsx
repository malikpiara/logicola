import classNames from 'classnames';
import React from 'react';
import KatexSpan from './katexSpan';
import { FeedbackText } from './quiz/feedbackText';

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
   * distinct from the committed selection). Renders a lighter highlight
   * than `isSelected` so "where I am" reads apart from "what I've picked".
   */
  isCursor?: boolean;
  /**
   * Render for the immersive (set-colored) quiz surface: large translucent
   * pills tinted with `--quiz-fg` against `--quiz-surface`, an outline when
   * selected, and the mono prefix inside a circled badge. The badge doubles
   * as an homage to the original LogiCola, which highlighted the typed
   * abbreviation in a filled box.
   */
  immersive?: boolean;
  /**
   * Feedback text rendered attached beneath this pill (immersive list
   * layout only), indented to the label's left edge — so a wrong pick's
   * explanation sits WITH the pick instead of at the far bottom of the
   * card. Rose-toned for wrong options, foreground ink when this option
   * is the correct one (review mode).
   */
  hint?: string;
}

/**
 * One answer option. A single visual language across every set — a quiet
 * mono prefix (the option's number, or its typeable code on abbreviation
 * sets) before a regular-weight label, with a magenta tint marking the
 * selection — in two sizes: `compact` for the 18-option grids, roomy for
 * the classic four-option lists.
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
      hint,
    },
    ref
  ) => {
    const isRevealedCorrect = showSolution && isCorrect;
    const isRuledOut =
      (showSolution && !isCorrect) || hasBeenIncorrectlyGuessed;

    const optionClasses = immersive
      ? classNames(
          // Typeform-style pill on the set-colored surface. All color comes
          // from --quiz-fg/--quiz-surface so one ruleset works on both dark
          // (Set A) and pastel (Sets C/J/L/N/R) surfaces. border-2 always,
          // transparent at rest, so selection never shifts layout.
          'motion-option w-full cursor-pointer text-left flex border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--quiz-fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--quiz-surface)]',
          compact
            ? 'rounded-xl ps-3 pe-3 items-start'
            : 'rounded-full ps-4 pe-6 items-center',
          {
            'border-transparent bg-[color-mix(in_srgb,var(--quiz-fg)_9%,transparent)] text-[var(--quiz-fg)]':
              !isRevealedCorrect && !isRuledOut && !isSelected,
            // The revealed answer inverts — the strongest thing on the
            // surface, in the same "adaptive ink" as the start screen CTA.
            'border-transparent bg-[var(--quiz-fg)] text-[var(--quiz-surface)]':
              isRevealedCorrect,
            // Ruled out: receded fill, rose mixed toward the foreground so
            // it stays legible on dark and light surfaces alike.
            'border-transparent bg-[color-mix(in_srgb,var(--quiz-fg)_5%,transparent)] text-[color-mix(in_srgb,#f43f5e_55%,var(--quiz-fg))]':
              isRuledOut && !isRevealedCorrect,
            'border-[var(--quiz-fg)] bg-[color-mix(in_srgb,var(--quiz-fg)_15%,transparent)] text-[var(--quiz-fg)]':
              !showSolution && isSelected,
            'border-[color-mix(in_srgb,var(--quiz-fg)_45%,transparent)]':
              !showSolution && !isSelected && isCursor,
            'hover:bg-[color-mix(in_srgb,var(--quiz-fg)_15%,transparent)]':
              !showSolution,
          }
        )
      : classNames(
          'motion-option w-full cursor-pointer ps-4 pe-4 text-left text-base leading-6 text-gray-900 flex items-start border rounded-xl focus:outline-fuchsia-500',
          {
            'border-gray-200': !isSelected && !showSolution,
            'bg-[#1ad85f]': showSolution && isCorrect,
            'border-rose-200 text-red-500': isRuledOut,
            // The selection tint stays legible even with several options
            // picked at once (multi-select grids).
            'border-fuchsia-500 bg-fuchsia-50': !showSolution && isSelected,
            // Cursor-only (multi-select keyboard focus): lighter than a pick.
            'border-fuchsia-300': !showSolution && !isSelected && isCursor,
            'hover:border-fuchsia-300 focus:border-fuchsia-400': !showSolution,
          }
        );

    // The mono prefix turns magenta when picked, red when ruled out.
    const prefixColor = showSolution
      ? isCorrect
        ? 'text-gray-800'
        : 'text-red-400'
      : isSelected
        ? 'text-fuchsia-700'
        : 'text-gray-400';

    // Immersive prefix: a circled badge, filled when picked (and repainted
    // in surface ink on the inverted revealed-answer pill).
    const badgeClasses = classNames(
      'flex shrink-0 items-center justify-center rounded-full border font-mono lowercase tabular-nums',
      compact ? 'mt-2 h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs',
      isRevealedCorrect
        ? 'border-[color-mix(in_srgb,var(--quiz-surface)_60%,transparent)] text-[var(--quiz-surface)]'
        : isSelected && !showSolution
          ? 'border-transparent bg-[var(--quiz-fg)] text-[var(--quiz-surface)]'
          : 'border-[color-mix(in_srgb,var(--quiz-fg)_45%,transparent)] text-[color-mix(in_srgb,var(--quiz-fg)_85%,transparent)]'
    );

    const pill = (
      <button
        type='button'
        ref={ref}
        onClick={onClick}
        className={optionClasses}
        aria-pressed={isSelected}
        data-solution={showSolution ? 'shown' : 'hidden'}
      >
        <div
          className={classNames(
            'flex',
            immersive
              ? compact
                ? 'items-start gap-2.5'
                : 'items-center gap-3.5'
              : 'items-baseline',
            !immersive && (compact ? 'gap-2.5' : 'gap-3')
          )}
        >
          {showIndex &&
            (immersive ? (
              <span className={badgeClasses}>{abbreviation ?? index}</span>
            ) : (
              <span
                className={classNames(
                  'shrink-0 font-mono lowercase tabular-nums',
                  compact ? 'text-xs' : 'text-sm',
                  prefixColor
                )}
              >
                {abbreviation ?? index}
              </span>
            ))}
          <div
            className={
              immersive
                ? compact
                  ? 'py-2.5 text-sm leading-5 font-normal'
                  : 'py-3.5 text-lg md:text-xl font-normal'
                : compact
                  ? 'py-3.5 text-sm leading-5 font-normal'
                  : 'py-4 font-normal'
            }
          >
            <KatexSpan text={label} />
          </div>
        </div>
      </button>
    );

    // Immersive list pills carry their own feedback slot. The wrapper div
    // renders unconditionally (not only when a hint exists) so the button's
    // tree position — and its focus — survives the hint appearing after a
    // wrong check. The aria-live region is likewise always present so the
    // hint's arrival is announced.
    if (immersive && !compact) {
      return (
        <div className='w-full'>
          {pill}
          <div aria-live='polite'>
            {hint && (
              // ps matches the pill's internal geometry (ps-4 + badge w-8 +
              // gap-3.5 = 62px) so the hint indents to the label's own left
              // edge — visibly a continuation of that pill, not a sibling.
              <div
                className='motion-answer-reveal mt-2 whitespace-pre-line ps-[62px] pe-6 text-base leading-7'
                style={{
                  color: isCorrect
                    ? 'color-mix(in srgb, var(--quiz-fg) 82%, transparent)'
                    : 'color-mix(in srgb, #f43f5e 45%, var(--quiz-fg))',
                }}
              >
                <FeedbackText text={hint} />
              </div>
            )}
          </div>
        </div>
      );
    }

    return pill;
  }
);

Option.displayName = 'Option'; // Add display name here

export default Option;
