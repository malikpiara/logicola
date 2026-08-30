'use client';

import { useId, useState } from 'react';
import { pixelPts, spriteClip } from '@/lib/pixel';

/**
 * The shape dial (Malik, 2026-08-26). This started as five tiles in a
 * PNG, which is the wrong medium for it: the comparison is not "here are
 * five shapes", it is "here is ONE shape under five rules", and that only
 * lands if the same object changes while you watch. So the figure is a
 * component and the reader turns the dial.
 *
 * Everything but the last two comes out of `lib/pixel.ts` — the same
 * generators the quiz screens run, so the figure cannot drift from the
 * app. The contour and the crenellation are rebuilt here because neither
 * survives in the codebase: one was cut, the other reverted the day it
 * was built.
 *
 *   <div data-island="silhouettes"></div>
 */

/**
 * The reverted idea: a seeded crenellation biting into the pill's
 * STRAIGHT edges. Deterministic, so it renders identically on the server
 * and the client — a Math.random version hydrated to a different shape.
 */
function crenellation(w: number, h: number, u = 6, seed = 9): string {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const bite = () => (rnd() < 0.42 ? u : 0);
  const pts: string[] = [];
  for (let x = 0; x <= w - u; x += u) pts.push(`${x}px ${bite()}px`);
  for (let y = 0; y <= h - u; y += u) pts.push(`calc(100% - ${bite()}px) ${y}px`);
  for (let x = w; x >= u; x -= u) pts.push(`${x}px calc(100% - ${bite()}px)`);
  for (let y = h; y >= u; y -= u) pts.push(`${bite()}px ${y}px`);
  return `polygon(${pts.join(', ')})`;
}

const SHAPES = [
  {
    key: 'pill',
    label: 'Pill',
    clip: 'inset(0 round 999px)',
    note: 'The smooth default. Correct everywhere, and with no grammar of its own.',
    verdict: null,
  },
  {
    key: 'pixel',
    label: 'Pixel',
    clip: `polygon(${pixelPts(0, 12).join(', ')})`,
    note: 'Two chunky stairs per corner. Reads as low resolution rather than as a bitmap — the steps are so big they become the shape.',
    verdict: null,
  },
  {
    key: 'sprite',
    label: 'Sprite',
    clip: spriteClip(0, 24),
    note: 'A quarter-circle of radius 24 sampled onto a four-pixel grid: four stairs, always the same four.',
    verdict: 'shipped',
  },
  {
    key: 'contour',
    label: 'Contour',
    clip: spriteClip(0, 24),
    note: 'The sprite silhouette with a dark outline behind it, for weight. Cut — it sat heavy on a page of them.',
    verdict: 'cut',
  },
  {
    key: 'crenellation',
    label: 'Crenellation',
    clip: null,
    note: 'Random bites along every edge, on the theory that pixel art looks hand-cut. Reverted: irregularity reads as damage, not as resolution.',
    verdict: 'reverted',
  },
] as const;

export function SilhouetteDial() {
  const [i, setI] = useState(2);
  const groupId = useId();
  const shape = SHAPES[i]!;
  const clip = shape.clip ?? crenellation(360, 92);

  return (
    <figure className='not-prose sd-wrap'>
      <div
        className='sd-tabs'
        role='radiogroup'
        aria-label='Answer-pill silhouette'
      >
        {SHAPES.map((s, index) => (
          <button
            key={s.key}
            type='button'
            role='radio'
            aria-checked={index === i}
            id={`${groupId}-${s.key}`}
            className='sd-tab'
            onClick={() => setI(index)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className='sd-stage'>
        {shape.key === 'contour' && (
          <span
            className='sd-contour'
            style={{ clipPath: spriteClip(0, 28) }}
            aria-hidden='true'
          />
        )}
        <span className='sd-pill' style={{ clipPath: clip }} aria-hidden='true'>
          Every A is B
        </span>
      </div>

      <figcaption className='sd-note' aria-live='polite'>
        {shape.verdict && (
          <b className={`sd-verdict sd-${shape.verdict}`}>{shape.verdict}</b>
        )}
        {shape.note}
      </figcaption>
    </figure>
  );
}
