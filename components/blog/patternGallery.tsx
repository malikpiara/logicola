'use client';

import { useEffect, useMemo, useState } from 'react';
import { PRESETS } from '@/components/blog/colourStudio';
import { LAB_PATTERNS } from '@/components/blog/labFields';
import { PixelTip } from '@/components/ui/pixelTip';

/**
 * The pattern gallery (Malik, 2026-09-02) — the seventeen prototyped
 * fields drawn live by their real generators, replacing a screenshot
 * of them. One pattern at a time holds the whole article width, chosen
 * from a strip of live thumbnails; the lab's note for it reads as a
 * caption. The section's argument is that a field under content must
 * be judged at every crop and size, so the stage's two controls are
 * exactly those: Scale runs from the question screen to the cover,
 * Crop pans the window across the body — a motif pattern cuts or
 * centres by accident, a field stays the same texture.
 *
 * Motion follows the studio's rule (2026-08-29): a click is discrete,
 * so a new pattern or set crossfades over the outgoing layer for one
 * tween; the sliders are continuous, so they move the viewBox with no
 * transition at all. Bodies are generated per set and memoised.
 *
 *   <div data-island="pattern-gallery"></div>
 */

/** The question-screen viewport, in lattice units; the stage is 2:1. */
const STAGE_W = 400;
const STAGE_H = 200;
const ZOOM_MAX = 3;
/** Body with pan room left over at the widest view. */
const BODY_W = STAGE_W * ZOOM_MAX + 400;
const BODY_H = STAGE_H * ZOOM_MAX + 200;
const THUMB = 120;
const SEED = 2008;

type Layer = { key: string; body: string; surface: string };

export function PatternGallery() {
  const [setKey, setSetKey] = useState<(typeof PRESETS)[number]['key']>('L');
  const [selected, setSelected] = useState('pxcamo');
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState(0.2);

  const set = PRESETS.find((p) => p.key === setKey) ?? PRESETS[3]!;
  const palette = useMemo(
    () => ({ ink: set.ink, accent: set.accent }),
    [set]
  );
  const pattern =
    LAB_PATTERNS.find((p) => p.id === selected) ?? LAB_PATTERNS[0]!;
  const stageBody = useMemo(
    () => pattern.body(BODY_W, BODY_H, palette, 1, SEED),
    [pattern, palette]
  );
  // Thumbnails at the phone scale (0.6), so a 120-unit square shows
  // enough of each structure to be told apart.
  const thumbs = useMemo(
    () => LAB_PATTERNS.map((p) => p.body(THUMB, THUMB, palette, 0.6, SEED)),
    [palette]
  );

  // Stage crossfade: when the pattern or the set changes, the outgoing
  // layer is kept for one tween while the new one fades in over it —
  // the studio's own recipe. Derive-during-render adopts the new layer
  // and parks the old one; the timeout below retires it.
  const stageKey = `${pattern.id}-${set.key}`;
  const [shown, setShown] = useState<Layer>({
    key: stageKey,
    body: stageBody,
    surface: set.surface,
  });
  const [prev, setPrev] = useState<Layer | null>(null);
  if (shown.key !== stageKey) {
    setPrev(shown);
    setShown({ key: stageKey, body: stageBody, surface: set.surface });
  }
  useEffect(() => {
    if (!prev) return;
    const t = setTimeout(() => setPrev(null), 240);
    return () => clearTimeout(t);
  }, [prev]);

  const vw = STAGE_W * zoom;
  const vh = STAGE_H * zoom;
  const px = (BODY_W - vw) * crop;
  const py = (BODY_H - vh) * crop;
  const viewBox = `${px.toFixed(1)} ${py.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`;

  // Arrow keys walk the strip like a radio group; Tab lands on the
  // selected thumb only (roving tabindex).
  const step = (d: number, group: HTMLElement) => {
    const i = LAB_PATTERNS.findIndex((p) => p.id === selected);
    const n = (i + d + LAB_PATTERNS.length) % LAB_PATTERNS.length;
    setSelected(LAB_PATTERNS[n]!.id);
    (group.children[n] as HTMLElement | undefined)?.focus();
  };

  return (
    <figure className='not-prose pg-wrap'>
      <div className='pr-rows'>
        <div className='pr-row' role='radiogroup' aria-label='Set'>
          <span className='pr-lab'>Set</span>
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type='button'
              role='radio'
              aria-checked={setKey === p.key}
              className='pr-chip'
              style={
                setKey === p.key
                  ? undefined
                  : { background: p.surface, color: p.ink }
              }
              onClick={() => setSetKey(p.key)}
            >
              {p.key}
            </button>
          ))}
        </div>
        <div className='pr-row'>
          <label className='pr-lab' htmlFor='pg-scale'>
            Scale
          </label>
          <input
            id='pg-scale'
            type='range'
            className='pg-range'
            min={1}
            max={ZOOM_MAX}
            step={0.05}
            value={zoom}
            aria-label='Scale, from the question screen to the cover'
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>
        <div className='pr-row'>
          <label className='pr-lab' htmlFor='pg-crop'>
            Crop
          </label>
          <input
            id='pg-crop'
            type='range'
            className='pg-range'
            min={0}
            max={1}
            step={0.005}
            value={crop}
            aria-label='Crop position'
            onChange={(e) => setCrop(Number(e.target.value))}
          />
        </div>
      </div>

      <div className='pg-stage'>
        {prev && (
          <svg
            key={`prev-${prev.key}`}
            className='pg-layer is-prev'
            viewBox={viewBox}
            style={{ background: prev.surface }}
            aria-hidden
            dangerouslySetInnerHTML={{ __html: prev.body }}
          />
        )}
        <svg
          key={shown.key}
          className='pg-layer'
          viewBox={viewBox}
          style={{ background: shown.surface }}
          role='img'
          aria-label={pattern.name}
          dangerouslySetInnerHTML={{ __html: shown.body }}
        />
        <span
          className={`pg-shipped${pattern.shipped ? ' is-on' : ''}`}
          aria-hidden={!pattern.shipped}
        >
          picked
        </span>
      </div>
      <p className='pg-caption'>
        <strong>{pattern.name}</strong>
        {pattern.note}
      </p>

      <div
        className='pg-thumbs'
        role='radiogroup'
        aria-label='Pattern'
        onKeyDown={(e) => {
          const d =
            e.key === 'ArrowRight' || e.key === 'ArrowDown'
              ? 1
              : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                ? -1
                : 0;
          if (!d) return;
          e.preventDefault();
          step(d, e.currentTarget);
        }}
      >
        {LAB_PATTERNS.map((p, i) => (
          <PixelTip key={p.id} tip={p.name} hoverOnly>
            <button
              type='button'
              role='radio'
              aria-checked={p.id === selected}
              aria-label={p.name}
              tabIndex={p.id === selected ? 0 : -1}
              className={`pg-thumb${p.shipped ? ' is-shipped' : ''}`}
              onClick={() => setSelected(p.id)}
            >
              <svg
                viewBox={`0 0 ${THUMB} ${THUMB}`}
                style={{ background: set.surface }}
                aria-hidden
                dangerouslySetInnerHTML={{ __html: thumbs[i]! }}
              />
            </button>
          </PixelTip>
        ))}
      </div>
    </figure>
  );
}
