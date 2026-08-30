'use client';

import { useState } from 'react';
import { spriteClip } from '@/lib/pixel';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/quiz/pixelIcons';

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
 *
 * THE HANDLE MOVED ONTO THE IMAGE (Malik, 2026-08-26, variant B of
 * docs/before-after-lab.html). The control used to be a bare range bar
 * BELOW the stage, which detached the handle from the thing it moves and
 * put no affordance on the image at all. It is still the same native
 * input — that is what pays for arrow keys, Home/End and an announced
 * value — but it now lies over the stage at zero opacity, with a drawn
 * chip riding the divider. Three details are load-bearing:
 *
 *  1. THUMB INSET. A native thumb's centre travels from thumbW/2 to
 *     width - thumbW/2, not 0 to width. At `width: 100%` the drawn chip
 *     drifts from the pointer by up to half a thumb at the ends, so the
 *     input is THUMB px wider than the stage and offset by -THUMB/2 —
 *     which makes the thumb centre span exactly 0-100%. Measured at
 *     0/25/50/75/100: zero drift.
 *  2. TOUCH SCROLL. An input covering a 600px-tall figure would swallow
 *     vertical drags and trap a phone reader mid-post. `touch-action:
 *     pan-y` hands vertical gestures back to the browser.
 *  3. THE FOCUS RING GOES ON THE STAGE. `clip-path` clips an element's
 *     outline and box-shadow too, so a ring on the sprite-cornered chip
 *     would be eaten by its own corners. `:has()` puts it on the stage,
 *     which is the object the slider actually controls.
 *
 * Known limit, left standing: a wipe at 50% only ever shows the left half
 * of "then" and the right half of "now", so content at an edge stays in
 * one state until the reader drags to the extreme. Variant C of the lab
 * (the tags as buttons that snap to 0/100) fixes it and was not taken.
 */

/** R=12 sprite corners — the Guide chip's radius (docs/pixel-ui.md). */
const HANDLE_CLIP = spriteClip(0, 12);

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
        <input
          type='range'
          min={0}
          max={100}
          value={pct}
          onChange={(event) => setPct(Number(event.target.value))}
          className='ba-range'
          aria-label={`${alt}: reveal the old version`}
        />
        <span
          className='ba-handle'
          style={{ left: `${pct}%`, clipPath: HANDLE_CLIP }}
          aria-hidden='true'
        >
          <ArrowLeftIcon className='ba-chev' />
          <ArrowRightIcon className='ba-chev' />
        </span>
      </div>
    </div>
  );
}
