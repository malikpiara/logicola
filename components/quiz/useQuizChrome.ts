'use client';

import { useEffect } from 'react';

/**
 * Tailwind's `lg` — the breakpoint at which the quiz card stops being
 * full-bleed and becomes a floating panel. Keep in sync with the
 * `lg:` classes on the card and the start screen.
 */
const CARD_FLOATS = '(min-width: 64rem)';

/**
 * Hold the document-level chrome for the duration of a quiz: paint it
 * in the set's surface, and stop an overscroll from reloading the run.
 *
 * COLOUR (Malik, on Android, 2026-08-08: the strips top and bottom
 * stayed white against a lilac card).
 *
 * The two bars are coloured by DIFFERENT mechanisms, which is why this
 * hook writes two things:
 *
 *   - The status bar (and the browser's address bar) reads the
 *     `theme-color` meta tag. Next renders one from the root `viewport`
 *     export; we swap its content and put the original back.
 *   - The NAVIGATION bar — the gesture pill at the bottom — ignores
 *     `theme-color` entirely and samples the DOCUMENT's background
 *     instead. `body` carries `bg-white`, so that is what Android drew.
 *     Inline styles outrank the utility class, so setting both elements
 *     is enough; restoring to '' hands the class back on exit.
 *
 * Painting the document also fixes the overscroll rubber-band, which
 * flashed white past the ends of the card for the same reason.
 *
 * DESKTOP CARVE-OUT (Malik, 2026-08-09: "you made the quiz window be
 * full width"). Below `lg` the card is full-bleed, so document and card
 * are the same rectangle and painting one paints the other. At `lg` and
 * up the card is a 1280px panel floating in ~160px of page on each side
 * — and painting that page in the card's own surface erased the edge,
 * so a card that never changed size stopped reading as a card. The
 * measurement was never the problem; the contrast was. So the paint is
 * scoped to the breakpoint where the two rectangles actually coincide,
 * and desktop keeps `body`'s own `bg-white`.
 *
 * Gated in JS rather than CSS because the colour is only known at mount
 * (see below) — a media query would need the value injected anyway, and
 * this keeps the whole document-chrome story in one file.
 *
 * Deliberately client-side rather than a per-route `generateViewport`:
 * generated sets (everything but Set Q) resolve their subset — and so
 * their palette — only at mount, so the server has no colour to render.
 *
 * OVERSCROLL. `overscroll-behavior-y: contain` disables the browser's
 * pull-to-refresh for the quiz only. A run holds its whole state in
 * memory — questions drawn, score, guesses — so an accidental
 * over-drag at the top of the card silently destroys it. Nothing about
 * a drill wants a refresh gesture, and everywhere else keeps it.
 */
export function useQuizChrome(color: string | null | undefined) {
  useEffect(() => {
    if (!color) return;

    // Media-scoped tags (light/dark variants) belong to the theme, not
    // to us — only the unscoped one describes "the current page".
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])'
    );
    const ownsTag = meta === null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    const previousContent = meta.content;
    meta.content = color;

    const root = document.documentElement;
    const { body } = document;
    const previousRootBg = root.style.backgroundColor;
    const previousBodyBg = body.style.backgroundColor;
    const previousOverscroll = root.style.overscrollBehaviorY;
    root.style.overscrollBehaviorY = 'contain';

    // Repaints on rotation and on a desktop window dragged narrow, so the
    // page never keeps a background that belongs to the other layout.
    const floats = window.matchMedia(CARD_FLOATS);
    const paint = () => {
      const fullBleed = !floats.matches;
      root.style.backgroundColor = fullBleed ? color : previousRootBg;
      body.style.backgroundColor = fullBleed ? color : previousBodyBg;
    };
    paint();
    floats.addEventListener('change', paint);

    return () => {
      floats.removeEventListener('change', paint);
      root.style.backgroundColor = previousRootBg;
      body.style.backgroundColor = previousBodyBg;
      root.style.overscrollBehaviorY = previousOverscroll;
      if (ownsTag) {
        meta.remove();
        return;
      }
      meta.content = previousContent;
    };
  }, [color]);
}
