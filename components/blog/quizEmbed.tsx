'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Blog quiz embeds (Malik's ask, 2026-08-24): a real drill INSIDE a
 * post, for set announcements and marketing one-offs — Set Q first.
 * Engine reuse, never an iframe, never the full quiz shell (the
 * no-iframes decision): each embed is a small island over
 * useQuizState.
 *
 * Authoring contract — in the post's markdown, place:
 *
 *   <div data-quiz-embed="informal-definitions" data-count="3">
 *     <a href="/informal/definitions/quiz">Try the drill →</a>
 *   </div>
 *
 * The blog page splits the compiled HTML at these markers and mounts
 * the matching island; everywhere else the marker's inner link is
 * what renders (RSS readers, and unknown embed keys) — the body
 * pipeline stays plain HTML for the full-content feeds on purpose
 * (Malik, 2026-08-13).
 *
 * The registry mirrors components/quiz/generated/index.tsx: a
 * CLIENT-side next/dynamic map, one chunk per embed, so a question
 * bank ships only on posts that use it — the same placement that
 * keeps the bundle contract honest. Add marketing one-offs here, one
 * entry per key.
 */
/**
 * ssr: false is load-bearing: each embed draws its questions with
 * Math.random, and an SSR'd draw hydrates against a different client
 * draw (seen live: a hydration error and a full client regen). The
 * loading placeholder reserves the card's box — Set Q's 7-option card
 * measures 600px — so the island doesn't become its own layout shift.
 */
const EMBEDS: Record<string, ComponentType<{ count: number }>> = {
  'informal-definitions': dynamic(
    () => import('./embeds/setQEmbed').then((m) => m.SetQEmbed),
    {
      ssr: false,
      loading: () => (
        <div
          className='not-prose lx-embed'
          style={{ minHeight: 600 }}
          aria-hidden='true'
        >
          <p className='lx-embed-eyebrow'>SAMPLE DRILL</p>
        </div>
      ),
    }
  ),
};

export function QuizEmbed({
  embed,
  count = 3,
  fallbackHtml,
}: {
  embed: string;
  count?: number;
  /** The marker's inner HTML — rendered when the key is unknown. */
  fallbackHtml?: string;
}) {
  const Embed = EMBEDS[embed];
  if (!Embed) {
    return fallbackHtml ? (
      <div dangerouslySetInnerHTML={{ __html: fallbackHtml }} />
    ) : null;
  }
  return <Embed count={count} />;
}
