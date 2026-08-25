'use client';

import { useState } from 'react';

/**
 * Before/after comparison slider for blog posts (Malik, 2026-08-24).
 * Two same-size screenshots; the range input sweeps a clip line
 * between them. Authoring marker (see quizEmbed.tsx for the island
 * pipeline):
 *
 *   <div data-island="before-after" data-before="/blog/x/then.png"
 *        data-after="/blog/x/now.png" data-alt="The landing page"
 *        data-width="1440" data-height="900"></div>
 *
 * The intrinsic width/height reserve the box (CLS), the aspect-ratio
 * keeps it responsive, and the whole thing is keyboard-accessible for
 * free because the control IS a native range input.
 */
export function BeforeAfter({
  before,
  after,
  alt,
  width,
  height,
}: {
  before: string;
  after: string;
  alt: string;
  width: number;
  height: number;
}) {
  const [pct, setPct] = useState(50);
  return (
    <div className='not-prose ba-wrap'>
      <div className='ba-stage' style={{ aspectRatio: `${width} / ${height}` }}>
        <img
          src={after}
          alt={`${alt} — now`}
          width={width}
          height={height}
          loading='lazy'
          decoding='async'
        />
        <div
          className='ba-before'
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        >
          <img
            src={before}
            alt={`${alt} — before`}
            width={width}
            height={height}
            loading='lazy'
            decoding='async'
          />
        </div>
        <div
          className='ba-line'
          style={{ left: `${pct}%` }}
          aria-hidden='true'
        />
        <span className='ba-tag ba-tag-left' aria-hidden='true'>
          then
        </span>
        <span className='ba-tag ba-tag-right' aria-hidden='true'>
          now
        </span>
      </div>
      <input
        type='range'
        min={0}
        max={100}
        value={pct}
        onChange={(event) => setPct(Number(event.target.value))}
        className='ba-range'
        aria-label={`${alt}: reveal the old version`}
      />
    </div>
  );
}
