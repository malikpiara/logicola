'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
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
 * the catalog's descriptions as scent. Interaction model from the lab's
 * § 1: pointer switches after a 90 ms intent delay so a twitch across
 * the rail doesn't thrash the panel; click, focus and arrow keys switch
 * instantly.
 *
 * Colour roles from the lab's § 4 white-panel mode: the scheme's TYPE
 * (#02302C) carries every small run of text — green never carries small
 * text (the 1.4.3 fix) — and the active fill is the brand cream, so
 * selection previews the scheme ground. Derived tiers (BODY/MUTED/META)
 * come from the lab's ensure-contrast loop; all pass 4.5:1 on white.
 * Hover and active fills wear the gem silhouette — the pixel grammar on
 * interaction states, not just badges (Malik, 2026-08-14).
 */
const TYPE = '#02302C';
const CREAM = '#EDEDE3';
const HOVER = '#F6F6F1';
const HAIR = '#E1E6E6';
const BODY = '#416461';
const MUTED = '#5B7876';
const TAG = '#5B7976';
const META = '#058844';

const GEM = gemClip();

export function ExercisesMenu() {
  const [activeId, setActiveId] = useState(topics[0]!.id);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const active = topics.find((t) => t.id === activeId) ?? topics[0]!;

  const armHover = (id: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveId(id), 90);
  };
  const disarmHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  return (
    <div className='flex bg-white font-sans'>
      <div
        className='flex w-[280px] shrink-0 flex-col gap-0.5 border-r p-4'
        style={{ borderColor: HAIR }}
        role='list'
        aria-label='Logic topics'
      >
        {topics.map((topic, i) => {
          const isActive = topic.id === activeId;
          return (
            <button
              key={topic.id}
              type='button'
              role='listitem'
              aria-current={isActive}
              className='flex w-full items-center gap-2 px-4 py-3 text-left text-[15px] font-semibold'
              style={{
                clipPath: GEM,
                background: isActive ? CREAM : undefined,
                color: isActive ? TYPE : MUTED,
              }}
              onMouseEnter={(e) => {
                armHover(topic.id);
                e.currentTarget.style.background = isActive ? CREAM : HOVER;
                e.currentTarget.style.color = TYPE;
              }}
              onMouseLeave={(e) => {
                disarmHover();
                e.currentTarget.style.background = isActive ? CREAM : '';
                e.currentTarget.style.color = isActive ? TYPE : MUTED;
              }}
              onFocus={() => setActiveId(topic.id)}
              onClick={() => setActiveId(topic.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault();
                  const next =
                    topics[
                      (i + (e.key === 'ArrowDown' ? 1 : -1) + topics.length) %
                        topics.length
                    ]!;
                  const el = e.currentTarget.parentElement?.querySelector(
                    `[data-topic="${next.id}"]`
                  );
                  if (el instanceof HTMLElement) el.focus();
                }
              }}
              data-topic={topic.id}
            >
              <span>{topic.name}</span>
              {topicIsNew(topic) && (
                <span
                  className='h-1.5 w-1.5 shrink-0 rounded-full bg-[#BD00AD]'
                  title='New exercises inside'
                >
                  <span className='sr-only'>— new exercises inside</span>
                </span>
              )}
              <span className='grow' />
              <span
                aria-hidden='true'
                className='text-[13px]'
                style={{
                  color: TAG,
                  opacity: isActive ? 1 : 0,
                }}
              >
                ›
              </span>
            </button>
          );
        })}
      </div>

      <div className='min-h-[420px] flex-1 p-8'>
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
        <ul className='flex max-w-[640px] flex-col gap-1'>
          {active.drills.map((drill) => (
            <li key={drill.quizPath}>
              <NavigationMenuLink asChild>
                <Link
                  href={drill.quizPath}
                  className='motion-button block px-3.5 py-3 hover:bg-[#F6F6F1]'
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
