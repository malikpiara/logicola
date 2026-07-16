'use client';

import { useState } from 'react';
import { DEFAULT_WASH_PARAMS, type WashParams } from './watercolorWash';

/**
 * TEMPORARY dev-only tuning panel for the watercolor wash — dials for the
 * `WashParams` knobs, a composition reroll, and a copy-as-JSON button so the
 * chosen values can be baked into `DEFAULT_WASH_PARAMS`.
 *
 * Mounted from the start screen only when NODE_ENV === 'development'; delete
 * this file (and its mount) once the wash is tuned.
 */

const SLIDERS: Array<{
  key: keyof WashParams;
  label: string;
  min: number;
  max: number;
  step: number;
}> = [
  { key: 'intensity', label: 'Intensity', min: 0.2, max: 2, step: 0.05 },
  { key: 'contrast', label: 'Contrast', min: 0.02, max: 0.4, step: 0.01 },
  { key: 'hueDrift', label: 'Hue drift', min: 0, max: 60, step: 1 },
  { key: 'bloomCount', label: 'Blooms', min: 0, max: 4, step: 1 },
  { key: 'petalCount', label: 'Petals', min: 3, max: 9, step: 1 },
  { key: 'bloomScale', label: 'Bloom size', min: 0.12, max: 0.5, step: 0.01 },
  { key: 'petalWidth', label: 'Petal width', min: 0.25, max: 0.9, step: 0.01 },
  { key: 'bloomBlur', label: 'Bloom blur', min: 2, max: 45, step: 1 },
  { key: 'fieldBlur', label: 'Haze blur', min: 10, max: 75, step: 1 },
  { key: 'displacement', label: 'Edge wobble', min: 0, max: 40, step: 1 },
  { key: 'grain', label: 'Grain', min: 0, max: 0.15, step: 0.01 },
];

export function WatercolorTuner({
  params,
  onChange,
}: {
  params: WashParams;
  onChange: (params: WashParams) => void;
}) {
  const [copied, setCopied] = useState(false);

  const set = (key: keyof WashParams, value: number) =>
    onChange({ ...params, [key]: value });

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(params, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const buttonClassName =
    'rounded-md border border-gray-200 bg-white px-2 py-1 hover:bg-gray-50';

  return (
    <div className='fixed right-4 top-24 z-[70] w-64 rounded-xl border border-gray-200 bg-white/95 p-3 text-xs text-gray-800 shadow-lg backdrop-blur select-none'>
      <div className='mb-2 flex items-baseline justify-between'>
        <span className='font-semibold'>Wash tuner</span>
        <span className='text-gray-400'>dev only</span>
      </div>
      <div className='space-y-1.5'>
        {SLIDERS.map(({ key, label, min, max, step }) => (
          <label key={key} className='block'>
            <div className='mb-0.5 flex justify-between'>
              <span>{label}</span>
              <span className='tabular-nums text-gray-500'>
                {step < 1 ? params[key].toFixed(2) : params[key]}
              </span>
            </div>
            <input
              type='range'
              className='w-full accent-fuchsia-600'
              min={min}
              max={max}
              step={step}
              value={params[key]}
              onChange={(e) => set(key, Number(e.target.value))}
            />
          </label>
        ))}
      </div>
      <div className='mt-3 flex gap-1.5'>
        <button
          type='button'
          className={buttonClassName}
          onClick={() =>
            onChange({ ...params, seed: Math.floor(Math.random() * 1e9) })
          }
        >
          New composition
        </button>
        <button
          type='button'
          className={buttonClassName}
          onClick={() =>
            onChange({ ...DEFAULT_WASH_PARAMS, seed: params.seed })
          }
        >
          Reset
        </button>
        <button type='button' className={buttonClassName} onClick={copy}>
          {copied ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
    </div>
  );
}
