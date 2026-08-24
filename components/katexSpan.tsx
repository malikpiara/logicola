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
const KatexSpanImpl = React.lazy(() => import('./katexSpanImpl'));

export type { KatexSpanProps };

export function preloadKatex(): void {
  void import('./katexSpanImpl');
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
