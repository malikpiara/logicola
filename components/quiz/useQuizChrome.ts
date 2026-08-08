'use client';

import { useEffect } from 'react';

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
export function useQuizChrome(color: string | undefined) {
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
    root.style.backgroundColor = color;
    body.style.backgroundColor = color;
    root.style.overscrollBehaviorY = 'contain';

    return () => {
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
