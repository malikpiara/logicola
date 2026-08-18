'use client';

import { useState } from 'react';
import { GemButton } from './gemButton';
import { PatternLayer } from './patternLayer';
import type { QuizPatternKind } from '@/lib/patterns';
import { haptic } from '@/lib/haptics';
import {
  DEFAULT_QUIZ_MODE,
  SHIPPED_LEVEL,
  scoreMode,
  type QuizMode,
} from './quizMode';
import {
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

interface StartScreenProps {
  onStartQuiz: (mode?: QuizMode) => void;
  /**
   * The set runs the restored 2008 scoring run — the release's only
   * surfaced mode (Malik, 2026-08-06). True for every set whose original
   * economy has been derived (`canScore`); the rare set without one falls
   * back to the dormant 10-question run.
   */
  offerScoredRun?: boolean;
  /**
   * This set's economy, from its own DSL. Required for honest copy: only
   * Set R forfeits a missed problem's points, so the forfeit line must not
   * appear on Set A or Q, and the reward differs (5 / 7 / 8).
   */
  scoringProfile?: ScoringProfile;
  surfaceColor?: string;
  countColor?: string;
  foregroundColor?: string;
  /** Set identity, e.g. 'Set J' — becomes the mono eyebrow. */
  setName?: string;
  /** Which pattern dresses the card — camo classic (easy) or giant (hard). */
  patternKind?: QuizPatternKind;
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
  patternKind = 'camo',
  title,
  description = 'Test your knowledge on this chapter and see how much you already know!',
}: StartScreenProps) {
  // The dial and its explanation are HIDDEN for now (Malik, 2026-08-09):
  // the level system stays — every run still scores at SHIPPED_LEVEL —
  // but the start screen drops to title, promise and one button. The
  // dial was the densest thing on the screen and it asked a question
  // before anyone had played a single problem. Flip this to
  // `offerScoredRun` to bring the control back exactly as it was.
  // Typed, so the dial's JSX below stays live code rather than being
  // narrowed to unreachable — it is meant to come back.
  const showLevel: boolean = false;
  const [level, setLevel] = useState(SHIPPED_LEVEL);

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
  // 'Modal Translations: Quantified' → headline + variant. The eyebrow
  // (SET J · QUANTIFIED) carries the set letter and variant in the same
  // mono voice as the quiz's own codes; the headline is the drill itself.
  const [headline, variant] = (title ?? '').split(': ');
  const eyebrow = [setName, variant].filter(Boolean).join(' · ');
  return (
    <>
      <section
        className='motion-enter max-w-7xl rounded-none lg:rounded-xl w-full h-dvh text-center p-0 text-white flex-col flex justify-center m-auto relative isolate overflow-hidden'
        style={{ backgroundColor: surfaceColor, color: foregroundColor }}
      >
        {/* The pattern frames a clean panel — it never sits under text
            (docs/pixel-ui.md § Pattern placement). The scatter
            reshuffles every visit. */}
        <PatternLayer
          kind={patternKind}
          surface={surfaceColor}
          ink={foregroundColor}
          treatment='panel'
          className='pointer-events-none absolute inset-0 -z-10'
        />
        {/* 0.12em, the top of the 5–12% range caps want — 0.3em let the
            words disassemble (design audit finding 5). */}
        {eyebrow && (
          <div className='mb-5 font-mono text-xs uppercase tracking-[0.12em] opacity-80'>
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
          className='font-mono text-sm uppercase tracking-[0.1em] font-semibold'
          style={{ color: countColor }}
        >
          {/*
            Phase 2 (7): the level belongs to the dial, which now states it
            live. Repeating it here made "level 7" appear three times on one
            screen while appearing zero times at the thumb, where the eye is.
          */}
          {/* Keyed to the MODE, not to the dial's visibility: hiding the
              control must not make the promise lie. */}
          {offerScoredRun ? 'To 100 points' : '10 questions'}
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

              Set R alone forfeits (`r0` in its DSL). Sets A/C/J/L/N and Q pay
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
        {/*
          Gem silhouette (working default from the Primary button dial),
          adaptive-ink fill: the set's own foreground as the background,
          its surface as the label, so it inverts and clears contrast on
          every set's screen.

          With one mode there is one label. "Start Scored Run" earned its
          name when it stood against a peer option; alone, plain "Start
          Quiz" reads better (open question resolved toward the lab's own
          CTA copy).
        */}
        <GemButton
          containerClassName='mt-5 w-full max-w-[15rem] self-center'
          className='h-11 hover:opacity-90'
          style={{ backgroundColor: foregroundColor, color: surfaceColor }}
          // Also the mode, not the dial: with the control hidden the run
          // still starts scored, at whatever `level` holds.
          onClick={() => {
            haptic('impact');
            onStartQuiz(offerScoredRun ? scoreMode(level) : DEFAULT_QUIZ_MODE);
          }}
        >
          Start Quiz
        </GemButton>
      </section>
    </>
  );
}
