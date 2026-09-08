'use client';

import dynamic from 'next/dynamic';

/**
 * The generator figure's client-side boundary (Malik, 2026-09-07).
 * `import()` inside a client module is the only real async boundary
 * — see components/quiz/generated/index.tsx for the measurements —
 * so the Set C generator ships in its own chunk, on this post only.
 * ssr:false because the draw is random; the placeholder reserves the
 * figure's height so the island isn't its own layout shift. Marker:
 *
 *   <div data-island="template-roll" data-num="21" data-letters="abdc">
 *     …feed fallback…
 *   </div>
 *
 * `data-letters` is the program's option letters in the record's
 * order, for the badges; omit it and they count 1–4.
 */
const SetCTemplateRoll = dynamic(
  () => import('./embeds/setCTemplateRoll').then((m) => m.SetCTemplateRoll),
  {
    ssr: false,
    loading: () => (
      <figure
        className='not-prose tr-wrap'
        style={{ minHeight: 280 }}
        aria-hidden='true'
      >
        <p className='tr-eyebrow'>LOADING THE TEMPLATE…</p>
      </figure>
    ),
  }
);

export function TemplateRoll({
  num,
  letters,
}: {
  num: number;
  letters?: string;
}) {
  return <SetCTemplateRoll num={num} letters={letters} />;
}
