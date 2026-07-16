'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { DEFAULT_WASH_PARAMS, WatercolorWash } from './watercolorWash';
import { WatercolorTuner } from './watercolorTuner';

// Temporary: the wash tuner is a dev-only aid for dialling in
// DEFAULT_WASH_PARAMS; it never renders in production builds.
const SHOW_WASH_TUNER = process.env.NODE_ENV === 'development';

interface StartScreenProps {
  onStartQuiz: () => void;
  surfaceColor?: string;
  countColor?: string;
  foregroundColor?: string;
  /** Set identity, e.g. 'Set J' — becomes the mono eyebrow. */
  setName?: string;
  /**
   * Subset title, e.g. 'Modal Translations: Quantified'. The part before
   * ':' is the headline; the part after joins the eyebrow as the variant.
   */
  title?: string;
  /** One-sentence description of what this set practices. */
  description?: string;
}

export function StartScreen({
  onStartQuiz,
  surfaceColor = '#431407',
  countColor = '#fdba74',
  foregroundColor = '#ffffff',
  setName,
  title,
  description = 'Test your knowledge on this chapter and see how much you already know!',
}: StartScreenProps) {
  // Fresh composition every visit: DEFAULT_WASH_PARAMS carries a fixed seed
  // (so the tuner's sliders don't reshuffle the layout mid-tuning), but each
  // mount rolls its own.
  const [washParams, setWashParams] = useState(() => ({
    ...DEFAULT_WASH_PARAMS,
    seed: Math.floor(Math.random() * 1e9),
  }));
  // 'Modal Translations: Quantified' → headline + variant. The eyebrow
  // (SET J · QUANTIFIED) carries the set letter and variant in the same
  // mono voice as the quiz's own codes; the headline is the drill itself.
  const [headline, variant] = (title ?? '').split(': ');
  const eyebrow = [setName, variant].filter(Boolean).join(' · ');
  return (
    <>
      {SHOW_WASH_TUNER && (
        <WatercolorTuner params={washParams} onChange={setWashParams} />
      )}
      <section
        className='motion-enter max-w-7xl rounded-xl w-full h-screen text-center p-0 text-white flex-col flex justify-center m-auto relative isolate overflow-hidden'
        style={{ backgroundColor: surfaceColor, color: foregroundColor }}
      >
        <WatercolorWash
          color={surfaceColor}
          params={washParams}
          className='pointer-events-none absolute inset-0 -z-10'
        />
        {eyebrow && (
          <div className='mb-5 font-mono text-xs uppercase tracking-[0.3em] opacity-80'>
            {eyebrow}
          </div>
        )}
        <h1 className='mb-4 px-6 text-4xl md:text-5xl font-bold font-stretch'>
          {headline || 'Ready for a challenge?'}
        </h1>
        <p className='mb-8 max-w-lg px-6 mx-auto text-lg font-light'>
          {description}
        </p>
        <div
          className='font-mono text-sm uppercase tracking-[0.2em] font-semibold'
          style={{ color: countColor }}
        >
          10 questions
        </div>
        <Button
          size={'lg'}
          className='w-fit cursor-pointer self-center mt-5 font-stretch active:scale-[0.97]'
          onClick={onStartQuiz}
        >
          Start Quiz
        </Button>

        {
          // Temporary filler to make the text content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
