'use client';

import { useSyncExternalStore, type CSSProperties } from 'react';
import Link from 'next/link';
import { spriteClip } from '@/lib/pixel';
import { captureAnalyticsEvent } from '@/lib/analytics';
import { lastDrillSnapshot, subscribeLastDrill } from '@/lib/lastDrill';

/**
 * "Continue where you left off" — the decided guide state (landing lab
 * LP7, Malik 2026-08-17). Renders NOTHING until a last-drill key exists
 * in localStorage (written by the quiz shell during an active run), so
 * a first-time visitor sees a clean catalogue. localStorage is a client
 * fact that legitimately differs from the server's render, which is
 * exactly what useSyncExternalStore is for (the currentYear.tsx
 * pattern): null for SSR/hydration, the stored drill right after.
 */

const CARD_CLIP: CSSProperties = { clipPath: spriteClip(0, 16) };

export function ResumeBanner() {
  const drill = useSyncExternalStore(
    subscribeLastDrill,
    lastDrillSnapshot,
    () => null
  );

  if (!drill) return null;

  return (
    <div className='lx-resumew'>
      {/* The clip lives on the INNER span, not the link: a clipped
          element paints no outline, and the focus rectangle belongs to
          the link itself (the drill rows' construction). */}
      <Link
        href={drill.path}
        className='lx-resume'
        onClick={() => {
          void captureAnalyticsEvent('landing_resume_click', {
            quiz_path: drill.path,
            source: 'landing_resume',
          });
        }}
      >
        <span className='lx-resume-in' style={CARD_CLIP}>
          <span className='lx-resume-eyebrow'>Continue where you left off</span>
          <span className='lx-resume-row'>
            <span className='lx-resume-title'>{drill.title}</span>
            {drill.points !== null && (
              <span className='lx-resume-pts'>
                you were at {drill.points} points
              </span>
            )}
            <svg
              className='lx-chev'
              viewBox='0 0 24 24'
              fill='currentColor'
              aria-hidden='true'
            >
              <polygon points='5 7 7 7 7 8 8 8 8 9 9 9 9 10 10 10 10 11 11 11 11 12 13 12 13 11 14 11 14 10 15 10 15 9 16 9 16 8 17 8 17 7 19 7 19 8 20 8 20 10 19 10 19 11 18 11 18 12 17 12 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17 11 17 11 16 10 16 10 15 9 15 9 14 8 14 8 13 7 13 7 12 6 12 6 11 5 11 5 10 4 10 4 8 5 8 5 7' />
            </svg>
          </span>
        </span>
      </Link>
    </div>
  );
}
