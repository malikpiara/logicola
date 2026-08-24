'use client';

import { useEffect, useState } from 'react';

/**
 * The bottom safe-area inset in px — the gesture pill's strip, or the
 * taller 3-button navigation bar.
 *
 * Needed as a NUMBER, not as `env(safe-area-inset-bottom)` in CSS,
 * because it feeds vaul's snap points: those are parsed with
 * `parseInt`, so a `calc()` string would come back NaN and break
 * snapping outright. Everything else that clears the bars can and does
 * use the CSS function directly.
 *
 * Measured with a probe element rather than assumed: the inset differs
 * by device and by navigation mode, and it changes on rotation.
 */
export function useSafeAreaBottom(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    function measure() {
      const probe = document.createElement('div');
      probe.style.cssText =
        'position:fixed;left:0;bottom:0;width:0;' +
        'height:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none';
      document.body.appendChild(probe);
      const height = probe.getBoundingClientRect().height;
      probe.remove();
      // setInset bails on same value by React's Object.is, so the
      // steady-state resize storm never re-renders the quiz tree.
      setInset(Math.round(height));
    }

    // rAF-coalesced (2026-08-24): mobile fires `resize` continuously as
    // the URL bar collapses during scroll, and each raw call was an
    // append + layout read + remove — a forced reflow per tick.
    let raf = 0;
    function scheduleMeasure() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    }

    measure();
    // Rotation and the browser's collapsing chrome both change it.
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('orientationchange', scheduleMeasure);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('orientationchange', scheduleMeasure);
    };
  }, []);

  return inset;
}
