'use client';

import { useId, useMemo, useState } from 'react';
import {
  MATERIAL_SHAPES,
  gridToPath,
  outlineToPath,
  rasterise,
} from '@/lib/materialShapes';

/**
 * Material's shape library under a resolution dial (Malik, 2026-09-07:
 * "a react rendering instead of a static image, and a dial to let us
 * pixelise it"). The section's sentence is that a shape you must redraw
 * arrives at your resolution; the dial lets the reader pick the
 * resolution and watch all 35 shapes arrive at it. Smooth is Material's
 * own geometry (lib/materialShapes.ts); the four grids are the same
 * outlines rasterised at 2, 4, 8 and 16 px cells over a 96 px shape.
 * 4 px is the grid the app draws on and the default. Diamond is tinted
 * as the one that became the chip.
 *
 * The control is a slider (Malik, 2026-09-08: "replace the buttons with
 * a slider"), Smooth on the left, coarser to the right, so pixelising is
 * a drag. It snaps to the five stops; aria-valuetext reads the stop's
 * label rather than its index; the tick under the thumb shows the same.
 *
 * Marker: <div data-island="material-shapes">…feed fallback…</div>
 * The fallback is the static figure (material.png), so RSS keeps a
 * picture where the island can't run.
 */
const SIZE = 96;

const STEPS = [
  {
    key: 'smooth',
    label: 'Smooth',
    cell: 0,
    note: "Material's shapes, from its own definitions.",
  },
  { key: '2', label: '2 px', cell: 2, note: '2 px cells, 48 across.' },
  {
    key: '4',
    label: '4 px',
    cell: 4,
    note: '4 px cells, 24 across: the grid the app draws on.',
  },
  { key: '8', label: '8 px', cell: 8, note: '8 px cells, 12 across.' },
  { key: '16', label: '16 px', cell: 16, note: '16 px cells, 6 across.' },
] as const;

const PICKED = 'Diamond';

function pathsFor(cell: number): string[] {
  return MATERIAL_SHAPES.map((s) =>
    cell === 0
      ? outlineToPath(s.outline, SIZE)
      : gridToPath(rasterise(s.outline, SIZE / cell), cell)
  );
}

export function MaterialShapesDial() {
  const [i, setI] = useState(2);
  const rangeId = useId();
  const step = STEPS[i]!;
  // One set of paths per step, computed the first time a step is shown.
  const paths = useMemo(() => pathsFor(step.cell), [step.cell]);

  return (
    <figure className='not-prose ms-wrap'>
      <div className='ms-dial'>
        <label className='pr-lab' htmlFor={rangeId}>
          Cell size
        </label>
        <div className='ms-slider'>
          <input
            id={rangeId}
            type='range'
            className='pg-range ms-range'
            min={0}
            max={STEPS.length - 1}
            step={1}
            value={i}
            aria-valuetext={step.label}
            onChange={(e) => setI(Number(e.target.value))}
          />
          <div className='ms-ticks' aria-hidden='true'>
            {STEPS.map((s, index) => (
              <span
                key={s.key}
                className={`ms-tick${index === i ? ' is-on' : ''}`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <ul className='ms-grid'>
        {MATERIAL_SHAPES.map((s, index) => (
          <li
            key={s.name}
            className={`ms-tile${s.name === PICKED ? ' is-picked' : ''}`}
          >
            <svg
              className='ms-shape'
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              width={SIZE}
              height={SIZE}
              shapeRendering={step.cell ? 'crispEdges' : 'geometricPrecision'}
              aria-hidden='true'
            >
              <path d={paths[index]} fill='currentColor' />
            </svg>
            <span className='ms-name'>{s.name}</span>
            {s.name === PICKED && (
              <b className='sd-verdict sd-picked ms-verdict'>picked</b>
            )}
          </li>
        ))}
      </ul>

      <figcaption className='sd-note' aria-live='polite'>
        {step.note}
      </figcaption>
    </figure>
  );
}
