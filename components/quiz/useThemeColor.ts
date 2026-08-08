'use client';

import { useEffect } from 'react';

/**
 * Paint the OS chrome with the quiz's own surface while a quiz is on
 * screen (Malik, on Android, 2026-08-08: the strips top and bottom
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
 */
export function useThemeColor(color: string | undefined) {
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
    root.style.backgroundColor = color;
    body.style.backgroundColor = color;

    return () => {
      root.style.backgroundColor = previousRootBg;
      body.style.backgroundColor = previousBodyBg;
      if (ownsTag) {
        meta.remove();
        return;
      }
      meta.content = previousContent;
    };
  }, [color]);
}
