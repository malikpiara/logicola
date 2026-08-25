'use client';

import React, { Suspense } from 'react';
import type { KatexSpanProps } from './katexSpanImpl';
import { latexToGlyphs } from '@/lib/notation';

/**
 * What the reader sees while the KaTeX chunk is in flight.
 *
 * Rendering `text` verbatim put the SOURCE on screen — `$ (C \cdot (S
 * \vee M)) $` — for as long as the chunk took: measured at up to ~1.9s
 * on production over Fast 3G, since the click on Start routinely beats
 * a 265 KB download (Malik reported it on Set C, 2026-08-25; the claim
 * below that the fallback is "never seen in practice" was wrong).
 *
 * lib/notation.ts runs the operator table backwards, so the bridge
 * reads as `(C · (S ∨ M))` and the arrival of KaTeX changes the
 * typeface rather than the content. It imports nothing, so this stays
 * on the cheap side of the split.
 */
function FallbackSpan({
  as: Component = 'span',
  text,
  ...delegated
}: KatexSpanProps) {
  return (
    <Component {...delegated}>
      {typeof text === 'string' ? latexToGlyphs(text) : text}
    </Component>
  );
}

/**
 * Lazy boundary in front of katexSpanImpl (2026-08-24). KaTeX is the
 * app's largest asset — 265 KB of JS plus a render-blocking stylesheet
 * — and the quiz route's first screen renders zero math: nothing needs
 * it until Start is pressed. Splitting HERE keeps every call site's
 * import path unchanged while katex + its css move into their own
 * chunk. The quiz shell calls preloadKatex() on mount, so the chunk
 * loads during the start screen's idle seconds.
 *
 * That preload is a HEAD START, not a guarantee — an earlier version of
 * this comment claimed the fallback was "never seen in practice", and
 * Malik caught it on Set C the next day. A reader who presses Start
 * promptly on a phone beats 265 KB comfortably, so the fallback is a
 * surface people actually read: see FallbackSpan above.
 *
 * SSG prerenders still carry the full KaTeX HTML (React renders lazy
 * components server-side), so crawlers and first paint lose nothing.
 */
const KatexSpanImpl = React.lazy(() =>
  import('./katexSpanImpl').catch(() => {
    // A stale client after a deploy can 404 the old chunk hash. Glyphs
    // beat a blanked route: fall back to the same render the Suspense
    // fallback shows, permanently for this page load.
    return { default: FallbackSpan };
  })
);

export type { KatexSpanProps };

export function preloadKatex(): void {
  void import('./katexSpanImpl').then(() => {
    // Warm the faces too (2026-08-24, CLS audit #4): KaTeX declares 20
    // font-display:block faces that only start downloading when first
    // USED — so the first question's math measured in Times, then
    // re-wrapped when KaTeX_Main landed. Loading the three faces every
    // set actually reaches during the start screen removes that
    // re-measure. FontFace API, so no coupling to hashed font URLs.
    if (typeof document !== 'undefined' && 'fonts' in document) {
      void document.fonts.load('1.21em KaTeX_Main');
      void document.fonts.load('italic 1.21em KaTeX_Math');
      void document.fonts.load('1.21em KaTeX_Size1');
    }
  });
}

export default function KatexSpan({
  as: Component = 'span',
  text,
  ...delegated
}: KatexSpanProps) {
  return (
    <Suspense
      fallback={<FallbackSpan as={Component} text={text} {...delegated} />}
    >
      <KatexSpanImpl as={Component} text={text} {...delegated} />
    </Suspense>
  );
}
