'use client';

import { useMemo, useState } from 'react';
import Option from '@/components/option';
import { stimulationOf, contrastRatio } from '@/lib/stimulation';

/**
 * The Colour studio, in the post (Malik, 2026-08-26). It was a screenshot of
 * the studio panel in `docs/pattern-lab.html`, which showed the instrument
 * and not the thing the instrument is for. What the lab actually puts on
 * screen is a live quiz window that re-renders as the pair changes, with the
 * metrics moving underneath it — so that is what this is.
 *
 * The numbers are computed by `lib/stimulation.ts`, the ported ColorMoods
 * model, and `lib/stimulation.test.ts` pins that port against the two scores
 * docs/color-system.md recorded for the sets Malik built by hand. A
 * figure that computes its own numbers has to be checkable; these are.
 *
 * Read-only on purpose: this answers "what are the seven?". Changing a pair
 * and watching the metrics move is the Colour studio island's job, further
 * down the post.
 *
 *   <div data-island="set-palettes"></div>
 */

const SETS = [
  { key: 'A', name: 'Syllogistic', surface: '#FFABC6', fg: '#4A1040', accent: '#674900' },
  { key: 'C', name: 'Propositional', surface: '#E7F099', fg: '#02302C', accent: '#BD00AD' },
  { key: 'J', name: 'Modal', surface: '#E6ACF4', fg: '#1C3601', accent: '#674900' },
  { key: 'L', name: 'Deontic', surface: '#CFF6DD', fg: '#3F0167', accent: '#BD00AD' },
  { key: 'N', name: 'Belief', surface: '#9EDAFF', fg: '#4A1040', accent: '#8D0381' },
  { key: 'Q', name: 'Definitions', surface: '#D9CCF9', fg: '#3E1060', accent: '#745400' },
  { key: 'R', name: 'Fallacies', surface: '#E4BDF7', fg: '#751100', accent: '#824616' },
] as const;

export function SetPalettes() {
  const [i, setI] = useState(3);
  const set = SETS[i]!;
  const ink = set.fg;

  const m = useMemo(() => stimulationOf(set.surface, ink), [set.surface, ink]);
  const ratio = contrastRatio(set.surface, ink);
  const readable = ratio >= 4.5;
  // No pass/fail chip on stimulation on purpose: the project's own two
  // colour docs disagree about the ceiling (0.45–0.58 vs 0.45–0.65, flagged
  // in color-handoff.md and never reconciled), and Set L lands at 0.583 —
  // right between them. A figure shouldn't cast a verdict its source can't.

  return (
    <figure className='not-prose sp-wrap'>
      <div className='sp-tabs' role='radiogroup' aria-label='Exercise set'>
        {SETS.map((s, index) => (
          <button
            key={s.key}
            type='button'
            role='radio'
            aria-checked={index === i}
            className='sp-tab'
            onClick={() => setI(index)}
            style={{
              background: index === i ? s.fg : s.surface,
              color: index === i ? s.surface : s.fg,
            }}
          >
            <b>{s.key}</b>
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* The quiz window the studio previews — the real Option component, in
          whatever pair the controls currently describe. */}
      <div
        className='quiz-immersive sp-card'
        style={
          {
            '--quiz-surface': set.surface,
            '--quiz-fg': ink,
            '--quiz-accent': set.accent,
            background: set.surface,
            color: ink,
          } as React.CSSProperties
        }
      >
        <div className='sp-bar' aria-hidden='true'>
          <span style={{ background: set.accent, width: '62%' }} />
        </div>
        <p className='sp-prompt'>
          Set {set.key} · {set.name}
        </p>
        <div className='sp-list'>
          <Option
            immersive
            index={1}
            showIndex
            label='The first option, untouched'
            isSelected={false}
            isCorrect={false}
            showSolution={false}
            onClick={() => {}}
          />
          <Option
            immersive
            index={2}
            showIndex
            label='The one you picked'
            isSelected
            isCorrect
            showSolution={false}
            onClick={() => {}}
          />
        </div>
      </div>

      <dl className='sp-meta' aria-live='polite'>
        <div>
          <dt>σ intensity</dt>
          <dd>{m.sigma.toFixed(2)}</dd>
        </div>
        <div>
          <dt>ΔL</dt>
          <dd>{m.dL.toFixed(2)}</dd>
        </div>
        <div>
          <dt>hue Δ</dt>
          <dd>{Math.round(m.theta * 180)}°</dd>
        </div>
        <div>
          <dt>stimulation</dt>
          <dd>{m.score.toFixed(3)}</dd>
        </div>
        <div>
          <dt>vibration</dt>
          <dd>{m.vibr.toFixed(2)}</dd>
        </div>
        <div>
          <dt>ink on surface</dt>
          <dd className={readable ? 'is-ok' : 'is-off'}>
            {ratio.toFixed(2)}:1<i>{readable ? 'AA' : 'fails AA'}</i>
          </dd>
        </div>
      </dl>
    </figure>
  );
}
