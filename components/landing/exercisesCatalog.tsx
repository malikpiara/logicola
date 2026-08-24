import type { CSSProperties } from 'react';
import { spriteClip, gemClip } from '@/lib/pixel';
import {
  topics,
  drillTitle,
  topicIsMultiSet,
  type Topic,
} from '@/content/topics';
import { TopicIcon } from '@/components/nav/topicIcon';
import { DrillLink } from './drillLink';
import { ResumeBanner } from './resumeBanner';

/**
 * The landing page: masthead + the exercises catalogue, ported from
 * docs/landing-lab.html — Malik's decided composition (2026-08-17, two
 * passes, LP-cards in the file): Set L mint ground · compact display
 * masthead (H1 words unchanged from the old hero, register changed) ·
 * topic cards at BOTH widths · neutral white cards with the set colour
 * in gem icon-chips and tags · drill rows · resume banner · no mascot ·
 * verbatim copy.
 *
 * The insight this ports (Malik, same day, from mobile testing): the
 * drills surface ON the frontpage — the exercises menu stays as global
 * chrome, but the landing page no longer depends on it. Zero taps to
 * see every drill, vs three through the bottom sheet.
 *
 * IA + colours come from content/topics.ts (the nav lab's constants) —
 * no data lives here. Deliberately NOT ported: START HERE (LP7 kept
 * resume as the guide; whether START HERE returns as the first-visit
 * empty state is open), and the mascot (LP5 — leaning off; the lab
 * keeps it one dial away).
 */

// Scheme tokens, measured (WCAG ratios against the ground each sits
// on). Set L mint/plum — Malik's pick for the landing (lab LP11); it
// front-runs D11 for THIS surface only. When D11 lands, this block is
// the swap.
const LX_GROUND = '#CFF6DD'; // Set L mint (quizColors L surface, verbatim)
const LX_TYPE = '#3F0167'; // Set L plum · 12.67:1 on mint, 14.88:1 on white
const LX_HEAD = '#715790'; // eyebrow tier · 5.16:1 on mint, 6.06:1 on white
const LX_BODY = '#5F3781'; // one-liner on mint · 7.61:1
const LX_BLURB = '#693988'; // card blurbs on white · 8.26:1
const LX_HAIRLINE = '#E4DBEA'; // white mixed 14% toward plum — decorative
const LX_HOVER = '#F3F0F6'; // gem hover fill — white mixed 6% toward plum
// Focus stays the system green: every focusable here sits on a WHITE
// card (3.35:1 ✓). Green FAILS 1.4.11 on the mint itself (2.85:1) — if
// a focusable ever lands directly on the ground, derive a focus tier
// first (the lab § 2 finding).
const LX_FOCUS = '#05A24B';

const LX_VARS = {
  '--lx-ground': LX_GROUND,
  '--lx-type': LX_TYPE,
  '--lx-head': LX_HEAD,
  '--lx-body': LX_BODY,
  '--lx-blurb': LX_BLURB,
  '--lx-hair': LX_HAIRLINE,
  '--lx-hover': LX_HOVER,
  '--lx-focus': LX_FOCUS,
  // the drill rows' hover silhouette — a pseudo-element can only take
  // the clip through a variable
  '--lx-gem': gemClip(),
} as CSSProperties;

// Computed once — never a Tailwind arbitrary value (lib/pixel.ts rule).
const CARD_CLIP: CSSProperties = { clipPath: spriteClip(0, 16) };
const CHIP_CLIP = gemClip();

// The old hero's copy, VERBATIM (Malik kept it over the lab's proposed
// edit — LP6; the edit stays one dial away in the lab).
const H1 = 'Master Formal Logic';
const ONELINER =
  'Generate endless, error-free exercises with smart step-by-step hints. Works offline, directly in your browser.';

function TopicCard({
  topic,
  positionOffset,
}: {
  topic: Topic;
  positionOffset: number;
}) {
  const multiSet = topicIsMultiSet(topic);
  return (
    <li className='lx-cardw'>
      <div className='lx-card' style={CARD_CLIP}>
        <div className='lx-card-head'>
          <span
            className='lx-chip'
            style={{ background: topic.colors.surface, clipPath: CHIP_CLIP }}
          >
            <TopicIcon topicId={topic.id} color={topic.colors.ink} size={20} />
          </span>
          <h3 className='lx-card-name'>{topic.name}</h3>
          {/* professors assign by set letter (D6) — the header carries it
              for single-set topics; Informal tags each drill instead */}
          <span className='lx-card-set' style={{ color: topic.colors.accent }}>
            {topic.sets}
          </span>
        </div>
        <p className='lx-blurb'>{topic.blurb}</p>
        <ul className='lx-drills'>
          {topic.drills.map((entry, i) => (
            <DrillLink
              key={entry.quizPath}
              href={entry.quizPath}
              shortTitle={drillTitle(entry)}
              fullTitle={entry.title}
              topicId={topic.id}
              position={positionOffset + i + 1}
              setTag={multiSet ? entry.chapter : undefined}
              accentColor={topic.colors.accent}
              isNew={entry.isNew}
            />
          ))}
        </ul>
      </div>
    </li>
  );
}

export function ExercisesCatalog() {
  const drillCount = topics.reduce((sum, t) => sum + t.drills.length, 0);
  // 1-based position across the whole page, so funnel position reads
  // the same in PostHog regardless of topic boundaries
  const offsets: number[] = [];
  topics.reduce((acc, t) => {
    offsets.push(acc);
    return acc + t.drills.length;
  }, 0);

  return (
    <section className='lx' style={LX_VARS}>
      <div className='lx-wrap'>
        <h1 className='lx-display'>{H1}</h1>
        <p className='lx-oneliner'>{ONELINER}</p>
        <h2 className='lx-eyebrow'>
          Exercises
          <span className='lx-count'>
            {topics.length} topics · {drillCount} drills
          </span>
        </h2>
        {/* The slot always renders; the BANNER hydrates into it. A
            pre-paint inline script on the page marks <html> when
            logicola.last_drill exists, and CSS reserves the banner's
            box under that mark — so returning drillers get zero shift
            and first-time visitors get zero hole (2026-08-24, the CLS
            audit's #1: the unreserved banner alone blew the 0.1
            budget). */}
        <div className='lx-resume-slot'>
          <ResumeBanner />
        </div>
        <ul className='lx-grid'>
          {topics.map((topic, i) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              positionOffset={offsets[i]}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
