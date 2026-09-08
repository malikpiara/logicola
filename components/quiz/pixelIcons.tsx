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

/** 'paint-brush' (solid) — the colour-mixer trigger in the blog's studio. */
export function PaintBrushIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='20 2 20 12 3 12 3 2 4 2 4 1 7 1 7 4 9 4 9 1 11 1 11 6 13 6 13 1 19 1 19 2 20 2' />
      <path d='M3,14v2H4v1H9v4h1v1h1v1h2V22h1V21h1V17h4V16h1V14Zm8,7V19h2v2Z' />
    </svg>
  );
}

/**
 * An eyedropper. The library has none (checked against its full set,
 * 2026-08-31), so — like the die below — it's drawn for the blog's
 * colour studio on the same 24-unit grid, in the toolbars' diagonal
 * pose: squeeze-bulb top-right, barrel stepping down to the tip. The
 * barrel is a chain of overlapping squares (nonzero fill unions the
 * subpaths), which is what keeps its staircase even. Marks the
 * EyeDropper sampling button in the mixer.
 */
export function EyeDropperIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d='M16 2H20V4H22V8H20V10H16V8H14V4H16ZM12 9H16V13H12ZM10 11H14V15H10ZM8 13H12V17H8ZM6 15H10V19H6ZM4 17H7V20H4ZM3 19H5V21H3ZM2 20H4V22H2Z' />
    </svg>
  );
}

/**
 * A die. The library has no dice, so this one is drawn for the blog's
 * Pastel Random island on the same 24-unit grid: 2-unit stepped corners
 * per the sprite rule, pips as even-odd holes. `face` picks the pip
 * layout (default 5, the original drawing) — the island lands the die on
 * a new face per roll, which is how a die reports an event: by face, not
 * by movement.
 */
const PIP = (x: number, y: number) => `M${x} ${y}H${x + 4}V${y + 4}H${x}V${y}Z`;
const DIE_FACES: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: [PIP(10, 10)].join(''),
  2: [PIP(5, 5), PIP(15, 15)].join(''),
  3: [PIP(5, 5), PIP(10, 10), PIP(15, 15)].join(''),
  4: [PIP(5, 5), PIP(15, 5), PIP(5, 15), PIP(15, 15)].join(''),
  5: [PIP(5, 5), PIP(15, 5), PIP(10, 10), PIP(5, 15), PIP(15, 15)].join(''),
  6: [
    PIP(5, 4),
    PIP(15, 4),
    PIP(5, 10),
    PIP(15, 10),
    PIP(5, 16),
    PIP(15, 16),
  ].join(''),
};

export function DiceIcon({
  className,
  face = 5,
}: PixelIconProps & { face?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  return (
    <svg {...iconProps(className)}>
      <path
        fillRule='evenodd'
        d={`M4 2H20V4H22V20H20V22H4V20H2V4H4V2Z${DIE_FACES[face]}`}
      />
    </svg>
  );
}

/**
 * 'angle-down-solid' — the caret on the FAQ accordion and, since
 * 2026-09-04, the desktop nav trigger, where lucide's ChevronDown had been
 * the last smooth glyph in the header (Malik, 2026-09-04: the release
 * article says every glyph is stepped, so every glyph has to be). The
 * landing page's drill links rotate it -90° into a "go" mark.
 */
export function AngleDownIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='5 7 7 7 7 8 8 8 8 9 9 9 9 10 10 10 10 11 11 11 11 12 13 12 13 11 14 11 14 10 15 10 15 9 16 9 16 8 17 8 17 7 19 7 19 8 20 8 20 10 19 10 19 11 18 11 18 12 17 12 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17 11 17 11 16 10 16 10 15 9 15 9 14 8 14 8 13 7 13 7 12 6 12 6 11 5 11 5 10 4 10 4 8 5 8 5 7' />
    </svg>
  );
}

/**
 * 'bars' — the mobile header's exercises-menu trigger, replacing a
 * hand-drawn three-stroke hamburger with round caps (Malik, 2026-09-04).
 * Rendered at 24px so the 2-unit bars land on whole pixels; the solid
 * variant's 4-unit bars read heavier than everything else in the row.
 */
export function BarsIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <rect x='1' y='3' width='22' height='2' />
      <rect x='1' y='11' width='22' height='2' />
      <rect x='1' y='19' width='22' height='2' />
    </svg>
  );
}

/**
 * 'copy' — the Keyboard page's copy buttons, replacing lucide's
 * ClipboardCopy (Malik, 2026-09-04).
 */
export function CopyIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='16 20 16 22 15 22 15 23 3 23 3 22 2 22 2 6 3 6 3 5 6 5 6 20 16 20' />
      <path d='m16,7V1h-8v1h-1v16h1v1h13v-1h1V7h-6Zm4,10h-11V3h5v6h6v8Z' />
      <polygon points='22 5 22 6 17 6 17 1 18 1 18 2 19 2 19 3 20 3 20 4 21 4 21 5 22 5' />
    </svg>
  );
}

/**
 * 'play-solid' / 'pause-solid' — the blog clips' toggle glyphs (Malik,
 * 2026-09-04: the word "Pause" in a chip read as UI chrome; a glyph reads
 * as a player). Solid over regular: at 14px the outlined pair blurs.
 */
export function PlayIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='22 11 22 13 21 13 21 14 20 14 20 15 18 15 18 16 16 16 16 17 15 17 15 18 13 18 13 19 11 19 11 20 10 20 10 21 8 21 8 22 6 22 6 23 3 23 3 22 2 22 2 2 3 2 3 1 6 1 6 2 8 2 8 3 10 3 10 4 11 4 11 5 13 5 13 6 15 6 15 7 16 7 16 8 18 8 18 9 20 9 20 10 21 10 21 11 22 11' />
    </svg>
  );
}

export function PauseIcon({ className }: PixelIconProps) {
  return (
    <svg {...iconProps(className)}>
      <polygon points='23 2 23 22 22 22 22 23 15 23 15 22 14 22 14 2 15 2 15 1 22 1 22 2 23 2' />
      <polygon points='9 2 10 2 10 22 9 22 9 23 2 23 2 22 1 22 1 2 2 2 2 1 9 1 9 2' />
    </svg>
  );
}
