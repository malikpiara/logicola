'use client';

import { useState } from 'react';
import { DiceIcon } from '@/components/quiz/pixelIcons';

/**
 * "Pastel Random", reimplemented (Malik, 2026-08-28). This is the 2008
 * program's Random colour scheme — case 10 of the colour routine at
 * 0x433900 in LCEXE_2008 — ported line for line from the decompilation
 * recorded in logicola-ghidra/notes/09-colour-system.md. One channel
 * stays at FF, two random pulls come off the others (the pull range is
 * the depth dial), and the panel takes a complementary arrangement of
 * the same bytes. The band is not chosen here, and was not chosen in
 * 2008 either: the original painted the strip in the ground colour and
 * called InvertRect, so each band below is the exact complement of its
 * rolled ground.
 *
 * The initial six rolls come from a seeded PRNG so server and client
 * render identical markup; the buttons roll for real.
 *
 *   <div data-island="pastel-random"></div>
 */

type Rgb = [number, number, number];
type Rnd = (n: number) => number;

const SPREADS = { 1: 0x2d, 2: 0x5a, 3: 0xb4 } as const;
type Depth = keyof typeof SPREADS;

function roll(depth: Depth, rnd: Rnd) {
  const spread = SPREADS[depth];
  let a = rnd(spread);
  let b = rnd(0x40);
  if (rnd(2) === 0) a += spread >> 1;
  else b += spread >> 1;
  // The original truncates to a byte before complementing, so at Deep
  // the wrap occasionally throws a bright channel. That quirk ships too.
  const A = 255 - (a & 255);
  const B = 255 - (b & 255);
  const axis = rnd(3);
  let ground: Rgb;
  let panel: Rgb;
  if (axis === 0) {
    ground = [A, B, 255];
    panel = b < a ? [255, B, A] : [A, 255, B];
  } else if (axis === 1) {
    ground = [A, 255, B];
    panel = b < a ? [255, A, B] : [A, B, 255];
  } else {
    ground = [255, A, B];
    panel = b < a ? [A, 255, B] : [B, A, 255];
  }
  const band: Rgb = [255 - ground[0]!, 255 - ground[1]!, 255 - ground[2]!];
  return { ground, panel, band };
}

const hex = (c: Rgb) =>
  '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();

/** Deterministic PRNG for the SSR-safe initial rolls. */
function mulberry32(seed: number): Rnd {
  let t = seed;
  return (n) => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return Math.floor((((r ^ (r >>> 14)) >>> 0) / 4294967296) * n);
  };
}

const DEPTHS: { depth: Depth; label: string }[] = [
  { depth: 1, label: 'Pastel' },
  { depth: 2, label: 'Moderate' },
  { depth: 3, label: 'Deep' },
];

const sixRolls = (depth: Depth, rnd: Rnd) =>
  Array.from({ length: 6 }, () => roll(depth, rnd));

export function PastelRandom() {
  const [depth, setDepth] = useState<Depth>(1);
  const [rolls, setRolls] = useState(() => sixRolls(1, mulberry32(2008)));
  // The die lands on a new face per roll — always a *different* face, so
  // a reroll never looks like nothing happened. No movement: a die
  // reports by face. Fixed initial face keeps server and client markup
  // identical.
  const [face, setFace] = useState<1 | 2 | 3 | 4 | 5 | 6>(5);

  const reroll = (d: Depth) => {
    setRolls(sixRolls(d, (n) => Math.floor(Math.random() * n)));
    setFace((prev) => {
      const others = ([1, 2, 3, 4, 5, 6] as const).filter((f) => f !== prev);
      return others[Math.floor(Math.random() * others.length)]!;
    });
  };

  return (
    <figure className='not-prose pr-wrap'>
      {/* Same control language as the Colour studio below: labelled rows,
          chips with a pressed state (Malik, 2026-08-28). */}
      <div className='pr-rows'>
        <div className='pr-row' role='radiogroup' aria-label='Depth'>
          <span className='pr-lab'>Depth</span>
          {DEPTHS.map((d) => (
            <button
              key={d.depth}
              type='button'
              role='radio'
              aria-checked={depth === d.depth}
              className='pr-chip'
              onClick={() => {
                setDepth(d.depth);
                reroll(d.depth);
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className='pr-row'>
          <span className='pr-lab'>Random</span>
          <button
            type='button'
            className='pr-chip is-wide'
            onClick={() => reroll(depth)}
          >
            <DiceIcon className='pr-die' face={face} />
            Roll again
          </button>
        </div>
      </div>
      <div className='post-swatches'>
        {rolls.map((r, i) => (
          <figure key={i}>
            <div
              className='screen2008'
              style={
                {
                  '--g': hex(r.ground),
                  '--p': hex(r.panel),
                  '--b': hex(r.band),
                  /* A 35ms sweep across the grid, so a roll reads as one
                     wave rather than six simultaneous repaints. */
                  '--roll-delay': `${i * 35}ms`,
                } as React.CSSProperties
              }
            >
              <span className='panel' />
              <span className='band' />
            </div>
            <figcaption>
              {hex(r.ground)} · {hex(r.panel)}
            </figcaption>
          </figure>
        ))}
      </div>
    </figure>
  );
}
