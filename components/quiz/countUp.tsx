'use client';

import { useEffect, useRef } from 'react';

/**
 * A number that counts up to its value once, on mount.
 *
 * Decided in docs/endscreen-lab.html (Malik, 2026-08-23), and three of the
 * decisions are load-bearing enough that changing them will look like a bug.
 *
 * A CASCADE, NOT A QUEUE. `order` offsets each figure from the one before
 * it START-to-start, not end-to-start. A strictly sequential version was
 * built and rejected: a figure sitting at 0 for the 480ms its neighbour
 * counts does not read as "waiting its turn", it reads as broken, because
 * nothing on screen explains why that number is dead. At 130ms apart every
 * figure is visibly moving within a sixth of a second and the eye still
 * gets the top-to-bottom cascade.
 *
 * IT NEVER OVERSHOOTS. Straight ease-out to the true value, no spring and
 * no bounce. A score that reads 104 before settling on 100, even for one
 * frame, is a lie about a graded exercise.
 *
 * THE BOX IS SIZED UP FRONT. `min-width` in `ch` — which with tabular
 * figures is exactly one digit advance — so "7" occupies the same box as
 * "100" from the first frame. Tabular figures alone do NOT fix this: a
 * count changes the number of digits, not just their widths, so without the
 * reservation the row reflows on every carry. Measured before and after in
 * the lab: 3.6px of drift, then 0.
 */

/** How long one figure takes to reach its value. */
const COUNT_MS = 480;
/** Start-to-start offset between figures. See the cascade note above. */
const COUNT_OFFSET_MS = 130;

/** The value is entering, so it eases OUT — matches --ease-out-quart. */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function CountUp({
  value,
  order = 0,
  className,
}: {
  value: number;
  /** Position in the cascade, in reading order. 0 starts immediately. */
  order?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion still SHOWS the number — it is information, not
    // decoration. It simply arrives rather than counting.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = String(value);
      return;
    }

    let frame = 0;
    const startAt = performance.now() + order * COUNT_OFFSET_MS;
    node.textContent = '0';

    // rAF writing textContent on a ref, never state — a re-render per frame
    // is exactly how a counter drops them.
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - startAt) / COUNT_MS));
      node.textContent = String(Math.round(easeOutQuart(t) * value));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value, order]);

  return (
    <>
      <span
        ref={ref}
        aria-hidden
        className={className}
        // Reserved to the FINAL value, so nothing reflows as digits arrive.
        style={{ minWidth: `${String(value).length}ch` }}
      >
        0
      </span>
      {/* The counting node is aria-hidden, so this static twin is what a
          screen reader announces — once, at its real value, instead of
          hearing it recount sixty times. */}
      <span className='sr-only'>{value}</span>
    </>
  );
}
