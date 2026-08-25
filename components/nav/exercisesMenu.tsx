'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { NavigationMenuLink } from '@/components/ui/navigation-menu';
import { NewBadge } from '@/components/newBadge';
import { gemClip } from '@/lib/pixel';
import {
  topics,
  topicIsNew,
  topicIsMultiSet,
  drillTitle,
} from '@/content/topics';

/**
 * The desktop exercises panel — master–detail (nav lab, decided
 * 2026-08-14, D8): a six-topic rail, one topic's drills at a time with
 * the catalog's descriptions as scent.
 *
 * INTERACTION MODEL REPLACED 2026-08-22 (Malik, from user testing).
 * The lab's § 1 pointer model — hover switches the panel after a 90 ms
 * intent delay — failed older testers: reaching a drill means crossing
 * the rail diagonally, and the rows crossed en route swap the panel out
 * from under the hand. Measured at 1280px, the straight line from the
 * DEFAULT topic (Syllogistic, y 79–126) to its own first drill
 * (x 336, y 198–289) leaves the rail at y≈203 — having crossed
 * Propositional's full height and entered Modal. Every topic crosses
 * one to three siblings; there is no safe corridor, because the drill
 * list starts ~120px below the rail's top. The path to the target
 * destroyed the target.
 *
 * The 90 ms guard made it worse, not better: a TIME-based intent filter
 * assumes a fast ballistic pointer, so it fires hardest for the slow,
 * correcting hands it was written to protect. Geometry (a safe triangle)
 * was considered and rejected — invisible, probabilistic, untestable.
 * Selection is now DECLARED, not inferred: the pointer only paints, the
 * click commits. Same action, same result, at every hand speed.
 *
 * That model is the ARIA TABS pattern, so the rail wears it honestly —
 * tablist/tab/tabpanel with aria-selected and aria-controls. This also
 * retires a real bug: the rows carried `role='listitem'` on a <button>,
 * which OVERRODE the button role, so screen readers announced a list
 * item and the activation affordance was already gone for them.
 * Keyboard keeps AUTOMATIC activation (arrows switch instantly, the
 * lab's § 6 map) — you cannot arrow through a list by accident, so the
 * fix is pointer-only and surgical.
 *
 * Colour roles from the lab's § 4, RE-GROUNDED TO SET L (Malik,
 * 2026-08-17 — the landing decision extends to the chrome): the
 * scheme's TYPE (plum) carries every small run of text — the coloured
 * accent never carries small text (the 1.4.3 fix) — and the active
 * fill is the Set L mint, so selection previews the scheme ground
 * exactly as the cream fill previewed the cream. Derived tiers
 * (BODY/MUTED/META) re-derived on white with measured ratios. Hover
 * and active fills wear the gem silhouette — the pixel grammar on
 * interaction states, not just badges (Malik, 2026-08-14).
 */
const TYPE = '#3F0167'; // Set L plum · 14.88:1 on white, 12.67:1 on the fill
const ACTIVE = '#CFF6DD'; // the active fill = the scheme ground (mint)
const HOVER = '#F3F0F6'; // white mixed 6% toward plum
const HAIR = '#E4DBEA'; // white mixed 14% toward plum — decorative
const BODY = '#693988'; // 8.26:1 on white
const MUTED = '#715790'; // 6.06:1 on white
const TAG = '#715790'; // 6.06:1 on white
const META = '#BD00AD'; // Set L's own accent · 5.57:1 on white

const GEM = gemClip();

export function ExercisesMenu() {
  const [activeId, setActiveId] = useState(topics[0]!.id);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const drillsRef = useRef<HTMLUListElement>(null);
  const uid = useId();
  const active = topics.find((t) => t.id === activeId) ?? topics[0]!;

  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = `${uid}-panel`;

  const focusTopic = (id: string) => {
    const el = railRef.current?.querySelector(`[data-topic="${id}"]`);
    if (el instanceof HTMLElement) el.focus();
  };

  return (
    <div className='flex bg-white font-sans'>
      <div
        ref={railRef}
        className='flex w-[280px] shrink-0 flex-col gap-0.5 border-r p-4'
        style={{ borderColor: HAIR }}
        role='tablist'
        aria-orientation='vertical'
        aria-label='Logic topics'
      >
        {topics.map((topic, i) => {
          const isActive = topic.id === activeId;
          const fill = isActive
            ? ACTIVE
            : hoverId === topic.id
              ? HOVER
              : undefined;
          return (
            <button
              key={topic.id}
              type='button'
              role='tab'
              id={tabId(topic.id)}
              aria-selected={isActive}
              aria-controls={panelId}
              /* Roving tabindex: Tab from the trigger lands on the
                 selected topic, Tab again enters the drill list. */
              tabIndex={isActive ? 0 : -1}
              /* A clip-path removes outline AND ring (pixel-ui.md), so
                 focus is an INSET band — it paints inside the box, which
                 the gem silhouette only trims at the corners. Plum on
                 either fill clears 1.4.11 comfortably (12.67:1 on mint). */
              /* motion-button: the 120ms fills, and the 0.97 press scale.
                 Now that the click COMMITS rather than merely confirming a
                 hover, the press needs to be felt — the drill links below
                 have carried it all along. */
              className='motion-button flex w-full items-center gap-2 px-4 py-3 text-left text-[15px] font-semibold focus-visible:shadow-[inset_0_0_0_2px_#3F0167] focus-visible:outline-none'
              style={{
                clipPath: GEM,
                background: fill,
                color: isActive || hoverId === topic.id ? TYPE : MUTED,
              }}
              onMouseEnter={() => setHoverId(topic.id)}
              onMouseLeave={() =>
                setHoverId((h) => (h === topic.id ? null : h))
              }
              /* Keyboard keeps automatic activation; the POINTER does
                 not — hovering above no longer touches activeId. */
              onFocus={() => setActiveId(topic.id)}
              onClick={() => setActiveId(topic.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  focusTopic(
                    topics[
                      (i + (e.key === 'ArrowDown' ? 1 : -1) + topics.length) %
                        topics.length
                    ]!.id
                  );
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  focusTopic(topics[0]!.id);
                } else if (e.key === 'End') {
                  e.preventDefault();
                  focusTopic(topics[topics.length - 1]!.id);
                } else if (e.key === 'ArrowRight') {
                  // the lab's § 6 map: → enters the drill list
                  e.preventDefault();
                  drillsRef.current?.querySelector('a')?.focus();
                }
              }}
              data-topic={topic.id}
            >
              <span>{topic.name}</span>
              {/* The gem badge, not the lab's 6px dot (Malik, 2026-08-22).
                  The dot asked the row to carry meaning in colour and size
                  alone — the sr-only text was the whole 1.4.1 defence, and
                  sighted users got a mark with no reading. The badge SAYS
                  "NEW", in the same silhouette the drill rows wear, so the
                  scent bubbling up from a drill looks like the thing it
                  came from. The sr-only tail keeps the topic-level reading
                  ("NEW exercises inside") distinct from a drill's own
                  badge, which means that one drill is new. */}
              {topicIsNew(topic) && (
                <span className='inline-flex shrink-0 items-center'>
                  <NewBadge />
                  <span className='sr-only'> exercises inside</span>
                </span>
              )}
              <span className='grow' />
              {/* Persistent signifier (2026-08-22): the chevron used to
                  appear only on the selected row, so an unselected row
                  advertised nothing. Now that the click is REQUIRED, every
                  row has to say it opens something — and → maps to where
                  the detail appears. Decorative; aria-selected carries the
                  state for assistive tech. */}
              <span
                aria-hidden='true'
                className='text-[13px]'
                style={{
                  color: TAG,
                  opacity: isActive ? 1 : 0.45,
                }}
              >
                ›
              </span>
            </button>
          );
        })}
      </div>

      <div
        className='min-h-[420px] flex-1 p-8'
        role='tabpanel'
        id={panelId}
        aria-labelledby={tabId(active.id)}
      >
        <div
          className='mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]'
          style={{ color: META }}
        >
          {active.sets}
        </div>
        <h3
          className='font-stretch text-2xl font-extrabold leading-tight'
          style={{ color: TYPE }}
        >
          {active.name}
        </h3>
        <p
          className='mb-6 mt-1 max-w-[60ch] text-[15px] leading-normal'
          style={{ color: BODY }}
        >
          {active.blurb}
        </p>
        <ul
          ref={drillsRef}
          className='flex max-w-[640px] flex-col gap-1'
          onKeyDown={(e) => {
            // ← returns to the owning topic (the lab's § 6 map). Tab still
            // walks the drills; this is the way back out of them.
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              focusTopic(active.id);
            }
          }}
        >
          {active.drills.map((drill) => (
            <li key={drill.quizPath}>
              <NavigationMenuLink asChild>
                <Link
                  href={drill.quizPath}
                  className='motion-button block px-3.5 py-3 hover:bg-[#F3F0F6] focus-visible:shadow-[inset_0_0_0_2px_#3F0167] focus-visible:outline-none'
                  style={{ clipPath: GEM }}
                >
                  <span className='flex items-center gap-2.5'>
                    <span
                      className='text-[15px] font-semibold'
                      style={{ color: TYPE }}
                    >
                      {drillTitle(drill)}
                    </span>
                    {drill.isNew && <NewBadge />}
                    {topicIsMultiSet(active) && (
                      <span
                        className='ml-auto font-mono text-[11px] font-semibold tracking-[0.04em]'
                        style={{ color: TAG }}
                      >
                        {drill.chapter}
                      </span>
                    )}
                  </span>
                  <span
                    className='mt-0.5 block max-w-[58ch] text-sm leading-normal'
                    style={{ color: BODY }}
                  >
                    {drill.description}
                  </span>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
