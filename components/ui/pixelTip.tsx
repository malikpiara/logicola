'use client';

import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { spriteClip } from '@/lib/pixel';

// The keycaps' chip clip (Sprite 4px) — tooltips are microcontent in the
// same chip grammar as notation.
const TIP_CLIP = spriteClip(0, 8);

/**
 * One provider at the app root: Radix's delay grouping lives here —
 * 300ms to open the first tip, and neighbors within 600ms of one
 * closing open instantly (the user has proven intent). Shared across
 * every PixelTip on the page by construction.
 */
export function PixelTipProvider({ children }: { children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={300} skipDelayDuration={600}>
      {children}
    </Tooltip.Provider>
  );
}

/**
 * A plain tooltip in the pixel grammar, on Radix Tooltip (adopted
 * 2026-08-22 after a CSS-only spike; the contract lives in
 * docs/pixel-ui.md § Tooltips). Radix is in-family here — dialog,
 * navigation-menu and vaul already ride it — and it buys what CSS
 * positioning can't: a PORTAL (the tip escapes clipped and scrolling
 * ancestors like Set R's options grid, and `.quiz-immersive`'s own
 * `kbd` styling), collision-aware placement, delay grouping, Esc
 * dismissal and the aria-describedby wiring — all for free.
 *
 *   - DESKTOP-ONLY: Radix never opens on touch, and `@media
 *     (hover: none)` hides the content besides — nothing essential may
 *     live here.
 *   - Plain labels for icon-only controls; shortcut teaching as
 *     `Label — Key` or a bare `Press 3`; keys render as
 *     <kbd className='qtip-kbd'>. Never a restatement of a visible label.
 */
export function PixelTip({
  tip,
  side = 'bottom',
  hoverOnly = false,
  suppressed = false,
  children,
}: {
  /** Plain text or JSX — keys render as <kbd className='qtip-kbd'>. */
  tip: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Reveal on hover only, never on keyboard focus — for tips whose
   * content is FOR pointer users (the options' shortcut tips: keyboard
   * users are already pressing the keys, and arrow-driven focus would
   * flash a tip on every move). Screen readers still get the text via
   * Radix's aria-describedby.
   */
  hoverOnly?: boolean;
  /** Hold the tip closed while something else owns the hand (a drag). */
  suppressed?: boolean;
  children: React.ReactElement;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip.Root open={open && !suppressed} onOpenChange={setOpen}>
      {/* asChild: the child IS the trigger — Radix merges its handlers
          and aria onto the real control, no wrapper in the layout.
          preventDefault on focus makes Radix skip its focus-open (its
          handlers compose behind defaultPrevented). */}
      <Tooltip.Trigger
        asChild
        onFocus={hoverOnly ? (event) => event.preventDefault() : undefined}
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={6}
          collisionPadding={8}
          className='qtip'
          style={{ clipPath: TIP_CLIP }}
        >
          {tip}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
