'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';

/**
 * The damage-bar lab, in the post (Malik, 2026-08-26). It was a screenshot
 * of `docs/damage-bar-lab.html`, which is the wrong medium for it twice
 * over: these are animations, and the entire point of the lab was that six
 * of them existed at once so they could be judged against each other. A
 * still frame shows neither.
 *
 * The six directions, their cadences and their timings are ported from that
 * lab verbatim — same off-pulse counts, same 340/350/400/500ms, same quart
 * easing, same reduced-motion behaviour (instant drop, no flicker). If the
 * lab and this disagree, this is what's wrong.
 *
 *   <div data-island="damage-bar"></div>
 */

const MISS_COST = 0.12;
const HIT_GAIN = 0.08;
const START = 0.64;

interface Direction {
  id: string;
  name: string;
  tag: string;
  spec: string;
  refs: string;
  won?: boolean;
}

const DIRECTIONS: Direction[] = [
  {
    id: 'A',
    name: 'Hit flicker',
    tag: 'Mega Man i-frames',
    spec: '2 off-pulses · 340ms hard cuts → drop 500ms quart',
    refs: "Mega Man i-frames · Zelda — Link's hit flicker · Castlevania",
    won: true,
  },
  {
    id: 'B',
    name: 'Ghost drain',
    tag: 'Street Fighter II',
    spec: 'snap drop · ghost holds 350ms → drains 400ms quart',
    refs: 'Street Fighter II · Guilty Gear · Dark Souls boss bars',
  },
  {
    id: 'C',
    name: 'Knockback',
    tag: 'screen shake',
    spec: 'shake 260ms ±5px · 1 ink pulse 200ms · drop 500ms quart',
    refs: "Nuclear Throne · Celeste · DOOM's damage kick · Undertale",
  },
  {
    id: 'D',
    name: 'Ember tip',
    tag: 'localised',
    spec: 'fill snaps · chunk blinks ×2 280ms → burns 250ms',
    refs: 'Halo shield break · Dead Space RIG spine · Metroid Prime',
  },
  {
    id: 'E',
    name: 'Track pulse',
    tag: 'the quiet one',
    spec: 'track 32% → 12% ink · 300ms decay · drop 500ms quart',
    refs: 'Punch-Out!! screen flash · the FPS damage vignette, on a bar',
  },
  {
    id: 'G',
    name: 'Ink flicker',
    tag: 'A × C hybrid',
    spec: '2 ink pulses · 340ms hard cuts → drop 500ms quart',
    refs: 'NES palette-swap hits · Contra & Metal Slug · Cuphead',
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Reduced motion as an external store rather than state-in-an-effect: the
 * preference lives in the browser, not in React, and useSyncExternalStore
 * is how you read something that can change underneath you. The server
 * snapshot is `false` so SSR renders the motion-on markup and the client
 * corrects on hydration — the only thing it gates is animation.
 */
const RM = '(prefers-reduced-motion: reduce)';
const subscribeRM = (cb: () => void) => {
  const m = matchMedia(RM);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};

export function DamageBar() {
  const [dir, setDir] = useState(0);
  const [pct, setPct] = useState(START);
  const [busy, setBusy] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeRM,
    () => matchMedia(RM).matches,
    () => false
  );
  const [chunk, setChunk] = useState<{ left: number; width: number; burning: boolean } | null>(null);

  const fillRef = useRef<HTMLSpanElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const d = DIRECTIONS[dir]!;

  const miss = useCallback(async () => {
    if (busy) return;
    const from = pct;
    const to = Math.max(0, +(pct - MISS_COST).toFixed(4));
    const fill = fillRef.current;
    const ghost = ghostRef.current;
    const bar = barRef.current;
    const wrap = wrapRef.current;
    if (!fill || !bar || !wrap) return;

    // Reduced motion: the penalty still lands, it just doesn't perform.
    if (reduced) {
      setPct(to);
      return;
    }
    setBusy(true);

    switch (d.id) {
      case 'A':
        fill.classList.add('db-flicker');
        await wait(340);
        fill.classList.remove('db-flicker');
        setPct(to);
        await wait(500);
        break;
      case 'B':
        if (ghost) {
          ghost.style.transition = 'none';
          ghost.style.width = from * 100 + '%';
        }
        fill.style.transition = 'none';
        setPct(to);
        await wait(20);
        fill.style.transition = '';
        await wait(350);
        if (ghost) {
          ghost.style.transition = 'width 400ms var(--db-quart)';
          ghost.style.width = to * 100 + '%';
          await wait(400);
          ghost.style.transition = 'none';
        }
        break;
      case 'C':
        wrap.classList.add('db-shake');
        fill.classList.add('db-pulse');
        setPct(to);
        await wait(500);
        wrap.classList.remove('db-shake');
        fill.classList.remove('db-pulse');
        break;
      case 'D':
        setChunk({ left: to, width: from - to, burning: false });
        fill.style.transition = 'none';
        setPct(to);
        await wait(20);
        fill.style.transition = '';
        await wait(280);
        setChunk((c) => (c ? { ...c, burning: true } : c));
        await wait(260);
        setChunk(null);
        break;
      case 'E':
        bar.classList.add('db-track');
        setPct(to);
        await wait(500);
        bar.classList.remove('db-track');
        break;
      default:
        fill.classList.add('db-inkflicker');
        await wait(340);
        fill.classList.remove('db-inkflicker');
        setPct(to);
        await wait(500);
    }
    setBusy(false);
  }, [busy, pct, reduced, d.id]);

  const hit = () => !busy && setPct((p) => Math.min(1, +(p + HIT_GAIN).toFixed(4)));
  const reset = () => !busy && setPct(START);

  return (
    <figure className='not-prose db-wrap'>
      <div className='db-tabs' role='radiogroup' aria-label='Damage direction'>
        {DIRECTIONS.map((x, i) => (
          <button
            key={x.id}
            type='button'
            role='radio'
            aria-checked={i === dir}
            className='db-tab'
            onClick={() => setDir(i)}
          >
            <b>{x.id}</b> {x.name}
            {x.won && <i aria-label=' (shipped)'>✓</i>}
          </button>
        ))}
      </div>

      <div className='db-stage' ref={wrapRef}>
        <span className='db-bar' ref={barRef}>
          <span className='db-ghost' ref={ghostRef} aria-hidden='true' />
          <span
            className='db-fill'
            ref={fillRef}
            style={{ width: pct * 100 + '%' }}
          />
          {chunk && (
            <span
              className={`db-chunk${chunk.burning ? ' is-burning' : ' db-blink'}`}
              style={{
                left: chunk.left * 100 + '%',
                width: chunk.burning ? 0 : chunk.width * 100 + '%',
                opacity: chunk.burning ? 0 : 1,
              }}
              aria-hidden='true'
            />
          )}
        </span>
        <output className='db-pts'>{Math.round(pct * 100)} pts</output>
      </div>

      <div className='db-actions'>
        <button type='button' className='db-btn is-miss' onClick={miss} disabled={busy}>
          Miss −12
        </button>
        <button type='button' className='db-btn' onClick={hit} disabled={busy}>
          Correct +8
        </button>
        <button type='button' className='db-btn' onClick={reset} disabled={busy}>
          Reset
        </button>
      </div>

      <figcaption className='db-note' aria-live='polite'>
        <b>
          {d.name} <span>{d.tag}</span>
        </b>
        {d.spec}
        <em>{d.refs}</em>
        {reduced && (
          <span className='db-rm'>
            Reduced motion is on, so the penalty lands instantly — every
            direction degrades to the same honest drop.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
