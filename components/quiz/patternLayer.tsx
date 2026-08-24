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
 * How much bigger the quiz wears its pattern than the engine's own tuning
 * (Malik, 2026-08-23 — "they look better when the scale is bigger").
 *
 * THIS IS THE PATTERN LAB'S SCALE SLIDER. `docs/pattern-lab.html` renders
 * the field as `(px ? 1.7 : 1) * state.scale * mobileScale`, and the app
 * now renders it as `PIXEL_FIELD_MACRO * QUIZ_PATTERN_SCALE * (mobile ?
 * 0.6 : 1)`. Same three factors, same order — so whatever number the lab's
 * slider lands on IS this constant, with no conversion.
 *
 * It lives here rather than in `PIXEL_FIELD_MACRO` on purpose. That
 * constant is the engine's, and the engine has a second customer: the
 * footer band in components/footer.tsx, drawn at its own scale 0.35 from
 * the footer lab's recipe, plus the exported brand covers. Moving the
 * engine's number to make the quiz screens chunkier would silently
 * re-cut artwork that was judged at the old pitch.
 *
 * 1.25 was picked off a same-seed comparison at 1.00 / 1.15 / 1.25 / 1.40
 * on both treatments. The ceiling is the FOOTER band, not the start
 * screen: the band is a fixed 112px strip, so past ~1.4 it stops being a
 * texture and becomes three or four separate shapes with gaps between
 * them. On the start screen alone 1.4 still reads.
 */
const QUIZ_PATTERN_SCALE = 1.25;

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
          scale: (mobile ? MOBILE_SCALE : 1) * QUIZ_PATTERN_SCALE,
          seed,
          clear: clearRectFor(treatment, w, h, mobile),
        })
      );
    };

    draw();
    // Trailing debounce, not per-frame (2026-08-24, plans/001): a pane
    // drag resizes this host continuously, and regenerating + re-parsing
    // hundreds of rects per frame for an aria-hidden decoration was a
    // measurable slice of the drag's jank. One redraw, 150ms after the
    // last resize, covers drag-release and window resizes alike.
    const observer = new ResizeObserver(() => {
      clearTimeout(frame);
      frame = window.setTimeout(draw, 150);
    });
    observer.observe(host);
    return () => {
      clearTimeout(frame);
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
