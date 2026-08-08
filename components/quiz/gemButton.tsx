import React from 'react';
import classNames from 'classnames';
import { FOCUS_GAP, FOCUS_W, gemClip, ringBand } from '@/lib/pixel';

/**
 * The quiz's primary CTA in the gem silhouette — the NEW badge's elongated
 * octagon (two-step stair chamfers, fixed 4/8px), the working default from
 * the pattern lab's Primary button dial (Malik, 2026-08-06; Logo and
 * Sprite remain live alternatives on the dial).
 *
 * The focus mark cannot be an outline or ring: `clip-path` clips
 * everything the element paints, outline and box-shadow included, so a
 * clipped button's focus ring silently disappears — an accessibility
 * regression, not a styling nit. Instead the unclipped wrapper paints a
 * 2px band in the gem's own geometry, standing 2px off the silhouette
 * (the same mark the option pills use), via `:has(:focus-visible)`.
 *
 * The band is `currentColor`: both quiz screens set the surrounding text
 * colour to the set's ink, which is exactly what the mark should be.
 */
const GEM_CLIP = gemClip();
const GEM_FOCUS_BAND = ringBand('pixel', FOCUS_W, 24, 4);
const GEM_FOCUS_INSET = `${-(FOCUS_GAP + FOCUS_W)}px`;

// Every value is a module constant, so the wrapper's style object is too —
// a fresh object per render would defeat downstream memoization for free.
const GEM_WRAP_STYLE = {
  '--gem-fband': GEM_FOCUS_BAND,
  '--gem-finset': GEM_FOCUS_INSET,
} as React.CSSProperties;

export interface GemButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Layout classes for the unclipped wrapper (width, alignment, margins). */
  containerClassName?: string;
}

export function GemButton({
  className,
  containerClassName,
  style,
  children,
  ...props
}: GemButtonProps) {
  return (
    <span
      className={classNames(
        'gem-button-wrap relative block',
        containerClassName
      )}
      style={GEM_WRAP_STYLE}
    >
      <button
        type='button'
        className={classNames(
          // whitespace-nowrap: the ultra-expanded face wraps long labels
          // inside fixed-width containers, and a two-line "Check Answer"
          // next to a one-line "Next Question" is a layout shift.
          'motion-button w-full cursor-pointer whitespace-nowrap px-7 py-2.5 text-base font-semibold font-stretch disabled:transform-none disabled:cursor-not-allowed focus-visible:outline-none',
          className
        )}
        style={{ clipPath: GEM_CLIP, ...style }}
        {...props}
      >
        {children}
      </button>
    </span>
  );
}
