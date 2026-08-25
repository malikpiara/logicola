'use client';

import Link from 'next/link';
import { captureAnalyticsEvent } from '@/lib/analytics';
import { NewBadge } from '@/components/newBadge';

/**
 * One drill row inside a topic card. Client component only for the
 * PostHog capture — the row itself is a plain link. The gem hover-fill
 * lives on a ::before layer (.lx-drill in globals.css): the clip stays
 * on the pseudo-element so the row's own box is unclipped and
 * :focus-visible can draw a complete rectangle — a clipped element
 * paints no outline (the pixel-ui ring rule).
 */

interface DrillLinkProps {
  href: string;
  /** visible label — topic adjective off (content/topics.ts drillTitle) */
  shortTitle: string;
  /** accessible name — the full catalogue title (WCAG 2.4.4: link text
   *  must survive out of context; "Translations: Easy" alone doesn't) */
  fullTitle: string;
  topicId: string;
  /** 1-based position across the whole page, for funnel reading */
  position: number;
  /** per-drill set tag — multi-set topics only (D6: the card header
   *  carries the set everywhere else) */
  setTag?: string;
  /** the topic accent the tag wears; every accent ≥ 5.57:1 on white */
  accentColor?: string;
  isNew?: boolean;
}

// The shipped pixel chevron, polygon verbatim from
// components/ui/accordion.tsx ('angle-down-solid') — rotated -90° by
// .lx-chev into a "go" mark.
function Chevron() {
  return (
    <svg
      className='lx-chev'
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
    >
      <polygon points='5 7 7 7 7 8 8 8 8 9 9 9 9 10 10 10 10 11 11 11 11 12 13 12 13 11 14 11 14 10 15 10 15 9 16 9 16 8 17 8 17 7 19 7 19 8 20 8 20 10 19 10 19 11 18 11 18 12 17 12 17 13 16 13 16 14 15 14 15 15 14 15 14 16 13 16 13 17 11 17 11 16 10 16 10 15 9 15 9 14 8 14 8 13 7 13 7 12 6 12 6 11 5 11 5 10 4 10 4 8 5 8 5 7' />
    </svg>
  );
}

export function DrillLink({
  href,
  shortTitle,
  fullTitle,
  topicId,
  position,
  setTag,
  accentColor,
  isNew,
}: DrillLinkProps) {
  return (
    <li className='lx-drillw'>
      <Link
        href={href}
        className='lx-drill'
        aria-label={fullTitle}
        onClick={() => {
          void captureAnalyticsEvent('landing_drill_click', {
            topic_id: topicId,
            quiz_path: href,
            position,
            source: 'landing_catalog',
          });
        }}
      >
        <span className='lx-drill-t'>{shortTitle}</span>
        {isNew && <NewBadge />}
        {setTag && (
          <span className='lx-dset' style={{ color: accentColor }}>
            {setTag}
          </span>
        )}
        <Chevron />
      </Link>
    </li>
  );
}
