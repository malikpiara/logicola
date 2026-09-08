'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';

/**
 * Phone states (Malik, 2026-09-02) — the picked-then-checked phone
 * figure, animated: the two frames sit as layers and the checked one
 * dissolves in on a slow loop, so the moment the section is about (what
 * changes when you check) is a change you watch rather than a diff you
 * reconstruct from two stills. A GIF would have done the same with no
 * off switch; this one uses the article's own crossfade token, pauses
 * while the pointer rests on it, hands over to the chips the moment
 * they're used, and never auto-plays under reduced motion.
 *
 *   <div data-island="phone-states" data-before="…" data-after="…"
 *        data-alt="…" data-width="679" data-height="1450"></div>
 */

const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/** Each state holds this long before the other dissolves in. */
// Asymmetric hold (motion pass, 2026-09-08): the check is the response
// the section is about, so it lingers; the pick snaps back sooner.
const PICKED_MS = 1600;
const CHECKED_MS = 3200;

export function PhoneStates({
  before,
  after,
  alt,
  width,
  height,
  beforeLabel = 'Picked',
  afterLabel = 'Checked',
}: {
  before: string;
  after: string;
  alt: string;
  width: number;
  height: number;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false
  );
  const [checked, setChecked] = useState(false);
  const [hovering, setHovering] = useState(false);
  // Once a chip is pressed the reader owns the state; the loop stops.
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (reduce || manual || hovering) return;
    const t = setTimeout(
      () => setChecked((c) => !c),
      checked ? CHECKED_MS : PICKED_MS
    );
    return () => clearTimeout(t);
  }, [reduce, manual, hovering, checked]);

  const choose = (next: boolean) => {
    setManual(true);
    setChecked(next);
  };

  return (
    <figure className='not-prose ps-wrap'>
      {/* Sizing and layering inline, not only in CSS: a stale stylesheet
          must never render two full-column phones stacked in the flow. */}
      <div
        className='ps-stage'
        style={{
          position: 'relative',
          maxWidth: 320,
          margin: '0 auto',
          aspectRatio: `${width} / ${height}`,
        }}
        // Mouse only: on touch, pointerenter fires on the tap and the
        // leave may never come, which would freeze the loop.
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHovering(false)}
      >
        <Image
          src={before}
          alt={`${alt}, ${beforeLabel.toLowerCase()}`}
          width={width}
          height={height}
          className={`ps-layer${checked ? '' : ' is-on'}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: 'auto' }}
        />
        <Image
          src={after}
          alt={`${alt}, ${afterLabel.toLowerCase()}`}
          width={width}
          height={height}
          className={`ps-layer${checked ? ' is-on' : ''}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: 'auto' }}
        />
      </div>
      <div className='pr-rows ps-rows'>
        <div
          className='pr-row'
          role='radiogroup'
          aria-label='State (choosing one stops the loop)'
        >
          <button
            type='button'
            role='radio'
            aria-checked={!checked}
            className='pr-chip'
            onClick={() => choose(false)}
          >
            {beforeLabel}
          </button>
          <button
            type='button'
            role='radio'
            aria-checked={checked}
            className='pr-chip'
            onClick={() => choose(true)}
          >
            {afterLabel}
          </button>
        </div>
      </div>
    </figure>
  );
}
