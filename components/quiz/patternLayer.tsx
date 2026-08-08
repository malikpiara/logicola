'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { SubSet } from '@/content/types';
import {
  clearRectFor,
  patternSvg,
  quiltAccentPool,
  type QuiltTreatment,
  type QuizPatternKind,
} from '@/lib/patterns';
import { QUIZ_SURFACE_POOL } from './quizColors';

/**
 * The decorative pattern layer, in the set's own colours. Which pattern:
 * **Camo · classic** for the easy sets, **Camo · giant** for the hard
 * ones (Malik, 2026-08-07) — see patternKindForSubSet. Placement per
 * docs/pixel-ui.md § Pattern placement:
 *
 *   - `panel` (start/end screens): the pattern frames a clean rounded
 *     panel; the hole is cleared whole-pixel, so the field stair-steps
 *     around its arcs. It never sits under text.
 *   - `footer` (question screens, desktop): a fixed 112px strip at the
 *     card's foot — the card reserves 152px of bottom padding so the
 *     pattern reads as an underline, not an underlay. Mobile question
 *     screens are CLEAN: simply don't render this component there.
 *
 * The scatter RESHUFFLES: each mount rolls a fresh seed (Malik,
 * 2026-08-08 — the lab's Reshuffle, made ambient; the old watercolor
 * wash rolled per visit the same way). Safe against hydration because
 * the SVG only ever renders after mount — the geometry needs the
 * measured box anyway. Below 640px the field scales to 0.6 — pieces
 * tuned for the ~860px desktop card read boulder-sized at 390px.
 */

const MOBILE_WIDTH = 640;
const MOBILE_SCALE = 0.6;

/**
 * Easy sets wear Camo · classic, hard sets Camo · giant. "Hard" is the
 * catalogue's own word: the subset's slug or title says so (Sets A and C
 * ship Easy/Hard pairs). Subsets outside an Easy/Hard pair — modal
 * Quantified, Set R — count as easy until Malik says otherwise; flip
 * them here if the judgement lands differently.
 */
export function patternKindForSubSet(
  subSet: Pick<SubSet, 'slugs' | 'title'>
): QuizPatternKind {
  const hard =
    subSet.slugs.includes('hard') || /:\s*hard\b/i.test(subSet.title ?? '');
  return hard ? 'camo-giant' : 'camo';
}

export interface PatternLayerProps {
  kind: QuizPatternKind;
  surface: string;
  ink: string;
  treatment: QuiltTreatment;
  className?: string;
}

export function PatternLayer({
  kind,
  surface,
  ink,
  treatment,
  className,
}: PatternLayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  // Fresh composition every visit; stable across re-renders and resizes
  // within one, so pane drags reflow the same scatter.
  const [seed] = useState(() => Math.floor(Math.random() * 0x100000000));
  const pool = useMemo(
    () => quiltAccentPool(surface, ink, QUIZ_SURFACE_POOL),
    [surface, ink]
  );

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frame = 0;
    const draw = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      const mobile = w < MOBILE_WIDTH;
      setSvg(
        patternSvg(kind, {
          w,
          h,
          ink,
          pool,
          scale: mobile ? MOBILE_SCALE : 1,
          seed,
          clear: clearRectFor(treatment, w, h, mobile),
        })
      );
    };

    draw();
    // Coalesce resize bursts (pane drags) to one regeneration per frame.
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    });
    observer.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ink, kind, pool, seed, treatment]);

  return (
    <div
      ref={hostRef}
      aria-hidden='true'
      className={className}
      // Our own generated markup, nothing user-authored.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
