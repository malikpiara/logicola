import React from 'react';

/**
 * Pixel icons from pixeliconlibrary.com — the 24-unit polygon grammar the
 * sprite silhouettes share (docs/pixel-ui.md § Iconography). Conventions:
 * `fill='currentColor'` so each icon takes the tone of the text it sits in
 * (hint lamps render in the error tone, badge marks in badge colour), and
 * `aria-hidden` — the meaning is always carried by adjacent text.
 *
 * Sizing is the caller's: 18px beside body/hint text, 12px inside badges,
 * 16px in the Guide chip. Pass Tailwind classes via `className`.
 */

interface PixelIconProps {
  className?: string;
}

function iconProps(className?: string) {
  return {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
    className,
  } as const;
}

/** 'minds' — the lamp. Marks a hint: guidance, not scolding. */
export function LampIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='15 18 15 22 14 22 14 23 10 23 10 22 9 22 9 18 15 18' />
      <polygon points='19 5 19 12 18 12 18 13 17 13 17 14 16 14 16 17 8 17 8 14 7 14 7 13 6 13 6 12 5 12 5 5 6 5 6 4 7 4 7 3 8 3 8 2 9 2 9 1 15 1 15 2 16 2 16 3 17 3 17 4 18 4 18 5 19 5' />
    </svg>
  );
}

/**
 * 'check' — marks the revealed answer's badge. Its ~2-unit stroke matches
 * 'times', so the ✓/✕ badge marks read as one family.
 */
export function CheckIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='22 4 22 6 21 6 21 7 20 7 20 8 19 8 19 9 18 9 18 10 17 10 17 11 16 11 16 12 15 12 15 13 14 13 14 14 13 14 13 15 12 15 12 16 11 16 11 17 10 17 10 18 8 18 8 17 7 17 7 16 6 16 6 15 5 15 5 14 4 14 4 13 3 13 3 12 2 12 2 10 4 10 4 11 5 11 5 12 6 12 6 13 7 13 7 14 8 14 8 15 10 15 10 14 11 14 11 13 12 13 12 12 13 12 13 11 14 11 14 10 15 10 15 9 16 9 16 8 17 8 17 7 18 7 18 6 19 6 19 5 20 5 20 4 22 4' />
    </svg>
  );
}

/**
 * 'times' — replaces the index in the badge of a ruled-out guess, and is
 * the bare exit glyph in the mobile header row.
 */
export function TimesIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='14 13 15 13 15 14 16 14 16 15 17 15 17 16 18 16 18 17 19 17 19 18 20 18 20 19 21 19 21 20 22 20 22 21 21 21 21 22 20 22 20 21 19 21 19 20 18 20 18 19 17 19 17 18 16 18 16 17 15 17 15 16 14 16 14 15 13 15 13 14 11 14 11 15 10 15 10 16 9 16 9 17 8 17 8 18 7 18 7 19 6 19 6 20 5 20 5 21 4 21 4 22 3 22 3 21 2 21 2 20 3 20 3 19 4 19 4 18 5 18 5 17 6 17 6 16 7 16 7 15 8 15 8 14 9 14 9 13 10 13 10 11 9 11 9 10 8 10 8 9 7 9 7 8 6 8 6 7 5 7 5 6 4 6 4 5 3 5 3 4 2 4 2 3 3 3 3 2 4 2 4 3 5 3 5 4 6 4 6 5 7 5 7 6 8 6 8 7 9 7 9 8 10 8 10 9 11 9 11 10 13 10 13 9 14 9 14 8 15 8 15 7 16 7 16 6 17 6 17 5 18 5 18 4 19 4 19 3 20 3 20 2 21 2 21 3 22 3 22 4 21 4 21 5 20 5 20 6 19 6 19 7 18 7 18 8 17 8 17 9 16 9 16 10 15 10 15 11 14 11 14 13' />
    </svg>
  );
}

/**
 * 'book-heart' — the Guide toggle. The heart-on-cover variant over the
 * plain book: the reference guide is the loving part of the product.
 */
export function BookHeartIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='18 6 18 9 17 9 17 10 16 10 16 11 15 11 15 12 14 12 14 13 13 13 13 14 12 14 12 13 11 13 11 12 10 12 10 11 9 11 9 10 8 10 8 9 7 9 7 6 8 6 8 5 11 5 11 6 12 6 12 7 13 7 13 6 14 6 14 5 17 5 17 6 18 6' />
      <path d='m20,17h1v-1h1V2h-1v-1H4v1h-1v1h-1v18h1v1h1v1h17v-1h1v-1h-1v-1h-1v-3Zm-2,4H5v-1h-1v-2h1v-1h13v4ZM4,3h16v12H4V3Z' />
    </svg>
  );
}

/** 'angle-left-solid' — keycap arrow glyph. */
export function ArrowLeftIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='17 5 17 7 16 7 16 8 15 8 15 9 14 9 14 10 13 10 13 11 12 11 12 13 13 13 13 14 14 14 14 15 15 15 15 16 16 16 16 17 17 17 17 19 16 19 16 20 14 20 14 19 13 19 13 18 12 18 12 17 11 17 11 16 10 16 10 15 9 15 9 14 8 14 8 13 7 13 7 11 8 11 8 10 9 10 9 9 10 9 10 8 11 8 11 7 12 7 12 6 13 6 13 5 14 5 14 4 16 4 16 5 17 5' />
    </svg>
  );
}

/** 'angle-right-solid' — keycap arrow glyph. */
export function ArrowRightIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='7 19 7 17 8 17 8 16 9 16 9 15 10 15 10 14 11 14 11 13 12 13 12 11 11 11 11 10 10 10 10 9 9 9 9 8 8 8 8 7 7 7 7 5 8 5 8 4 10 4 10 5 11 5 11 6 12 6 12 7 13 7 13 8 14 8 14 9 15 9 15 10 16 10 16 11 17 11 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17 12 17 12 18 11 18 11 19 10 19 10 20 8 20 8 19 7 19' />
    </svg>
  );
}
