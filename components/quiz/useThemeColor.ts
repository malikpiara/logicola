'use client';

import { useEffect } from 'react';

/**
 * Paint the browser/OS chrome with the quiz's own surface while a quiz
 * is on screen — the Android status bar and, in the installed PWA, the
 * gesture bar (Malik, on Android, 2026-08-08: those strips stayed white
 * against a lilac card).
 *
 * `theme-color` is a meta tag, not CSS, so it can't be expressed in the
 * component tree: Next renders one from the root `viewport` export and
 * the browser reads whichever tag is live. This swaps its content for
 * the duration of the quiz and puts the original back on unmount, so
 * every other route keeps the app's white.
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
    const previous = meta.content;
    meta.content = color;

    return () => {
      if (ownsTag) {
        meta.remove();
        return;
      }
      meta.content = previous;
    };
  }, [color]);
}
