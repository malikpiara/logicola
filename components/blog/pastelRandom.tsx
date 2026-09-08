'use client';

import { useState } from 'react';
import { DiceIcon } from '@/components/quiz/pixelIcons';

/**
 * "Pastel Random", reimplemented (Malik, 2026-08-28; merged with the
 * named schemes 2026-09-01). One artefact now plays the whole Color
 * dialog: it opens on six of the named pairs, built from the decompiled
 * recipe (FF/level channel combinations, level byte CD/B9/91 by depth,
 * band = complement of the ground because the original produced it with
 * InvertRect), and the die rolls it into Random mode — case 10 of the
 * colour routine at 0x433900 in LCEXE_2008, ported line for line from
 * logicola-ghidra/notes/09-colour-system.md. One channel stays at FF,
 * two random pulls come off the others (the pull range is the depth
 * dial), and the panel takes a complementary arrangement of the same
 * bytes. The named chip brings the reference schemes back, so a rolled
 * page can always return to the exhibit the prose describes.
 *
 * The initial named state is deterministic, so server and client render
 * identical markup with no seeded PRNG needed.
 *
 *   <div data-island="pastel-random"></div>
 */

type Rgb = [number, number, number];
type Rnd = (n: number) => number;

const SPREADS = { 1: 0x2d, 2: 0x5a, 3: 0xb4 } as const;
type Depth = keyof typeof SPREADS;

/** The named side of the dialog: every colour is an FF/level channel
 *  combination — 1 pins a channel at FF, 0 drops it to the level byte. */
const LEVELS: Record<Depth, number> = { 1: 0xcd, 2: 0xb9, 3: 0x91 };
const HUES = {
  Aqua: [0, 1, 1],
  Rose: [1, 0, 0],
  Blue: [0, 0, 1],
  Cream: [1, 1, 0],
  Lime: [0, 1, 0],
  Magenta: [1, 0, 1],
} as const;
const NAMED: [keyof typeof HUES, keyof typeof HUES][] = [
  ['Aqua', 'Rose'],
  ['Rose', 'Aqua'],
  ['Blue', 'Cream'],
  ['Cream', 'Blue'],
  ['Lime', 'Magenta'],
  ['Magenta', 'Lime'],
];

type Screen = { ground: Rgb; panel: Rgb; band: Rgb; name?: string };

const tint = (hue: keyof typeof HUES, depth: Depth): Rgb =>
  HUES[hue].map((on) => (on ? 255 : LEVELS[depth])) as Rgb;

const namedSix = (depth: Depth): Screen[] =>
  NAMED.map(([g, p]) => {
    const ground = tint(g, depth);
    return {
      ground,
      panel: tint(p, depth),
      band: ground.map((v) => 255 - v) as Rgb,
      name: `${g}/${p}`,
    };
  });

function roll(depth: Depth, rnd: Rnd): Screen {
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
  '#' +
  c
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

const DEPTHS: { depth: Depth; label: string }[] = [
  { depth: 1, label: 'Pastel' },
  { depth: 2, label: 'Moderate' },
  { depth: 3, label: 'Deep' },
];

const sixRolls = (depth: Depth): Screen[] =>
  Array.from({ length: 6 }, () =>
    roll(depth, (n) => Math.floor(Math.random() * n))
  );

export function PastelRandom() {
  const [depth, setDepth] = useState<Depth>(1);
  // 'named' shows the reference schemes (deterministic at any depth);
  // rolling switches to Random and stays there until the named chip.
  const [rolls, setRolls] = useState<Screen[] | null>(null);
  // The die lands on a new face per roll — always a *different* face, so
  // a reroll never looks like nothing happened. No movement: a die
  // reports by face. Fixed initial face keeps server and client markup
  // identical.
  const [face, setFace] = useState<1 | 2 | 3 | 4 | 5 | 6>(5);

  const reroll = (d: Depth) => {
    setRolls(sixRolls(d));
    setFace((prev) => {
      const others = ([1, 2, 3, 4, 5, 6] as const).filter((f) => f !== prev);
      return others[Math.floor(Math.random() * others.length)]!;
    });
  };

  const screens = rolls ?? namedSix(depth);

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
                if (rolls) reroll(d.depth);
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className='pr-row'>
          <span className='pr-lab'>Scheme</span>
          <button
            type='button'
            className='pr-chip is-wide'
            aria-pressed={!rolls}
            onClick={() => setRolls(null)}
          >
            Named pairs
          </button>
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
        {screens.map((s, i) => (
          <figure key={i}>
            <div
              className='screen2008'
              style={
                {
                  '--g': hex(s.ground),
                  '--p': hex(s.panel),
                  '--b': hex(s.band),
                  /* A 35ms sweep across the grid, so a change reads as
                     one wave rather than six simultaneous repaints. */
                  '--roll-delay': `${i * 35}ms`,
                } as React.CSSProperties
              }
            >
              <span className='panel' />
              <span className='band' />
            </div>
            <figcaption>
              {s.name && (
                <>
                  {s.name}
                  <br />
                </>
              )}
              {hex(s.ground)} · {hex(s.panel)}
            </figcaption>
          </figure>
        ))}
      </div>
    </figure>
  );
}
