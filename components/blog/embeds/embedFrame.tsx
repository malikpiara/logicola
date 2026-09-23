'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * The figure that holds an embedded drill (2026-09-21).
 *
 * It exists for one reason: a drill inside an article changes height when
 * the reader presses Start (a 640-ish start screen becomes a taller
 * question card) and again when the guide opens. Left alone the article
 * below simply jumps. Malik's call was to let it grow, but to ease the
 * growth — so the frame carries an EXPLICIT height, measured from its
 * content, and the height is a transitionable value instead of `auto`.
 *
 * Why the explicit height at all: a transition needs two computed values
 * to interpolate between, and a box whose content grew is `auto` both
 * before and after. Nothing changed as far as CSS is concerned, so
 * nothing animates. Measuring turns that into 779px → 893px, which does.
 *
 * Three details worth keeping:
 *   - The FIRST measurement is written with transitions off. Otherwise
 *     the frame animates up from zero on mount, which is a page-load
 *     animation nobody asked for.
 *   - Writes are coalesced into one rAF. The observer fires per frame
 *     while the guide's sheet slides, and a height write is a layout
 *     write — one per frame is the budget, not one per notification.
 *   - Reduced motion drops the transition in CSS, not here: the height
 *     still tracks, it just arrives immediately.
 */
export function EmbedFrame({
  surface,
  children,
}: {
  /** The set's own surface, painted under every state — see globals.css. */
  surface?: string;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const content = contentRef.current;
    if (!frame || !content) return;

    let raf = 0;
    let measured = false;

    const write = () => {
      raf = 0;
      const height = content.offsetHeight;
      if (!height) return;
      if (!measured) {
        measured = true;
        // Mount: adopt the height without animating up from nothing.
        frame.style.transition = 'none';
        frame.style.height = `${height}px`;
        // Flush, so the cleared transition below can't batch with it.
        void frame.offsetHeight;
        frame.style.transition = '';
        return;
      }
      frame.style.height = `${height}px`;
    };

    const observer = new ResizeObserver(() => {
      if (raf) return;
      raf = requestAnimationFrame(write);
    });
    observer.observe(content);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className='not-prose lx-quiz-embed'
      style={
        {
          '--lx-embed-surface': surface,
        } as React.CSSProperties
      }
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
