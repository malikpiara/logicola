'use client';

import React, { Suspense } from 'react';
import type { KatexSpanProps } from './katexSpanImpl';

/**
 * Lazy boundary in front of katexSpanImpl (2026-08-24). KaTeX is the
 * app's largest asset — 265 KB of JS plus a render-blocking stylesheet
 * — and the quiz route's first screen renders zero math: nothing needs
 * it until Start is pressed. Splitting HERE keeps every call site's
 * import path unchanged while katex + its css move into their own
 * chunk. The quiz shell calls preloadKatex() on mount, so the chunk
 * loads during the start screen's idle seconds and the raw-text
 * Suspense fallback is never seen in practice.
 *
 * SSG prerenders still carry the full KaTeX HTML (React renders lazy
 * components server-side), so crawlers and first paint lose nothing.
 */
const KatexSpanImpl = React.lazy(() =>
  import('./katexSpanImpl').catch(() => {
    // A stale client after a deploy can 404 the old chunk hash. Raw
    // text beats a blanked route: fall back to the same plain render
    // the Suspense fallback shows, permanently for this page load.
    return {
      default: ({ as: Component = 'span', text, ...rest }: KatexSpanProps) => (
        <Component {...rest}>{text}</Component>
      ),
    };
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
    <Suspense fallback={<Component {...delegated}>{text}</Component>}>
      <KatexSpanImpl as={Component} text={text} {...delegated} />
    </Suspense>
  );
}
