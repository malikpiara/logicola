'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { DEFAULT_WASH_PARAMS, WatercolorWash } from './watercolorWash';
import { WatercolorTuner } from './watercolorTuner';
import { DEFAULT_QUIZ_MODE, scoreMode, type QuizMode } from './quizMode';
import {
  DEFAULT_LEVEL,
  MAX_LEVEL,
  MIN_LEVEL,
  SCORING_PROFILES,
  type ScoringProfile,
} from '@/lib/scoring';

/**
 * Width of the native range thumb, in px. A thumb's centre travels from
 * THUMB/2 to (track − THUMB/2), so a readout pinned to a naive `left: pct%`
 * drifts by up to half a thumb at the ends. This is the standard correction.
 * Matches the browser default; if the thumb is ever restyled, update this.
 */
const THUMB_PX = 16;

/**
 * Character width of the widest level readout — "Level 9 · −18 per miss" (22).
 * The readout is `font-mono`, so `ch` is an exact unit here, not an estimate.
 * Used to clamp the readout inside the track at levels 1 and 9.
 */
const READOUT_CH = 22;

// Temporary: the wash tuner is a dev-only aid for dialling in
// DEFAULT_WASH_PARAMS; it never renders in production builds.
const SHOW_WASH_TUNER = process.env.NODE_ENV === 'development';

interface StartScreenProps {
  onStartQuiz: (mode?: QuizMode) => void;
  /**
   * PROTOTYPE. Opt a set into the restored 2008 scoring run. Off by default:
   * a cold visitor from search can't meaningfully choose between "10
   * questions" and "100 points at level 7", so the scored run is a
   * step-up rather than a peer option.
   */
  offerScoredRun?: boolean;
  /**
   * This set's economy, from its own original program. Required for honest copy: only
   * Set R forfeits a missed problem's points, so the forfeit line must not
   * appear on Set A or Q, and the reward differs (5 / 7 / 8).
   */
  scoringProfile?: ScoringProfile;
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
  offerScoredRun = false,
  scoringProfile = SCORING_PROFILES.R!,
  surfaceColor = '#431407',
  countColor = '#fdba74',
  foregroundColor = '#ffffff',
  setName,
  title,
  description = 'Test your knowledge on this chapter and see how much you already know!',
}: StartScreenProps) {
  // The level dial only appears once the scored run is chosen — it needs a
  // sentence of explanation, and that sentence would dominate the screen for
  // the majority who just want to try a few questions.
  const [showLevel, setShowLevel] = useState(false);
  const [level, setLevel] = useState(DEFAULT_LEVEL);

  // Where the thumb's centre actually sits, so the readout can track it.
  const levelFraction = (level - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL);
  const thumbCentre = `calc(${levelFraction * 100}% + ${
    (0.5 - levelFraction) * THUMB_PX
  }px)`;
  // ...but a centred readout would hang off the card at the extremes (measured:
  // 44px past the left edge at level 1, 48px past the right at level 9). The
  // readout is monospace, so its width is exactly predictable: the longest
  // string it can hold is READOUT_CH characters, and clamping the centre to
  // half that keeps it inside the track at both ends without hardcoding px.
  const thumbOffset = `clamp(${READOUT_CH / 2}ch, ${thumbCentre}, calc(100% - ${
    READOUT_CH / 2
  }ch))`;
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
        {/*
          `font-normal`, not `font-light`. At text-lg on a saturated surface a
          300 weight thins the stems enough that this reads as decoration, and
          it is the line that says what the drill actually is. The hierarchy is
          unaffected — the headline above is `font-bold`.
        */}
        <p className='mb-8 max-w-lg px-6 mx-auto text-lg font-normal'>
          {description}
        </p>
        <div
          className='font-mono text-sm uppercase tracking-[0.2em] font-semibold'
          style={{ color: countColor }}
        >
          {/*
            Phase 2 (7): the level belongs to the dial, which now states it
            live. Repeating it here made "level 7" appear three times on one
            screen while appearing zero times at the thumb, where the eye is.
          */}
          {showLevel ? 'To 100 points' : '10 questions'}
        </div>
        {/*
          Phase 1 (3): configure BEFORE committing. The dial precedes the CTA
          because you can't sensibly press "Start Scored Run" until you've set
          the stakes it starts.
        */}
        {/*
          Phase 3 (8): the dial appeared instantly while every other surface
          in the quiz eases in. `motion-enter` is the app's existing utility,
          so this also inherits the prefers-reduced-motion opt-out in
          globals.css rather than bolting on an arbitrary transition that
          block wouldn't catch.
        */}
        {showLevel && (
          <div className='motion-enter mx-auto mt-6 w-full max-w-md px-6'>
            {/*
              Phase 2 (5): was three sentences — the densest text on the
              screen, explaining a control instead of being one. The stakes
              moved into the live readout below, where they answer the
              question at the moment it's asked. This line keeps only the
              genuinely counterintuitive part: the dial changes the cost,
              not the content.

              Keep any <em> away from the END of this label. Trailing text
              after a closing tag loses its leading space in Next's SWC JSX
              transform ("points andforfeit"), and a {' '} patch is not
              durable — Prettier collapses it back the moment the line fits.
              Ending on the <em> sidesteps the trim entirely.
            */}
            <label
              htmlFor='scoring-level'
              className='block text-sm font-light opacity-80'
            >
              Changes what a mistake costs, <em>not</em> which problems you get
            </label>

            {/*
              Phase 1 (2): the readout tracks the thumb, so the value is where
              the eye already is. The `calc` offsets by half a thumb-width
              (THUMB_PX) because a range thumb's centre travels from
              THUMB/2 to (100% - THUMB/2), not 0% to 100%.
            */}
            <div className='relative mt-5 h-5'>
              <div
                className='absolute -translate-x-1/2 whitespace-nowrap text-center font-mono text-xs font-semibold'
                style={{ left: thumbOffset, color: countColor }}
              >
                Level {level} · &minus;{2 * level} per miss
              </div>
            </div>

            <input
              id='scoring-level'
              type='range'
              min={MIN_LEVEL}
              max={MAX_LEVEL}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              // Phase 1 (4): without this a screen reader announces a bare
              // "7", which carries none of the meaning the dial exists for.
              aria-valuetext={
                scoringProfile.forfeitOnMiss
                  ? `Level ${level}: a miss costs ${2 * level} points and forfeits that problem's ${scoringProfile.pointsPerCorrect}`
                  : `Level ${level}: a miss costs ${2 * level} points`
              }
              // Phase 1 (1): `accent-color` paints the SELECTED portion. It was
              // white-on-tan, so the chosen range read as empty and the unchosen
              // range read as filled — higher stakes looked like less. Painting
              // it with the set's own foreground makes more look like more.
              style={{ accentColor: countColor }}
              className='w-full cursor-pointer'
            />
            {/*
              Phase 2 (6): was opacity-60, which measured 4.22:1 against the
              wash — under the 4.5:1 WCAG AA floor for text this size.
            */}
            <div className='flex justify-between font-mono text-xs opacity-80'>
              <span>{MIN_LEVEL} forgiving</span>
              <span>{MAX_LEVEL} brutal</span>
            </div>

            {/*
              The forfeit rule survives the cut above, but as a static line:
              it's the one part of the mechanic that does NOT vary with the
              dial, so it would be noise inside a live readout. It's also the
              genuinely surprising half — a miss costs 2xlevel AND the points.

              Set R alone forfeits (`r0` in its original program). Sets A/C/J/L/N and Q pay
              out in full however many times you miss, so this line would be a
              lie there.
            */}
            {scoringProfile.forfeitOnMiss && (
              <p className='mt-3 text-xs font-light opacity-80'>
                A miss also forfeits that problem&rsquo;s{' '}
                {scoringProfile.pointsPerCorrect} points.
              </p>
            )}
          </div>
        )}

        {/*
          Logo-matched CTA. Two changes from the stock white pill:
          1. Shape — a shallow `corner-shape` notch (rounded-[9px] sets the
             depth), rhyming with the Logicola cartridge's own corners.
          2. Fill — adaptive "ink": the button borrows the set's own
             foreground as its background and the surface as its label, so
             it inverts. A fixed white pill nearly vanishes on the pale
             sets (C/J/L/N/R); this clears contrast on every surface.
        */}
        <Button
          size={'lg'}
          className='corner-notch w-full max-w-[15rem] cursor-pointer self-center mt-5 rounded-[9px] font-stretch hover:opacity-90 active:scale-[0.97]'
          style={{ backgroundColor: foregroundColor, color: surfaceColor }}
          onClick={() =>
            onStartQuiz(showLevel ? scoreMode(level) : DEFAULT_QUIZ_MODE)
          }
        >
          {showLevel ? 'Start Scored Run' : 'Start Quiz'}
        </Button>

        {offerScoredRun && !showLevel && (
          <button
            type='button'
            onClick={() => setShowLevel(true)}
            className='mx-auto mt-5 cursor-pointer text-sm underline underline-offset-4 opacity-70 hover:opacity-100'
          >
            Or take a scored run, the way the original worked →
          </button>
        )}

        {showLevel && (
          <button
            type='button'
            onClick={() => setShowLevel(false)}
            className='mx-auto mt-4 cursor-pointer text-sm underline underline-offset-4 opacity-60 hover:opacity-100'
          >
            ← Back to the 10-question quiz
          </button>
        )}

        {
          // Temporary filler to make the text content be displayed a couple of pixels above.
          <div className='h-40' />
        }
      </section>
    </>
  );
}
