'use client';

import { useState } from 'react';
import KatexSpan from '@/components/katexSpan';
import { BADGE_CLIP } from '@/components/option';
import { GemButton } from '@/components/quiz/gemButton';
import { CheckIcon } from '@/components/quiz/pixelIcons';
import {
  drawSetCTemplate,
  SET_C_TEMPLATE_COUNT,
} from '@/content/sets/setC.generator';

/**
 * One of Set C's 2008 templates, drawn live (Malik, 2026-09-07). The
 * release article's claim is that "infinitely generated" questions are
 * Gensler's own templates re-run with fresh names, not invented
 * content; a paragraph can assert that, a button proves it. Each press
 * draws the same template again through the drill's own renderer, so
 * the wording changes and the logic does not. The answer is marked —
 * this is a figure, not a drill.
 *
 * Two things tie it to the 2008 record printed above it in the post
 * (Malik, 2026-09-07, after the merged-frame lab was passed over for
 * being cluttered): the badges wear the program's own option letters
 * in the record's order, and a legend under the options states the
 * substitution the draw made — "$B sensitive, $D notorious, so $j S,
 * $q N" — in place of a paragraph explaining what the placeholders are.
 * The letter order is not stored per template, so the marker carries
 * it (`data-letters="abdc"`); without it the badges count 1–4.
 *
 * Branded per the lab's variant B (Malik, 2026-09-07, docs/
 * generator-island-lab.html): the badges wear the drill's diamond
 * silhouette and the button IS the drill's GemButton, not a copy of it.
 * The island palette stays; only the shapes changed.
 *
 * Lives in its own chunk behind components/blog/templateRoll.tsx's
 * client-side `dynamic()`, the bundle contract: the generator must
 * never be statically reachable from shared code.
 */
const seedNow = () => Math.floor(Math.random() * 2 ** 31);

export function SetCTemplateRoll({
  num,
  letters,
}: {
  num: number;
  /** The 2008 option letters in the record's order, e.g. "abdc". */
  letters?: string;
}) {
  // Lazy initializer, as the embeds do: the island is ssr:false, so no
  // server draw exists to mismatch during hydration.
  const [seed, setSeed] = useState(seedNow);
  const [draw, setDraw] = useState(1);
  const result = drawSetCTemplate(num, seed);

  if (!result) return null;
  const { question, bindings } = result;
  const badge = (index: number) => letters?.[index] ?? String(index + 1);

  // The bindings, in the order the record names them: $B $C $D, then
  // $j $k $q — so the legend reads the way the placeholders appear.
  const adjectives = Object.entries(bindings.adjectives).sort();
  const varLetters = Object.entries(bindings.letters).sort();

  return (
    <figure className='not-prose tr-wrap'>
      <p className='tr-eyebrow'>
        Set C · template {num} of {SET_C_TEMPLATE_COUNT} · draw {draw}
      </p>
      {/* One live region for the whole draw (prompt, rows, legend), so a
          draw is announced once and the rows — the thing that changed —
          are in it. The children are keyed on the draw so they remount
          and play the arrive sweep (motion pass, 2026-09-08). */}
      <div className='tr-live' aria-live='polite' aria-atomic='true'>
      <p className='tr-prompt' key={`prompt-${draw}`}>
        {question.prompt}
      </p>
      <ol className='tr-options' key={`options-${draw}`}>
        {question.options.map((option, index) => {
          const isAnswer = question.correctId.includes(option.id);
          return (
            <li
              key={option.id}
              className={`tr-option${isAnswer ? ' is-answer' : ''}`}
              style={{ '--i': index } as React.CSSProperties}
            >
              <span
                className='tr-badge'
                style={{ clipPath: BADGE_CLIP }}
                aria-hidden='true'
              >
                {badge(index)}
              </span>
              <KatexSpan text={option.label} className='tr-wff' />
              {isAnswer && (
                <span className='tr-answer'>
                  <CheckIcon className='tr-check' />
                  answer
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {/* A punctuated sentence, not a row of chips: it has to read even
          where the stylesheet hasn't arrived (Malik, 2026-09-07). */}
      <p className='tr-legend' key={`legend-${draw}`}>
        {bindings.form === 'english' ? (
          <>
            {adjectives.map(([key, adjective], i) => (
              <span key={key}>
                {i > 0 && ', '}${key} <b>{adjective}</b>
              </span>
            ))}
            {', so '}
            {varLetters.map(([key, letter], i) => (
              <span key={key}>
                {i > 0 && ' and '}${key} <b>{letter}</b>
              </span>
            ))}
            .
          </>
        ) : (
          <>
            {'The abstract prompt this time: '}
            {varLetters.map(([key, letter], i) => (
              <span key={key}>
                {i > 0 && ', '}${key} <b>{letter}</b>
              </span>
            ))}
            .
          </>
        )}
      </p>
      </div>
      <GemButton
        containerClassName='tr-roll-wrap'
        className='tr-roll'
        onClick={() => {
          setSeed(seedNow());
          setDraw((d) => d + 1);
        }}
      >
        Draw another
      </GemButton>
    </figure>
  );
}
