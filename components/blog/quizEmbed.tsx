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
 * Keys: `informal-definitions` (Set Q), `informal-fallacies` (Set R).
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
 * loading placeholder reserves the embedded quiz's min-height (640px,
 * matching QuizProps' embedded branch) so the island doesn't become
 * its own layout shift.
 */
/**
 * Each set's surface, so the reserved box is already the colour the drill
 * arrives in (2026-09-21). Copied deliberately rather than imported from
 * `quizColors.ts`: the placeholder renders in the BLOG chunk, and the
 * post has no SubSet to resolve a colour from until the drill's own chunk
 * has loaded — which is the moment this box exists to cover. Two values,
 * and a wrong one costs a flicker, not a bug.
 */
const EMBED_SURFACE: Record<string, string> = {
  'informal-definitions': '#D9CCF9', // Set Q
  'informal-fallacies': '#E4BDF7', // Set R — S1
};

/**
 * The reserved box. Same width, radius, surface and 640px floor as the
 * embedded quiz card, so the swap moves nothing — see `.lx-embed-skeleton`
 * and the arrival note in globals.css. Deliberately wordless: a
 * "LOADING THE DRILL…" line is a second thing to read and then lose,
 * and it used to sit on a white card the drill then replaced with lilac.
 */
function embedSkeleton(embed: string) {
  return function EmbedSkeleton() {
    return (
      // The `.lx-quiz-embed` wrapper is what OUTSETS the figure past the
      // prose column, and it lives inside each island — which is exactly
      // the thing that has not loaded yet. Without it here the reserved
      // box was a 756px column-width rectangle that became a 1108px one
      // the moment the drill landed (Malik spotted it, 2026-09-21). The
      // skeleton wears the same wrapper, so the box never changes size.
      <div
        className='not-prose lx-quiz-embed'
        style={
          {
            '--lx-embed-surface': EMBED_SURFACE[embed],
          } as React.CSSProperties
        }
      >
        <div className='lx-embed-skeleton' aria-hidden='true' />
      </div>
    );
  };
}

const EMBEDS: Record<
  string,
  ComponentType<{ count: number; pick?: string[] }>
> = {
  'informal-definitions': dynamic(
    () => import('./embeds/setQEmbed').then((m) => m.SetQEmbed),
    { ssr: false, loading: embedSkeleton('informal-definitions') }
  ),
  // Set R (2026-09-21). Generated bank, so `data-pick` takes fallacy
  // codes ("aa,sm"), not question ids — see setREmbed.tsx.
  'informal-fallacies': dynamic(
    () => import('./embeds/setREmbed').then((m) => m.SetREmbed),
    { ssr: false, loading: embedSkeleton('informal-fallacies') }
  ),
};

export function QuizEmbed({
  embed,
  count = 3,
  pick,
  fallbackHtml,
}: {
  embed: string;
  count?: number;
  /** `data-pick="3.29,3.30"` — pin these question ids instead of drawing. */
  pick?: string[];
  /** The marker's inner HTML — rendered when the key is unknown. */
  fallbackHtml?: string;
}) {
  const Embed = EMBEDS[embed];
  if (!Embed) {
    return fallbackHtml ? (
      <div dangerouslySetInnerHTML={{ __html: fallbackHtml }} />
    ) : null;
  }
  return <Embed count={count} pick={pick} />;
}
