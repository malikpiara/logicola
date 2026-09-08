'use client';

import { useId, useState } from 'react';
import { gemClip, spriteClip } from '@/lib/pixel';

/**
 * The shape dial (Malik, 2026-08-26). This started as tiles in a PNG,
 * which is the wrong medium for it: the comparison is not "here are four
 * shapes", it is "here is ONE button under four silhouettes", and that
 * only lands if the same object changes while you watch. So the figure
 * is a component and the reader turns the dial.
 *
 * Re-pointed at the primary button (Malik, 2026-09-04). The dial used to
 * show the answer pill under five rules, one of them a seeded
 * crenellation that lived for a single lab session (2026-08-03) and that
 * the article had narrated as a lesson. The decision the article tells
 * is the primary button's, judged for consistency with Vitor's can.
 *
 * What the can's corner actually is (Malik, 2026-09-04, from the
 * wordmark asset): two-step stairs with every step's edge rounded — the
 * gem's silhouette with the rounding kept. The tries, all pre-release
 * experiments in Malik's framing (2026-09-04), whatever git's dates say:
 * a14160e (2026-07-17) restyled the CTA "to the logo" with
 * `corner-shape: superellipse(-2.4)` under a 9px radius, which renders a
 * NOTCH (concave), not stairs — cut because it looked like a Duracell
 * battery (Malik); f0a9759 (2026-08-08) put the gem on every drill CTA.
 * The lab dial's `logo`
 * entry (a 9px 45° chamfer octagon) matched neither the can nor the
 * shipped button, so it is not on this dial.
 *
 * Gem and Sprite come out of `lib/pixel.ts` — the same generators the
 * quiz screens run, so the figure cannot drift from the app. The notch
 * is rebuilt as a square-notch polygon: `corner-shape` is not universal
 * yet, and an unsupported property would silently show a rounded rect.
 *
 *   <div data-island="silhouettes"></div>
 */

/** The button's real size on the start screen: h-11 × max-w-[15rem]. */
const CTA_H = 44;

/**
 * The notch try, as a polygon: a 9px square notch cut from each corner.
 * The real thing was `corner-shape: superellipse(-2.4)` with
 * `rounded-[9px]` (a14160e), a slightly rounded notch; the square version
 * is the honest fallback where corner-shape is unsupported.
 */
const NOTCH_CLIP =
  'polygon(9px 0, calc(100% - 9px) 0, calc(100% - 9px) 9px, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 9px calc(100% - 9px), 0 calc(100% - 9px), 0 9px, 9px 9px)';

/**
 * Sprite clamps R to the button's height, stepping down in u=4 so the
 * profile stays on the grid (the lab's own rule: R=24 needs ≥48px).
 */
const SPRITE_R = Math.max(8, Math.min(24, Math.floor(CTA_H / 8) * 4));

const SHAPES = [
  {
    key: 'pill',
    label: 'Pill',
    clip: 'inset(0 round 999px)',
    note: "The smooth default, standing in for the original's rounded rectangle. It was never on the dial for this button; it is here as the baseline.",
    verdict: null,
  },
  {
    key: 'notch',
    label: 'Notch',
    clip: NOTCH_CLIP,
    note: 'Tried with one CSS property, corner-shape, which notches a corner but cannot step it. Cut: it looked too much like a Duracell battery.',
    verdict: 'cut',
  },
  {
    key: 'gem',
    label: 'Diamond',
    clip: gemClip(),
    note: "The can's corner drawn straight: two-step stairs on the 4 px grid, the rounding rasterised away. Born on the NEW badge; on every primary button in the drill since.",
    verdict: 'picked',
  },
  {
    key: 'sprite',
    label: 'Sprite',
    clip: spriteClip(0, SPRITE_R),
    note: "A quantised round, its radius clamped to the button's height. It rhymes with the answer pills instead of the can: not the drill's button, but the answer pills and the site's own buttons wear it.",
    verdict: 'picked',
  },
] as const;

export function SilhouetteDial() {
  const [i, setI] = useState(2);
  const groupId = useId();
  const shape = SHAPES[i]!;

  return (
    <figure className='not-prose sd-wrap'>
      <div
        className='sd-tabs'
        role='radiogroup'
        aria-label='Primary button silhouette'
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
        <span
          className='sd-pill sd-cta'
          style={{ clipPath: shape.clip }}
          aria-hidden='true'
        >
          Start Quiz
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
